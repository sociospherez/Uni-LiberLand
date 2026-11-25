import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {execFileSync} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';
import {fileURLToPath} from 'node:url';
import {createApp} from '../server/app.js';

const publicOrigin='https://universityofliberland.land';
function request(base,route,{method='GET',headers={},body}={}){
 return new Promise((resolve,reject)=>{
  const req=http.request(new URL(route,base),{method,headers:{...headers,...(body?{'Content-Type':'application/json'}:{})}},res=>{
   const chunks=[];res.on('data',c=>chunks.push(c));res.on('end',()=>{const text=Buffer.concat(chunks).toString();resolve({status:res.statusCode,headers:res.headers,text});});
  });req.on('error',reject);req.end(body?JSON.stringify(body):undefined);
 });
}
test('IIS hosting: explicit origin, Secure sessions, portal aliases and Stripe return URL',async()=>{
 const dataDir=fs.mkdtempSync(path.join(os.tmpdir(),'atlas-hosting-'));let checkoutParams;
 const stripeClient={checkout:{sessions:{create:async p=>{checkoutParams=p;return {id:'cs_test_hosted',client_secret:'test-only',status:'open',payment_status:'unpaid',livemode:false,mode:'payment',amount_total:p.line_items[0].price_data.unit_amount,currency:p.line_items[0].price_data.currency,metadata:p.metadata,client_reference_id:p.client_reference_id};}}}};
 const app=createApp({dataDir,port:0,publicOrigin,stripeOptions:{secretKey:'sk_test_fixture',publishableKey:'pk_test_fixture',webhookSecret:'whsec_test_fixture',stripeClient}});
 const base=await app.start();
 try{
  assert.equal((await request(base,'/api/config')).status,200); // ARR destination Host
  const config=await request(base,'/api/config',{headers:{Host:'universityofliberland.land'}});
  assert.equal(config.status,200);assert.equal(JSON.parse(config.text).mode,'hosted-sandbox');
  assert.equal((await request(base,'/api/config',{headers:{Host:'attacker.example'}})).status,403);
  const form={name:'Hosted Student',email:'hosted@example.test',password:'a hosted test password'};
  for(const origin of [base,'https://attacker.example']){
   assert.equal((await request(base,'/api/register',{method:'POST',headers:{Origin:origin,'X-Forwarded-Host':'universityofliberland.land','X-Forwarded-Proto':'https'},body:form})).status,403);
  }
  const registration=await request(base,'/api/register',{method:'POST',headers:{Origin:publicOrigin},body:form});
  assert.equal(registration.status,201,registration.text);
  const cookie=registration.headers['set-cookie'][0];
  assert.match(cookie,/; Secure/);assert.match(cookie,/; HttpOnly/);assert.match(cookie,/; SameSite=Strict/);
  const session=cookie.split(';')[0];
  const checkout=await request(base,'/api/checkout',{method:'POST',headers:{Origin:publicOrigin,Cookie:session},body:{course:'excel'}});
  assert.equal(checkout.status,200,checkout.text);assert(checkoutParams.return_url.startsWith(publicOrigin+'/payment-return.html'));
  const logout=await request(base,'/api/logout',{method:'POST',headers:{Origin:publicOrigin,Cookie:session},body:{}});
  assert.equal(logout.status,200);assert.match(logout.headers['set-cookie'][0],/; Secure/);
  assert.equal((await request(base,'/api/me',{headers:{Cookie:session}})).status,401);
  for(const route of ['/admin','/admin/','/student','/student/']){
   const response=await request(base,route+'?course=excel');assert.equal(response.status,302);assert.equal(response.headers.location,'/portal.html?course=excel');
  }
  // Files containing server code, credentials, accounts or keys must never be served.
  for(const route of ['/server/app.js','/.env','/data/campus.sqlite','/data/encryption.key'])assert.equal((await request(base,route)).status,404);
 }finally{await app.close();fs.rmSync(dataDir,{recursive:true,force:true});}
});
test('Unsafe hosted origins and invalid ports fail before creating storage',()=>{
 for(const value of ['http://universityofliberland.land','https://example.test/path','https://user:pass@example.test','https://example.test/?x=1','https://example.test/#x','not a URL'])assert.throws(()=>createApp({publicOrigin:value}),/PUBLIC_ORIGIN/);
 assert.throws(()=>createApp({port:NaN}),/PORT/);
});
test('Hosted backups retain a matched database and MFA key outside the release',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'atlas-backup-')),dataDir=path.join(dir,'data'),backupDir=path.join(dir,'backups');
 const app=createApp({dataDir,port:0});await app.start();
 try{
  execFileSync(process.execPath,[fileURLToPath(new URL('../server/backup.js',import.meta.url))],{env:{...process.env,DATA_DIR:dataDir,BACKUP_DIR:backupDir},stdio:'pipe'});
  const files=fs.readdirSync(backupDir),database=files.find(f=>f.endsWith('.sqlite')),key=files.find(f=>f.endsWith('.encryption.key'));
  assert.equal(files.length,2);assert.equal(database.replace('.sqlite',''),key.replace('.encryption.key',''));
  assert.deepEqual(fs.readFileSync(path.join(backupDir,key)),fs.readFileSync(path.join(dataDir,'encryption.key')));
  const restored=new DatabaseSync(path.join(backupDir,database),{readOnly:true});
  try{assert.equal(restored.prepare('SELECT count(*) AS n FROM courses').get().n,29);}finally{restored.close();}
 }finally{await app.close();fs.rmSync(dir,{recursive:true,force:true});}
});
