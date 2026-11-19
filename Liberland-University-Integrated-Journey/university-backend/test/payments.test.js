import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import Stripe from 'stripe';
import {createApp} from '../server/app.js';
import {createPayments} from '../server/payments.js';
const signingSecret='whsec_local_test_fixture_only';
test('Sandbox checkout: ownership, fixed prices, idempotency and verified fulfilment',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'liberland-payments-')),sessions=new Map(),keys=new Map();let creates=0;
 const real=new Stripe('sk_test_fixture');
 const fake={webhooks:real.webhooks,checkout:{sessions:{create:async(params,options)=>{
  if(keys.has(options.idempotencyKey))return sessions.get(keys.get(options.idempotencyKey));creates++;await new Promise(r=>setTimeout(r,20));
  const id='cs_test_fixture'+creates,session={id,client_secret:'local_fixture_secret',livemode:false,mode:'payment',status:'open',payment_status:'unpaid',amount_total:params.line_items[0].price_data.unit_amount,currency:params.line_items[0].price_data.currency,metadata:params.metadata,client_reference_id:params.client_reference_id};sessions.set(id,session);keys.set(options.idempotencyKey,id);return session;
 },retrieve:async id=>{if(!sessions.has(id))throw Error('missing');return sessions.get(id);}}}};
 const app=createApp({dataDir:dir,port:0,stripeOptions:{secretKey:'sk_test_fixture',publishableKey:'pk_test_fixture',webhookSecret:signingSecret,stripeClient:fake}}),base=await app.start();
 function client(){let cookie='';return async(p,method='GET',b,status=200)=>{const r=await fetch(base+'/api'+p,{method,headers:{Origin:base,Cookie:cookie,...(b?{'Content-Type':'application/json'}:{})},body:b?JSON.stringify(b):undefined});if(r.headers.get('set-cookie'))cookie=r.headers.get('set-cookie').split(';')[0];const d=await r.json();assert.equal(r.status,status,JSON.stringify(d));return d;};}
 const a=client(),b=client(),guest=client();
 async function event(session,type='checkout.session.completed',id='evt_'+Math.random().toString(36).slice(2),expected=200,secret=signingSecret){const payload=JSON.stringify({id,type,livemode:false,data:{object:session}}),signature=real.webhooks.generateTestHeaderString({payload,secret});const r=await fetch(base+'/api/stripe/webhook',{method:'POST',headers:{'Content-Type':'application/json','Stripe-Signature':signature},body:payload});assert.equal(r.status,expected,await r.text());}
 try{
  await guest('/checkout','POST',{course:'excel'},401);
  const user=await a('/register','POST',{name:'Test Student',email:'payment@example.test',password:'sandbox test password'},201);await b('/register','POST',{name:'Other Student',email:'other@example.test',password:'sandbox other password'},201);
  const [first,second]=await Promise.all([a('/checkout','POST',{course:'excel',amount:1,user_id:'forged'}),a('/checkout','POST',{course:'excel'})]);assert.equal(creates,1);assert.equal(first.order.id,second.order.id);assert.equal(first.order.amount,1000);assert.equal(first.order.currency,'gbp');
  const session=sessions.get('cs_test_fixture1');assert.equal(session.metadata.student_id,user.id);await a('/checkout','POST',{course:'excel'});assert.equal(creates,1);
  await b('/checkout-status?session_id='+session.id,'GET',null,404);await b('/payments/reconcile','POST',{session_id:session.id},404);
  assert.equal((await a('/me')).enrolments.length,0);await a('/checkout-status?session_id='+session.id);assert.equal((await a('/me')).enrolments.length,0);
  await event(session,'checkout.session.completed','evt_forged',400,'whsec_wrong');
  session.status='complete';await event(session);assert.equal((await a('/me')).enrolments.length,0);assert.equal((await a('/payments'))[0].status,'pending');
  await a('/checkout','POST',{course:'excel'},409); // no second checkout while awaiting a payment
  session.payment_status='paid';session.amount_total=1;await event(session,'checkout.session.completed','evt_badamount',400);session.amount_total=1000;
  session.livemode=true;await event(session,'checkout.session.completed','evt_live',400);session.livemode=false;
  await event(session,'checkout.session.completed','evt_paid');await event(session,'checkout.session.completed','evt_paid');await event(session,'checkout.session.async_payment_succeeded','evt_otherpaid');
  assert.equal((await a('/me')).enrolments[0].status,'active');assert.equal((await a('/me')).enrolments.length,1);assert.equal(app.db.prepare("SELECT count(*) AS n FROM audit WHERE action='payment.test-enrolment'").get().n,1);
  await event(session,'checkout.session.expired');assert.equal((await a('/payments'))[0].status,'paid');await a('/checkout','POST',{course:'excel'},409);
  const pending=await a('/checkout','POST',{course:'social-media'}),s2=sessions.get('cs_test_fixture2');s2.status='expired';await event(s2,'checkout.session.expired');assert.equal((await a('/payments')).find(p=>p.id===pending.order.id).status,'expired');
  await a('/checkout','POST',{course:'social-media'});assert.equal(creates,3);
  const s3=sessions.get('cs_test_fixture3');s3.status='complete';s3.payment_status='paid';app.db.prepare("INSERT INTO enrolments VALUES(?,?,'paused',?,?)").run(user.id,'social-media',new Date().toISOString(),new Date().toISOString());await event(s3);assert.equal((await a('/me')).enrolments.find(e=>e.course==='social-media').status,'paused');assert.equal((await a('/payments')).find(p=>p.course==='social-media'&&p.status==='paid').fulfilled,false);
  await a('/checkout','POST',{course:'python'});const s4=sessions.get('cs_test_fixture4');s4.status='complete';s4.payment_status='paid';await a('/payments/reconcile','POST',{session_id:s4.id});assert.equal((await a('/me')).enrolments.find(e=>e.course==='python').status,'active');
  await a('/checkout','POST',{course:'databases'});const failed=sessions.get('cs_test_fixture5');failed.status='complete';
  await event(failed,'checkout.session.async_payment_failed','evt_failed');
  assert.equal((await a('/payments')).find(p=>p.course==='databases').status,'failed');
  await a('/payments/reconcile','POST',{session_id:failed.id});
  assert.equal((await a('/payments')).find(p=>p.course==='databases').status,'failed');
  assert.equal((await a('/me')).enrolments.some(e=>e.course==='databases'),false);
  await a('/checkout','POST',{course:'databases'});assert.equal(creates,6);
  await a('/admin/payments','GET',null,403);
  assert.throws(()=>createPayments(app.db,{secretKey:'sk_live_forbidden'}),/sandbox/);
 }finally{await app.close();fs.rmSync(dir,{recursive:true,force:true});}
});
