import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {createApp} from '../server/app.js';
import {execFileSync} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';
import {demoEnabled,selectDataDirectory} from '../server/demo-mode.js';

test('Demo staff can manage sample enrolments and enquiries without access to normal records',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'atlas-demo-'));
 let app=createApp({dataDir:dir,port:0,demoMode:false}),base=await app.start();
 const call=async(p,method='GET',body,cookie='',origin=base)=>{
  const r=await fetch(base+'/api'+p,{method,headers:{Origin:origin,Cookie:cookie,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]||'',cookieHeader:r.headers.get('set-cookie')||''};
 };
 let normalCookie,demoCookie,studentId,threadId;
 try {
  assert.equal((await call('/config')).data.demoMode,false);
  assert.equal((await call('/demo/staff-login','POST',{})).status,404);
  const real=await call('/register','POST',{name:'Normal Learner',email:'normal@example.test',password:'normal test password'});normalCookie=real.cookie;
  await call('/enquiries','POST',{name:'Normal visitor',email:'private@example.test',subject:'Normal private lead',message:'This lead must never be visible in demo.'});
  await app.close();app=createApp({dataDir:dir,port:0,demoMode:true});base=await app.start();
  assert.equal(app.dataDir,path.join(dir,'demo'));assert.equal(app.setupToken,null);
  assert.equal((await call('/me','GET',null,normalCookie)).status,401);
  assert.equal((await call('/demo/staff-login','POST',{},'','https://wrong.example')).status,403);
  assert.equal((await call('/demo/staff-login')).status,401);
  const cfg=(await call('/config')).data;assert.equal(cfg.demoMode,true);assert.equal(cfg.demoStaff.email,'staff.admin@universityofliberland.land');
  const login=await call('/demo/staff-login','POST',{});assert.equal(login.status,200);demoCookie=login.cookie;
  assert.match(login.cookieHeader,/HttpOnly/);assert.match(login.cookieHeader,/SameSite=Strict/);assert.match(demoCookie,/^campus_demo_session=/);
  assert.equal(login.data.name,'Staff Admin');assert.equal(login.data.role,'staff');
  assert.equal((await call('/admin/dashboard','GET',null,demoCookie)).data.metrics.students,0);
  assert.equal((await call('/enquiries','GET',null,demoCookie)).data.length,0);
  const learner=await call('/register','POST',{name:'Demo Learner',email:'demo-learner@example.test',password:'demo learner password'});studentId=learner.data.id;
  await call('/enrolments','POST',{course:'social-media'},learner.cookie);
  const approved=await call('/admin/enrolments','POST',{user_id:studentId,course:'social-media',status:'active'},demoCookie);assert.equal(approved.status,200);
  assert.equal((await call('/me','GET',null,learner.cookie)).data.enrolments[0].status,'active');
  const enq=await call('/enquiries','POST',{name:'Demo Visitor',email:'visitor@example.test',subject:'Honorary Recognition demo enquiry',message:'A sample question for the demo staff inbox.'});assert.equal(enq.status,201);threadId=enq.data.id;
  assert.equal((await call('/enquiries','GET',null,demoCookie)).data.length,1);
  assert.equal((await call('/enquiries/'+threadId,'PATCH',{status:'resolved',assigned_to:login.data.id},demoCookie)).status,200);
  assert.equal((await call('/enquiries/'+threadId+'/messages','POST',{kind:'note',body:'Demo follow-up completed.'},demoCookie)).status,201);
  const backupDir=path.join(dir,'backups');
  execFileSync(process.execPath,['server/backup.js'],{cwd:path.resolve('.'),env:{...process.env,DATA_DIR:dir,BACKUP_DIR:backupDir},stdio:'pipe'});
  const snapshots=fs.readdirSync(backupDir).filter(name=>name.endsWith('.sqlite'));assert.equal(snapshots.length,2);
  for(const name of snapshots){const snap=new DatabaseSync(path.join(backupDir,name),{readOnly:true});try{assert.equal(snap.prepare('SELECT count(*) n FROM enquiries').get().n,1);if(name.startsWith('campus-demo-'))assert.equal(snap.prepare("SELECT email FROM users WHERE role='staff'").get().email,'staff.admin@universityofliberland.land');else assert.equal(snap.prepare('SELECT email FROM users').get().email,'normal@example.test');}finally{snap.close();}}
  await app.close();app=createApp({dataDir:dir,port:0,demoMode:false});base=await app.start();
  assert.equal((await call('/demo/staff-login','POST',{})).status,404);
  assert.equal((await call('/admin/dashboard','GET',null,demoCookie)).status,401);
  assert.equal((await call('/me','GET',null,normalCookie)).data.user.email,'normal@example.test');
  assert.equal(app.db.prepare('SELECT count(*) n FROM enquiries').get().n,1);
  assert.equal(app.db.prepare('SELECT id FROM users WHERE id=?').get(studentId),undefined);
  assert.equal(app.db.prepare("SELECT id FROM users WHERE email='staff.admin@universityofliberland.land'").get(),undefined);
  await app.close();app=createApp({dataDir:dir,port:0,demoMode:true});base=await app.start();
  assert.equal((await call('/me','GET',null,demoCookie)).status,401); // old demo session stays invalid after re-enable
  const fresh=await call('/demo/staff-login','POST',{});
  assert.equal((await call('/enquiries/'+threadId,'GET',null,fresh.cookie)).data.status,'resolved'); // sample records persist
  assert.equal(app.db.prepare("SELECT count(*) n FROM audit WHERE action='demo.staff-login'").get().n,2);
  await call('/logout','POST',{},fresh.cookie);assert.equal((await call('/me','GET',null,fresh.cookie)).status,401);
 } finally {await app.close();fs.rmSync(dir,{recursive:true,force:true});}
});

test('Demo mode defaults off and refuses ambiguous flags and unmarked existing data',()=>{
 assert.equal(demoEnabled('false'),false);assert.equal(demoEnabled('true'),true);
 for(const value of ['1','yes','TRUE'])assert.throws(()=>demoEnabled(value));
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'atlas-demo-guard-'));
 try{fs.mkdirSync(path.join(dir,'demo'));fs.writeFileSync(path.join(dir,'demo/campus.sqlite'),'existing');assert.throws(()=>selectDataDirectory(dir,true),/not marked/);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
