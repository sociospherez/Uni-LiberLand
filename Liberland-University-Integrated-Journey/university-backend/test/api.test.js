import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {createApp} from '../server/app.js';import {totp} from '../server/security.js';
import {backup,DatabaseSync} from 'node:sqlite';
const curriculum=JSON.parse(fs.readFileSync(new URL('../server/curriculum.json',import.meta.url)));
test('Accounts, access boundaries, progress, enquiries and persistence',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'liberland-test-'));let app=createApp({dataDir:dir,port:0}),base=await app.start();
 function client(){let cookie='';return async(p,method='GET',b,expected=200,origin=base)=>{const r=await fetch(base+'/api'+p,{method,headers:{Origin:origin,Cookie:cookie,...(b?{'Content-Type':'application/json'}:{})},body:b?JSON.stringify(b):undefined});if(r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];const j=await r.json();assert.equal(r.status,expected,JSON.stringify(j));return j;};}
 const staff=client(),alice=client(),bob=client(),guest=client();
 try{
  await guest('/admin/dashboard','GET',null,401);
  const setup=await staff('/setup/start','POST',{token:app.setupToken,name:'Review Administrator',email:'staff@example.test',password:'a strong staff password'},200);
  const admin=await staff('/setup/finish','POST',{challenge:setup.challenge,code:totp(setup.secret)},201);
  await guest('/setup/start','POST',{token:'invalid'},403);
  const a=await alice('/register','POST',{name:'Alice Learner',email:'alice@example.test',password:'a strong learner password',role:'staff'},201);
  const b=await bob('/register','POST',{name:'Bob Learner',email:'bob@example.test',password:'another strong password'},201);
  assert.equal(a.role,'student');await alice('/admin/dashboard','GET',null,403);
  await alice('/me','PATCH',{name:'Forged'},403,'https://untrusted.example');
  await alice('/learning/social-media','GET',null,403);
  await alice('/enrolments','POST',{course:'social-media'},201);await alice('/enrolments','POST',{course:'social-media'},201);
  assert.equal((await alice('/me')).enrolments.length,1);
  await alice('/learning/social-media','GET',null,403);
  await staff('/admin/enrolments','POST',{user_id:a.id,course:'social-media',status:'active'});
  let data=await alice('/learning/social-media');
  await bob('/learning/social-media','GET',null,403);
  await alice('/learning/social-media/award','POST',{revision:data.revision},403);
  const first=curriculum.courses.find(c=>c.slug==='social-media').lessons[0];
  await alice('/learning/social-media','PUT',{revision:0,lesson:first.id,step:4,answer:(first.correct+1)%3},400);
  for(const lesson of curriculum.courses.find(c=>c.slug==='social-media').lessons)data=await alice('/learning/social-media','PUT',{revision:data.revision,lesson:lesson.id,step:4,answer:lesson.correct});
  await alice('/learning/social-media','PUT',{revision:0,lesson:first.id,step:0,answer:null},409);
  await alice('/learning/social-media/award','POST',{revision:data.revision},403);
  const project=Object.fromEntries(curriculum.social.projectFields.map(([k])=>[k,'A detailed self-reviewed response for this local integration test with sufficient length.']));
  data=await alice('/learning/social-media/assessment','PUT',{revision:data.revision,activities:Array(6).fill('A detailed activity response covering the evidence and limitations of the example.'),project,checks:[true,true,true],projectSubmitted:true,answers:Array(6).fill(null),award:{id:'FAKE'}});
  data=await alice('/learning/social-media/quiz','POST',{revision:data.revision,answers:curriculum.social.quiz.map(q=>(q.correct+1)%3)});
  await alice('/learning/social-media/award','POST',{revision:data.revision},403);
  data=await alice('/learning/social-media/quiz','POST',{revision:data.revision,answers:curriculum.social.quiz.map(q=>q.correct)});
  data=await alice('/learning/social-media/award','POST',{revision:data.revision,name:'Forged Name'});assert.equal(data.social.award.name,a.name);assert.match(data.social.award.id,/^LLU-SMA-DEMO-/);
  const award=data.social.award.id;data=await alice('/learning/social-media/award','POST',{revision:data.revision});assert.equal(data.social.award.id,award);
  await staff('/admin/enrolments','POST',{user_id:a.id,course:'social-media',status:'paused'});await alice('/learning/social-media','GET',null,403);
  await staff('/admin/enrolments','POST',{user_id:a.id,course:'social-media',status:'active'});
  const thread=await alice('/enquiries','POST',{subject:'Course support',message:'Could you help with the course?',course:'social-media'},201);
  await bob('/enquiries/'+thread.id,'GET',null,404);await bob('/enquiries/'+thread.id+'/messages','POST',{body:'Intrusion'},404);
  await alice('/enquiries/'+thread.id+'/messages','POST',{kind:'note',body:'Attempt internal note'},403);
  await staff('/enquiries/'+thread.id+'/messages','POST',{kind:'note',body:'Staff-only sensitive note'},201);
  await staff('/enquiries/'+thread.id+'/messages','POST',{body:'Your course is available.'},201);
  assert.equal((await alice('/enquiries/'+thread.id)).messages.length,2);
  assert.equal((await staff('/enquiries/'+thread.id)).messages.length,3);
  await staff('/enquiries/'+thread.id,'PATCH',{status:'resolved',assigned_to:admin.id});
  await alice('/enquiries/'+thread.id+'/messages','POST',{body:'Another question, please.'},201);assert.equal((await alice('/enquiries/'+thread.id)).status,'open');
  const g=await guest('/enquiries','POST',{name:'Visitor',email:'alice@example.test',subject:'Anonymous question',message:'Do you offer any other courses?'},201);
  await alice('/enquiries/'+g.id,'GET',null,404); // matching email alone must not grant ownership
  const dashboard=await staff('/admin/dashboard');assert.equal(dashboard.metrics.students,2);assert.equal(dashboard.metrics.completed,1);assert(dashboard.outbox.every(m=>!m.body.includes('Staff-only sensitive note')));
  assert(!JSON.stringify(await alice('/export')).includes('Staff-only sensitive note'));
  assert(!app.db.prepare('SELECT password FROM users WHERE id=?').get(a.id).password.includes('learner'));
  const backupPath=path.join(dir,'backup.sqlite');await backup(app.db,backupPath);const restored=new DatabaseSync(backupPath);assert.equal(restored.prepare('SELECT count(*) AS n FROM users').get().n,3);assert.equal(restored.prepare('SELECT count(*) AS n FROM learning').get().n,1);restored.close();
  await app.close();app=createApp({dataDir:dir,port:0});base=await app.start();assert.equal(app.setupToken,null);
  const nextDevice=client();await nextDevice('/login','POST',{email:a.email,password:'a strong learner password'});assert.equal((await nextDevice('/learning/social-media')).social.award.id,award);
  await nextDevice('/logout','POST',{});await nextDevice('/me','GET',null,401);
  const staffLogin=client();await staffLogin('/login','POST',{email:admin.email,password:'a strong staff password'},401);
  // Reset last-used counter only in the test fixture; real logins reject reused authenticator codes.
  app.db.prepare('UPDATE users SET totp_step=-1 WHERE id=?').run(admin.id);
  await staffLogin('/login','POST',{email:admin.email,password:'a strong staff password',code:totp(setup.secret)});
  await staffLogin('/admin/students/'+b.id,'PATCH',{status:'suspended'});await bob('/me','GET',null,401);
  await staffLogin('/admin/students/'+b.id,'DELETE',{confirm:'wrong'},400);await staffLogin('/admin/students/'+b.id,'DELETE',{confirm:b.email});
  assert.equal((await staffLogin('/admin/dashboard')).metrics.students,1);
  const missing=await fetch(base+'/server/app.js');assert.equal(missing.status,404);
 }finally{await app.close();fs.rmSync(dir,{recursive:true,force:true});}
});
