import '../public/professional-certificates.js';
import {certificateDirectory, publicSitemap} from './public-directory.js';
import {demoEnabled, selectDataDirectory, seedDemoStaff, DEMO_STAFF_EMAIL, DEMO_STAFF_NAME} from './demo-mode.js';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, randomUUID } from 'node:crypto';
import { openDatabase } from './db.js';
import {createPayments} from './payments.js';
import {loadEnvFile} from 'node:process';
import { token,hash,passwordHash,passwordCheck,newTotpSecret,totpStep,seal,unseal } from './security.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const curriculum=JSON.parse(fs.readFileSync(path.join(root,'server/curriculum.json'),'utf8'));
const catalogue=globalThis.professionalCertificates;
const footerDirectory=certificateDirectory(catalogue);
const lessonsByCourse=new Map(curriculum.courses.map(c=>[c.slug,c.lessons]));
const courseMap=new Map(globalThis.professionalCertificates.map(c=>[c.slug,{
 ...c,hours:c.duration.endsWith(' hours')?parseInt(c.duration,10):0,
 lessons:lessonsByCourse.get(c.slug)||[]
}]));
const now=()=>new Date().toISOString();
class HttpError extends Error {constructor(status,message){super(message);this.status=status;}}
const fail=(status,message)=>{throw new HttpError(status,message)};
function text(v,min=1,max=200){if(typeof v!=='string'||v.trim().length<min||v.trim().length>max)fail(400,`Enter between ${min} and ${max} characters.`);return v.trim();}
function email(v){const value=text(v,3,254).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))fail(400,'Enter a valid email address.');return value;}
function password(v){if(typeof v!=='string'||v.length<12||v.length>128)fail(400,'Use a password between 12 and 128 characters.');return v;}
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));}
async function body(req){if(!req.headers['content-type']?.startsWith('application/json'))fail(415,'Send JSON.');let chunks=[],size=0;for await(const chunk of req){size+=chunk.length;if(size>100000)fail(413,'Request too large.');chunks.push(chunk);}try{const data=JSON.parse(Buffer.concat(chunks));if(!data||typeof data!=='object'||Array.isArray(data))throw Error();return data;}catch{fail(400,'Invalid JSON.');}}
async function rawBody(req){const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>1000000)fail(413,'Webhook too large.');chunks.push(chunk);}return Buffer.concat(chunks);}
function safeUser(u){return {id:u.id,name:u.name,email:u.email,role:u.role,status:u.status,created_at:u.created_at};}
function score(a){return Array.isArray(a)?curriculum.social.quiz.reduce((n,q,i)=>n+(a[i]===q.correct?1:0),0):0;}
function completed(data,slug){return (data.lessons?Object.values(data.lessons):[]).filter(p=>p.completedAt).length;}
function eligible(data,slug){if(slug!=='social-media')return false;const s=data.social||{};return completed(data,slug)===12&&(s.activities||[]).length===6&&s.activities.every(x=>x.trim().length>=40)&&s.projectSubmitted&&curriculum.social.projectFields.every(([key])=>(s.project?.[key]||'').trim().length>=40)&&s.checks?.length===3&&s.checks.every(Boolean)&&score(s.bestAnswers)>=5;}
function configuredOrigin(value){
 if(!value)return '';
 let url;try{url=new URL(value);}catch{throw Error('PUBLIC_ORIGIN must be a complete HTTPS origin.');}
 if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw Error('PUBLIC_ORIGIN must be an HTTPS origin without credentials, a path, query or fragment.');
 return url.origin;
}
export function createApp({dataDir=process.env.DATA_DIR||path.join(root,'data'),port=Number(process.env.PORT||3000),publicOrigin=process.env.PUBLIC_ORIGIN||'',stripeOptions={},paymentMode=process.env.STRIPE_MODE||'test',demoMode=demoEnabled()}={}){
 if(typeof demoMode!=='boolean')throw Error('demoMode must be a boolean.');
 if(!['test','live'].includes(paymentMode))throw Error('STRIPE_MODE must be test or live.');
 const livePayments=paymentMode==='live';
 if(livePayments&&(demoMode||!publicOrigin))throw Error('Live payments require hosted mode with demo mode disabled.');
 const sessionCookie=livePayments?'campus_live_session':demoMode?'campus_demo_session':'campus_session';
 const externalOrigin=configuredOrigin(publicOrigin);
 if(!Number.isInteger(port)||port<0||port>65535)throw Error('PORT must be an integer between 0 and 65535.');
 dataDir=selectDataDirectory(dataDir,demoMode);
 if(livePayments){
  const liveDir=path.join(path.resolve(dataDir),'live');
  fs.mkdirSync(liveDir,{recursive:true,mode:0o700});
  if(fs.lstatSync(liveDir).isSymbolicLink()||fs.realpathSync(liveDir)!==path.join(fs.realpathSync(dataDir),'live'))throw Error('Live storage must be a separate directory.');
  const marker=path.join(liveDir,'live-only');
  if(!fs.existsSync(marker)){
   if(fs.readdirSync(liveDir).length)throw Error('Use an empty live storage directory.');
   fs.writeFileSync(marker,'atlas-live-v1',{flag:'wx',mode:0o600});
  }
  if(fs.readFileSync(marker,'utf8')!=='atlas-live-v1')throw Error('Invalid live storage marker.');
  dataDir=liveDir;
 }
 fs.mkdirSync(dataDir,{recursive:true,mode:0o700});const db=openDatabase(path.join(dataDir,'campus.sqlite'));
 const keyFile=path.join(dataDir,'encryption.key');if(!fs.existsSync(keyFile))fs.writeFileSync(keyFile,randomBytes(32),{mode:0o600});const encryptionKey=fs.readFileSync(keyFile);
 const get=(sql,...args)=>db.prepare(sql).get(...args),all=(sql,...args)=>db.prepare(sql).all(...args),run=(sql,...args)=>db.prepare(sql).run(...args);
 for(const c of courseMap.values())run('INSERT INTO courses(slug,title,hours) VALUES(?,?,?) ON CONFLICT(slug) DO UPDATE SET title=excluded.title,hours=excluded.hours',c.slug,c.title,c.hours);
 const demoStaff=demoMode?seedDemoStaff(db):null;
 const payments=createPayments(db,{...stripeOptions,mode:paymentMode});
 const setupFile=path.join(dataDir,'setup-token.txt');let setupToken=null;
 if(!get("SELECT id FROM users WHERE role='staff'")){setupToken=fs.existsSync(setupFile)?fs.readFileSync(setupFile,'utf8').trim():token();fs.writeFileSync(setupFile,setupToken,{mode:0o600});}else if(fs.existsSync(setupFile))fs.unlinkSync(setupFile);
 const challenges=new Map(),limits=new Map();let origin,localOrigin;
 const audit=(u,action,target)=>run('INSERT INTO audit(actor,action,target,created_at) VALUES(?,?,?,?)',u?.id||null,action,target,now());
 const queue=(recipient,subject,message)=>run('INSERT INTO outbox VALUES(?,?,?,?,?,?)',randomUUID(),recipient,subject,message,'preview-only',now());
 function rate(req,key,max=30){const id=req.socket.remoteAddress+':'+key,t=Date.now();let r=limits.get(id);if(!r||r.until<t){r={n:0,until:t+600000};limits.set(id,r);}if(++r.n>max)fail(429,'Too many attempts. Please try again in 10 minutes.');if(limits.size>10000)for(const [k,v]of limits)if(v.until<t)limits.delete(k);}
 function sessionId(req){return req.headers.cookie?.split(';').map(part=>part.trim()).find(part=>part.startsWith(sessionCookie+'='))?.slice(sessionCookie.length+1);}
 function auth(req){const sid=sessionId(req);if(sid&&!/^[a-f0-9]{64}$/.test(sid))return null;if(!sid)return null;return get('SELECT u.* FROM users u JOIN sessions s ON u.id=s.user_id WHERE s.id=? AND s.expires>? AND u.status=\'active\'',hash(sid),Date.now())||null;}
 function login(res,u){const sid=token();run('DELETE FROM sessions WHERE expires<?',Date.now());run('INSERT INTO sessions VALUES(?,?,?)',hash(sid),u.id,Date.now()+8*3600000);res.setHeader('Set-Cookie',`${sessionCookie}=${sid}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${origin.startsWith('https:')?'; Secure':''}`);}
 const staff=u=>{if(!u||u.role!=='staff')fail(403,'Staff access required.');};
 const own=(u,id)=>{if(!u||(u.id!==id&&u.role!=='staff'))fail(403,'This record is not available.');};
 const course=slug=>{const c=courseMap.get(slug);if(!c)fail(404,'Course not found.');return c;};
 function enrol(u,slug){course(slug);const e=get('SELECT * FROM enrolments WHERE user_id=? AND course=?',u.id,slug);if(!e||e.status!=='active')fail(403,'An active, staff-approved enrolment is required.');return e;}
 function learning(id,slug){const r=get('SELECT * FROM learning WHERE user_id=? AND course=?',id,slug);return r?{revision:r.revision,...JSON.parse(r.data)}:{revision:0,lessons:{},social:{}};}
 function saveLearning(u,slug,b,mutate){enrol(u,slug);const data=learning(u.id,slug);if(b.revision!==data.revision)fail(409,'This course changed in another window. Reload to get the latest progress before saving again.');mutate(data);const revision=data.revision+1;delete data.revision;run('INSERT INTO learning VALUES(?,?,?,?,?) ON CONFLICT(user_id,course) DO UPDATE SET revision=excluded.revision,data=excluded.data,updated_at=excluded.updated_at',u.id,slug,revision,JSON.stringify(data),now());return {...data,revision};}
 function enrolments(id){return all('SELECT e.*,c.title,c.hours FROM enrolments e JOIN courses c ON c.slug=e.course WHERE user_id=?',id).map(e=>{const d=learning(id,e.course);return {...e,completed_lessons:completed(d,e.course),available_lessons:courseMap.get(e.course).lessons.length,course_complete:eligible(d,e.course),started:completed(d,e.course)>0||Object.keys(d.lessons||{}).length>0||!!d.social?.attempts,award:d.social?.award||null};});}
 function enquiry(u,id){const e=get('SELECT * FROM enquiries WHERE id=?',id);if(!e)fail(404,'Enquiry not found.');if(u?.role!=='staff'&&(!u||e.user_id!==u.id))fail(404,'Enquiry not found.');return e;}
 function detail(u,id){const e=enquiry(u,id);return {...e,messages:all(`SELECT id,author_name,kind,body,created_at FROM messages WHERE enquiry=? ${u.role==='staff'?'':"AND kind='message'"} ORDER BY created_at,rowid`,id)};}
 const server=http.createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','same-origin');res.setHeader('X-Frame-Options','DENY');res.setHeader('Cache-Control','no-store');
  if(demoMode)res.setHeader('X-Robots-Tag','noindex');
  // Inline handlers belong to the existing learning demonstrator; the portal itself uses external scripts only.
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  if(req.url?.startsWith('/checkout.html'))res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.stripe.com; connect-src 'self' https://*.stripe.com https://*.stripe.network; frame-src https://*.stripe.com https://*.stripe.network; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  try{
   // ARR can preserve the public Host or replace it with the loopback destination.
   // Never infer the public origin from client-supplied forwarding headers.
   if(![new URL(origin).host,new URL(localOrigin).host].includes(req.headers.host))fail(403,'Unexpected host.');
   const url=new URL(req.url,origin),p=url.pathname,method=req.method;
   // Stripe has no browser Origin or student session. Its raw-body signature is mandatory instead.
   if(p==='/api/stripe/webhook'&&method==='POST')return json(res,200,await payments.webhook(await rawBody(req),req.headers['stripe-signature']));
   if(!['GET','HEAD'].includes(method)&&req.headers.origin!==origin)fail(403,'Request origin rejected.');
   if(['GET','HEAD'].includes(method)&&['/student','/student/','/admin','/admin/'].includes(p)){
    res.writeHead(302,{Location:'/portal.html'+url.search});return res.end();
   }
   if(!p.startsWith('/api/')){
    if(!['GET','HEAD'].includes(method))fail(405,'Method not allowed.');
    if(p==='/sitemap.xml'){
     res.writeHead(200,{'Content-Type':'application/xml; charset=utf-8'});
     return res.end(method==='HEAD'?undefined:publicSitemap(origin,catalogue));
    }
    if(p==='/robots.txt'){
     res.writeHead(200,{'Content-Type':'text/plain; charset=utf-8'});
     return res.end(method==='HEAD'?undefined:`User-agent: *\nSitemap: ${origin}/sitemap.xml\n`);
    }
    const name=decodeURIComponent(p==='/'?'/index.html':p);const file=path.resolve(root,'public','.'+name);const publicRoot=path.join(root,'public')+path.sep;
    if(!file.startsWith(publicRoot)||name.split('/').some(part=>part.startsWith('.')))fail(404,'Not found.');
    const ext=path.extname(file).toLowerCase(),types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.svg':'image/svg+xml','.csv':'text/csv','.pdf':'application/pdf','.json':'application/json'};
    if(!types[ext]||!fs.existsSync(file)||!fs.statSync(file).isFile())fail(404,'Not found.');res.setHeader('Content-Type',types[ext]);res.statusCode=200;if(method==='HEAD')return res.end();
    if(name==='/index.html')return res.end((await fs.promises.readFile(file,'utf8')).replace('<!-- certificate-directory -->',()=>footerDirectory));
    fs.createReadStream(file).pipe(res);return;
   }
   const u=auth(req);
   if(method==='GET'&&p==='/api/config')return json(res,200,{mode:externalOrigin?'hosted-sandbox':'local-review',email:'preview-only',demoMode,...(demoMode?{demoStaff:{name:DEMO_STAFF_NAME,email:DEMO_STAFF_EMAIL}}:{}),setupRequired:!!setupToken,payments:{...payments.config(),ready:payments.config().ready&&(!livePayments||!setupToken)}});
   if(method==='GET'&&p==='/api/courses')return json(res,200,Array.from(courseMap.values(),({slug,title,hours,duration,tuition_pence,lessons})=>({
    slug,title,hours:hours||null,duration,tuition_pence,currency:'gbp',
    available:get('SELECT available FROM courses WHERE slug=?',slug).available,
    available_lessons:lessons.length,full_course:slug==='social-media'
   })));
   if(method==='POST'&&p==='/api/demo/staff-login'){
    if(!demoMode)fail(404,'Demo staff access is disabled.');
    rate(req,'demo-login',60);
    const user=get("SELECT * FROM users WHERE id=? AND role='staff' AND status='active'",demoStaff.id);
    if(!user)fail(403,'Demo staff access is unavailable.');
    login(res,user);audit(user,'demo.staff-login',user.id);return json(res,200,safeUser(user));
   }
   if(method==='POST'&&p==='/api/setup/start'){
    rate(req,'setup',10);const b=await body(req);if(!setupToken||typeof b.token!=='string'||hash(b.token)!==hash(setupToken))fail(403,'Invalid setup token.');
    const secret=newTotpSecret(),id=token();challenges.set(id,{email:livePayments?DEMO_STAFF_EMAIL:email(b.email),name:livePayments?DEMO_STAFF_NAME:text(b.name,2,100),password:await passwordHash(password(b.password)),secret,expires:Date.now()+600000});
    return json(res,200,{challenge:id,secret,uri:`otpauth://totp/Liberland:${encodeURIComponent(b.email)}?secret=${secret}&issuer=Liberland`});
   }
   if(method==='POST'&&p==='/api/setup/finish'){
    rate(req,'setup',10);const b=await body(req),c=challenges.get(b.challenge);if(!setupToken||!c||c.expires<Date.now())fail(400,'Setup expired. Start again.');const step=totpStep(c.secret,b.code);if(step===null)fail(400,'Authenticator code not accepted.');const id=randomUUID();
    run('INSERT INTO users(id,email,name,password,role,totp,totp_step,created_at) VALUES(?,?,?,?,?,?,?,?)',id,c.email,c.name,c.password,'staff',seal(c.secret,encryptionKey),step,now());setupToken=null;challenges.clear();fs.unlinkSync(setupFile);const admin=get('SELECT * FROM users WHERE id=?',id);login(res,admin);audit(admin,'staff.bootstrap',id);return json(res,201,safeUser(admin));
   }
   if(method==='POST'&&p==='/api/register'){
    rate(req,'register',10);const b=await body(req),e=email(b.email),n=text(b.name,2,100),pw=password(b.password);if(get('SELECT id FROM users WHERE email=?',e))fail(409,'Registration could not be completed. Try signing in or contact staff.');const id=randomUUID();
    run('INSERT INTO users(id,email,name,password,role,created_at) VALUES(?,?,?,?,?,?)',id,e,n,await passwordHash(pw),'student',now());const student=get('SELECT * FROM users WHERE id=?',id);login(res,student);audit(student,'account.register',id);return json(res,201,safeUser(student));
   }
   if(method==='POST'&&p==='/api/login'){
    rate(req,'login',20);const b=await body(req),e=email(b.email),pw=password(b.password),user=get('SELECT * FROM users WHERE email=?',e);
    // Hash even unknown accounts to avoid a cheap account-existence timing signal.
    const valid=await passwordCheck(pw,user?.password||'00000000000000000000000000000000:'+ '00'.repeat(64));
    if(!user||!valid||user.status!=='active'||(demoMode&&user.id===demoStaff.id))fail(401,'Sign-in details not accepted.');
    if(user.role==='staff'){const step=totpStep(unseal(user.totp,encryptionKey),b.code,user.totp_step);if(step===null)fail(401,'A fresh authenticator code is required for staff.');run('UPDATE users SET totp_step=? WHERE id=?',step,user.id);}
    login(res,user);audit(user,'account.login',user.id);return json(res,200,safeUser(user));
   }
   if(method==='POST'&&p==='/api/logout'){const sid=sessionId(req);if(sid)run('DELETE FROM sessions WHERE id=?',hash(sid));res.setHeader('Set-Cookie',`${sessionCookie}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${origin.startsWith('https:')?'; Secure':''}`);return json(res,200,{ok:true});}
   if(method==='POST'&&p==='/api/enquiries'){
    rate(req,'enquiry',10);const b=await body(req);if(b.website)fail(400,'Unable to submit.');const n=u?.name||text(b.name,2,100),e=u?.email||email(b.email),subject=text(b.subject,3,160),message=text(b.message,5,5000),slug=b.course||null;if(slug)course(slug);const id=randomUUID(),at=now();
    db.exec('BEGIN');try{run('INSERT INTO enquiries(id,user_id,name,email,subject,course,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)',id,u?.id||null,n,e,subject,slug,at,at);run('INSERT INTO messages VALUES(?,?,?,?,?,?,?)',randomUUID(),id,u?.id||null,n,'message',message,at);queue(e,'Enquiry received: '+subject,'Your reference is '+id+'. Email delivery is not enabled in this local review.');audit(u,'enquiry.create',id);db.exec('COMMIT');}catch(err){db.exec('ROLLBACK');throw err;}return json(res,201,{id});
   }
   if(!u)fail(401,'Please sign in.');
   if(method==='POST'&&p==='/api/checkout'){
    if(livePayments&&setupToken)fail(503,'Checkout opens after staff setup.');
    rate(req,'checkout',30);const b=await body(req),c=course(b.course);if(!get('SELECT available FROM courses WHERE slug=?',c.slug).available)fail(400,'This course is not accepting enrolments.');return json(res,200,await payments.create(u,c,origin));
   }
   if(method==='GET'&&p==='/api/payments')return json(res,200,payments.list(u));
   if(method==='GET'&&p==='/api/checkout-status'){
    const payment=payments.status(u,url.searchParams.get('session_id'));
    return json(res,200,{...payment,has_lessons:course(payment.course).lessons.length>0});
   }
   if(method==='POST'&&p==='/api/payments/reconcile'){rate(req,'reconcile',60);const b=await body(req);return json(res,200,await payments.reconcile(u,b.session_id));}
   if(method==='GET'&&p==='/api/me')return json(res,200,{user:safeUser(u),enrolments:enrolments(u.id)});
   if(method==='PATCH'&&p==='/api/me'){const b=await body(req);run('UPDATE users SET name=? WHERE id=?',text(b.name,2,100),u.id);audit(u,'profile.update',u.id);return json(res,200,safeUser(get('SELECT * FROM users WHERE id=?',u.id)));}
   if(method==='GET'&&p==='/api/export'){return json(res,200,{profile:safeUser(u),enrolments:enrolments(u.id),payments:payments.list(u),learning:all('SELECT course,data,updated_at FROM learning WHERE user_id=?',u.id).map(r=>({...r,data:JSON.parse(r.data)})),enquiries:all('SELECT id FROM enquiries WHERE user_id=?',u.id).map(e=>detail(u,e.id))});}
   if(method==='POST'&&p==='/api/enrolments'){
    if(u.role!=='student')fail(400,'Use a student account to request enrolment.');const b=await body(req);course(b.course);if(!get('SELECT available FROM courses WHERE slug=?',b.course).available)fail(400,'This course is not accepting requests.');
    run("INSERT OR IGNORE INTO enrolments VALUES(?,?,'pending',?,?)",u.id,b.course,now(),now());audit(u,'enrolment.request',b.course);return json(res,201,enrolments(u.id));
   }
   const lm=p.match(/^\/api\/learning\/([a-z-]+)(?:\/(assessment|quiz|award))?$/);
   if(lm){const slug=lm[1],action=lm[2];enrol(u,slug);if(method==='GET'&&!action)return json(res,200,learning(u.id,slug));if(method!=='PUT'&&method!=='POST')fail(405,'Method not allowed.');const b=await body(req);
    const saved=saveLearning(u,slug,b,data=>{
     data.lessons||={};data.social||={};const s=data.social;
     if(!action){const lesson=course(slug).lessons.find(l=>l.id===b.lesson);if(!lesson)fail(400,'Unknown lesson.');const step=b.step,answer=b.answer;if(!Number.isInteger(step)||step<0||step>4||!(answer===null||Number.isInteger(answer)&&answer>=0&&answer<lesson.choices.length))fail(400,'Invalid lesson progress.');if(step>=3&&answer===null||step===4&&answer!==lesson.correct)fail(400,'Complete the answer check first.');data.lessons[lesson.id]={step,answer,completedAt:data.lessons[lesson.id]?.completedAt||(step===4?now():null)};data.activeLesson=lesson.id;}
     else if(slug!=='social-media')fail(400,'Assessment is not available for this course.');
     else if(action==='assessment'){
      if(s.award)fail(409,'This sample award has already been issued; assessment work is read-only.');
      if(!Array.isArray(b.activities)||b.activities.length!==6||!b.activities.every(x=>typeof x==='string'&&x.length<=4000)||!Array.isArray(b.checks)||b.checks.length!==3||!b.checks.every(x=>typeof x==='boolean'))fail(400,'Invalid assessment.');
      s.activities=b.activities;s.checks=b.checks;s.project={};for(const [k]of curriculum.social.projectFields)s.project[k]=typeof b.project?.[k]==='string'?b.project[k].slice(0,4000):'';
      s.answers=Array.isArray(b.answers)&&b.answers.length===6?b.answers.map(a=>Number.isInteger(a)&&a>=0&&a<3?a:null):Array(6).fill(null);
      s.projectSubmitted=b.projectSubmitted===true&&curriculum.social.projectFields.every(([k])=>s.project[k].trim().length>=40)&&s.checks.every(Boolean);
     }else if(action==='quiz'){
      if(s.award)fail(409,'This sample award has already been issued.');
      if(!Array.isArray(b.answers)||b.answers.length!==6||!b.answers.every((a,i)=>Number.isInteger(a)&&a>=0&&a<curriculum.social.quiz[i].choices.length))fail(400,'Answer all six questions.');
      s.answers=b.answers;s.lastResult=b.answers;s.attempts=(s.attempts||0)+1;if(!s.bestAnswers||score(b.answers)>score(s.bestAnswers))s.bestAnswers=b.answers;
     }else if(action==='award'){
      if(!eligible(data,slug))fail(403,'Complete all course requirements first.');if(!s.award){s.award={name:u.name,id:'LLU-SMA-DEMO-'+randomBytes(8).toString('hex').toUpperCase(),date:now(),courseVersion:1};audit(u,'sample-certificate.issue',s.award.id);}
     }
    });return json(res,200,saved);
   }
   if(method==='GET'&&p==='/api/enquiries')return json(res,200,u.role==='staff'?all('SELECT * FROM enquiries ORDER BY updated_at DESC'):all('SELECT id,subject,status,course,created_at,updated_at FROM enquiries WHERE user_id=? ORDER BY updated_at DESC',u.id));
   const em=p.match(/^\/api\/enquiries\/([a-f0-9-]+)(?:\/(messages))?$/);
   if(em){const id=em[1],e=enquiry(u,id);if(method==='GET')return json(res,200,detail(u,id));const b=await body(req);
    if(method==='POST'&&em[2]){const kind=b.kind==='note'?'note':'message';if(kind==='note')staff(u);const message=text(b.body,1,5000);const at=now();db.exec('BEGIN');try{run('INSERT INTO messages VALUES(?,?,?,?,?,?,?)',randomUUID(),id,u.id,u.name,kind,message,at);run("UPDATE enquiries SET updated_at=?,status=CASE WHEN ?='student' THEN 'open' ELSE status END WHERE id=?",at,u.role,id);if(u.role==='staff'&&kind==='message')queue(e.email,'Reply: '+e.subject,message+'\n\nContinue the conversation in your student space. Email replies are not imported.');audit(u,kind==='note'?'enquiry.note':'enquiry.reply',id);db.exec('COMMIT');}catch(err){db.exec('ROLLBACK');throw err;}return json(res,201,detail(u,id));}
    if(method==='PATCH'){staff(u);if(!['open','resolved'].includes(b.status))fail(400,'Invalid enquiry status.');const assigned=b.assigned_to||null;if(assigned&&!get("SELECT id FROM users WHERE id=? AND role='staff' AND status='active'",assigned))fail(400,'Choose an active staff member.');run('UPDATE enquiries SET status=?,assigned_to=?,updated_at=? WHERE id=?',b.status,assigned,now(),id);audit(u,'enquiry.update',id);return json(res,200,detail(u,id));}
   }
   if(p.startsWith('/api/admin')){
    staff(u);
    if(method==='GET'&&p==='/api/admin/payments')return json(res,200,payments.adminList());
    if(method==='GET'&&p==='/api/admin/dashboard'){
     const students=all("SELECT * FROM users WHERE role='student' ORDER BY created_at DESC").map(x=>({...safeUser(x),enrolments:enrolments(x.id)})),es=students.flatMap(x=>x.enrolments);
     return json(res,200,{students,staff:all("SELECT id,name FROM users WHERE role='staff' AND status='active'"),metrics:{students:students.length,pending:es.filter(e=>e.status==='pending').length,enrolled:es.filter(e=>e.status==='active').length,in_progress:es.filter(e=>e.status==='active'&&e.started&&!e.course_complete).length,completed:es.filter(e=>e.course_complete).length,enquiries:get("SELECT count(*) AS n FROM enquiries WHERE status='open'").n},audit:all('SELECT * FROM audit ORDER BY id DESC LIMIT 100'),outbox:all('SELECT * FROM outbox ORDER BY created_at DESC LIMIT 100')});
    }
    if(method==='POST'&&p==='/api/admin/enrolments'){
     const b=await body(req),student=get("SELECT * FROM users WHERE id=? AND role='student'",b.user_id);if(!student||student.status!=='active')fail(400,'Choose an active student.');course(b.course);if(!['pending','active','paused'].includes(b.status))fail(400,'Invalid enrolment status.');
     run('INSERT INTO enrolments VALUES(?,?,?,?,?) ON CONFLICT(user_id,course) DO UPDATE SET status=excluded.status,updated_at=excluded.updated_at',b.user_id,b.course,b.status,now(),now());audit(u,'enrolment.'+b.status,b.user_id+':'+b.course);return json(res,200,enrolments(b.user_id));
    }
    const um=p.match(/^\/api\/admin\/students\/([a-f0-9-]+)$/);
    if(um){const id=um[1],student=get("SELECT * FROM users WHERE id=? AND role='student'",id);if(!student)fail(404,'Student not found.');
     if(method==='GET')return json(res,200,{profile:safeUser(student),enrolments:enrolments(id),learning:all('SELECT course,data,updated_at FROM learning WHERE user_id=?',id).map(r=>({...r,data:JSON.parse(r.data)})),enquiries:all('SELECT id FROM enquiries WHERE user_id=?',id).map(e=>detail(u,e.id))});
     const b=await body(req);if(method==='PATCH'){if(!['active','suspended'].includes(b.status))fail(400,'Invalid account status.');run('UPDATE users SET status=? WHERE id=?',b.status,id);run('DELETE FROM sessions WHERE user_id=?',id);audit(u,'student.'+b.status,id);return json(res,200,{ok:true});}
     if(method==='DELETE'){if(b.confirm!==student.email)fail(400,'Type the student email to confirm deletion.');db.exec('BEGIN');try{const owned=all('SELECT id FROM enquiries WHERE user_id=?',id);for(const q of owned)run('DELETE FROM enquiries WHERE id=?',q.id);run('DELETE FROM outbox WHERE recipient=?',student.email);run("UPDATE messages SET author_name='Deleted user' WHERE author=?",id);payments.scrubUser(id);run('DELETE FROM users WHERE id=?',id);audit(u,'student.delete',id);db.exec('COMMIT');}catch(err){db.exec('ROLLBACK');throw err;}return json(res,200,{ok:true});}
    }
   }
   fail(404,'Not found.');
  }catch(err){if(!res.headersSent)json(res,err.status||500,{error:err.status?err.message:'The request could not be completed.'});else res.end();if(!err.status)console.error('Request error:',err.message);}
 });
 return {server,db,setupToken,dataDir,start:()=>new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',()=>{server.removeListener('error',reject);localOrigin='http://127.0.0.1:'+server.address().port;origin=externalOrigin||localOrigin;resolve(localOrigin);});}),close:()=>new Promise(resolve=>server.close(()=>{db.close();resolve();}))};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(fs.existsSync(path.join(root,'.env')))loadEnvFile(path.join(root,'.env'));
 const app=createApp({stripeOptions:{secretKey:process.env.STRIPE_SECRET_KEY,publishableKey:process.env.STRIPE_PUBLISHABLE_KEY,webhookSecret:process.env.STRIPE_WEBHOOK_SECRET}});const url=await app.start();console.log(`Liberland sandbox: ${process.env.PUBLIC_ORIGIN||url}/portal.html\nBackend listens on ${url}; email previews are not sent. Stripe is sandbox-only.\nData: ${app.dataDir}`);if(app.setupToken)console.log(`First staff setup token is in ${path.join(app.dataDir,'setup-token.txt')}. Open the portal and choose First staff setup.`);
}
