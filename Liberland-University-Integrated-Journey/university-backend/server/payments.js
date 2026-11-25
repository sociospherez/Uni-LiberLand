import Stripe from 'stripe';
import {randomUUID} from 'node:crypto';
const CURRENCY='gbp';
const now=()=>new Date().toISOString();
function error(status,message){const e=new Error(message);e.status=status;throw e;}
export function createPayments(db,{secretKey='',publishableKey='',webhookSecret='',stripeClient}={}){
 if(secretKey&&!secretKey.startsWith('sk_test_')||publishableKey&&!publishableKey.startsWith('pk_test_'))throw Error('Only Stripe sandbox API keys are accepted.');
 if(webhookSecret&&!webhookSecret.startsWith('whsec_'))throw Error('Unexpected webhook secret format.');
 const configured=!!secretKey&&!!publishableKey,ready=configured&&!!webhookSecret;
 const stripe=stripeClient||(configured?new Stripe(secretKey,{maxNetworkRetries:2,timeout:20000}):null);
 const get=(sql,...args)=>db.prepare(sql).get(...args),all=(sql,...args)=>db.prepare(sql).all(...args),run=(sql,...args)=>db.prepare(sql).run(...args);
 db.exec(`CREATE TABLE IF NOT EXISTS payments (
 id TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id) ON DELETE SET NULL,course TEXT NOT NULL REFERENCES courses(slug),amount INTEGER NOT NULL,currency TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'creating',session_id TEXT UNIQUE,payment_intent TEXT,fulfilled INTEGER NOT NULL DEFAULT 0,request_json TEXT NOT NULL,created_at TEXT NOT NULL,updated_at TEXT NOT NULL);
 CREATE UNIQUE INDEX IF NOT EXISTS payment_open_course ON payments(user_id,course) WHERE status IN ('creating','open','pending','paid');
 CREATE TABLE IF NOT EXISTS stripe_events(id TEXT PRIMARY KEY,type TEXT NOT NULL,processed_at TEXT NOT NULL);
 `);
 const locks=new Map();
 const requireReady=()=>{if(!ready)error(503,'Sandbox checkout is not ready. Configure the sandbox keys and start webhook forwarding.');};
 const view=r=>({id:r.id,course:r.course,amount:r.amount,currency:r.currency,status:r.status,fulfilled:!!r.fulfilled,created_at:r.created_at,updated_at:r.updated_at});
 function assertSession(row,s){
  if(s.livemode!==false||s.mode!=='payment'||s.amount_total!==row.amount||s.currency!==row.currency||s.client_reference_id!==row.id||s.metadata?.order_id!==row.id||s.metadata?.course!==row.course||s.metadata?.student_id!==row.user_id&&row.user_id!==null||row.session_id&&row.session_id!==s.id)error(400,'Payment details do not match the saved order.');
 }
 function applySession(row,s,event){
  assertSession(row,s);if(event?.livemode!==false&&event)error(400,'Live events are not accepted.');
  db.exec('BEGIN IMMEDIATE');try{
   if(event&&get('SELECT id FROM stripe_events WHERE id=?',event.id)){db.exec('COMMIT');return get('SELECT * FROM payments WHERE id=?',row.id);}
   const current=get('SELECT * FROM payments WHERE id=?',row.id);let status=current.status,fulfilled=current.fulfilled;
   if(s.status==='complete'&&s.payment_status==='paid'){
    status='paid';const user=current.user_id&&get('SELECT status FROM users WHERE id=?',current.user_id),enrol=current.user_id&&get('SELECT status FROM enrolments WHERE user_id=? AND course=?',current.user_id,current.course);
    // A delayed event must not undo a staff suspension or paused enrolment.
    if(!fulfilled&&user?.status==='active'&&enrol?.status!=='paused'){
     run("INSERT INTO enrolments VALUES(?,?,'active',?,?) ON CONFLICT(user_id,course) DO UPDATE SET status='active',updated_at=excluded.updated_at",current.user_id,current.course,now(),now());fulfilled=1;
     run('INSERT INTO audit(actor,action,target,created_at) VALUES(?,?,?,?)',null,'payment.test-enrolment',current.id,now());
    }
   }else if(!['paid','failed','expired'].includes(status)){
    if(s.status==='expired')status='expired';else if(event?.type==='checkout.session.async_payment_failed')status='failed';else status=s.status==='complete'?'pending':'open';
   }
   run('UPDATE payments SET status=?,session_id=?,payment_intent=?,fulfilled=?,updated_at=? WHERE id=?',status,s.id,typeof s.payment_intent==='string'?s.payment_intent:s.payment_intent?.id||null,fulfilled,now(),row.id);
   if(event)run('INSERT INTO stripe_events VALUES(?,?,?)',event.id,event.type,now());db.exec('COMMIT');return get('SELECT * FROM payments WHERE id=?',row.id);
  }catch(e){db.exec('ROLLBACK');throw e;}
 }
 async function fetchSession(id){try{return await stripe.checkout.sessions.retrieve(id);}catch{error(502,'Stripe could not be reached. Please try again shortly.');}}
 async function create(user,course,origin){
  requireReady();if(user.role!=='student')error(403,'Checkout is available to signed-in students only.');
  const lock=user.id+':'+course.slug;if(locks.has(lock))return locks.get(lock);
  const work=(async()=>{
   const enrol=get('SELECT status FROM enrolments WHERE user_id=? AND course=?',user.id,course.slug);
   if(enrol?.status==='active')error(409,'You are already enrolled. Open your learning path.');
   if(enrol?.status==='paused')error(409,'This enrolment is paused. Contact staff before paying.');
   let row=get("SELECT * FROM payments WHERE user_id=? AND course=? AND status IN ('creating','open','pending','paid')",user.id,course.slug);
   if(row?.session_id){
    const s=await fetchSession(row.session_id);
    row=applySession(row,s);
    if(row.status==='paid')error(409,'This course has already been paid for. Check your student space or contact staff.');
    if(row.status==='pending')error(409,'This payment is still processing. Do not start another checkout.');
    if(row.status==='open'){
     if(row.amount===course.tuition_pence&&row.currency===CURRENCY)return {order:view(row),clientSecret:s.client_secret,publishableKey};
     let expired;
     try{expired=await stripe.checkout.sessions.expire(s.id);}
     catch{error(409,'An earlier checkout could not be closed. Please refresh before trying again.');}
     row=applySession(row,expired);
     if(row.status!=='expired')error(409,'An earlier checkout needs staff review.');
    }
   }
   if(row&&['expired','failed'].includes(row.status))row=null;
   if(row&&(row.amount!==course.tuition_pence||row.currency!==CURRENCY))error(409,'An earlier checkout with a different tuition fee needs staff review.');
   if(!row){
    const id=randomUUID(),request={ui_mode:'embedded_page',mode:'payment',allowed_payment_method_types:['card'],adaptive_pricing:{enabled:false},client_reference_id:id,metadata:{order_id:id,student_id:user.id,course:course.slug},customer_email:user.email,
     line_items:[{price_data:{currency:CURRENCY,unit_amount:course.tuition_pence,product_data:{name:'TEST — '+course.title,description:'Sandbox test. No real payment.'}},quantity:1}],
     return_url:origin+'/payment-return.html?session_id={CHECKOUT_SESSION_ID}',branding_settings:{background_color:'#F7F6F2',button_color:'#111315',display_name:'University of Liberland · TEST'}};
    const at=now();run('INSERT INTO payments(id,user_id,course,amount,currency,request_json,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)',id,user.id,course.slug,course.tuition_pence,CURRENCY,JSON.stringify(request),at,at);row=get('SELECT * FROM payments WHERE id=?',id);
   }
   // Keep the exact request and idempotency key across retries and restarts.
   if(Date.now()-Date.parse(row.created_at)>23*3600000&&!row.session_id)error(409,'An earlier checkout needs staff review before another payment can be started.');
   let session;try{session=await stripe.checkout.sessions.create(JSON.parse(row.request_json),{idempotencyKey:'liberland-test-'+row.id});}catch(e){if(e.type==='StripeInvalidRequestError')run("UPDATE payments SET status='failed',updated_at=? WHERE id=? AND status='creating'",now(),row.id);error(502,'Checkout could not be opened. Retry to safely resume or replace the failed payment attempt.');}
   row=applySession(row,session);return {order:view(row),clientSecret:session.client_secret,publishableKey};
  })();locks.set(lock,work);try{return await work;}finally{locks.delete(lock);}
 }
 async function webhook(raw,signature){
  requireReady();let event;try{event=stripe.webhooks.constructEvent(raw,signature,webhookSecret);}catch{error(400,'Invalid webhook signature.');}
  if(event.livemode!==false)error(400,'Live events are not accepted.');
  if(!['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.async_payment_failed','checkout.session.expired'].includes(event.type))return {received:true};
  if(get('SELECT id FROM stripe_events WHERE id=?',event.id))return {received:true};
  const object=event.data?.object,row=object&&get('SELECT * FROM payments WHERE session_id=? OR id=?',object.id,object.metadata?.order_id||'');
  // Ignore unrelated sandbox payments; they must never create enrolments here.
  if(!row)return {received:true};
  const s=await fetchSession(object.id);applySession(row,s,event);return {received:true};
 }
 function owned(user,session){if(!/^cs_test_[A-Za-z0-9]+$/.test(session||''))error(404,'Payment not found.');const r=get('SELECT * FROM payments WHERE session_id=? AND user_id=?',session,user.id);if(!r)error(404,'Payment not found.');return r;}
 return {config:()=>({configured,ready,mode:'test'}),create,webhook,
  status:(user,session)=>{const r=owned(user,session),e=get('SELECT status FROM enrolments WHERE user_id=? AND course=?',user.id,r.course);const course=get('SELECT title FROM courses WHERE slug=?',r.course);return {...view(r),title:course.title,enrolment_status:e?.status||null};},
  reconcile:async(user,session)=>{requireReady();const r=owned(user,session);applySession(r,await fetchSession(session));return view(get('SELECT * FROM payments WHERE id=?',r.id));},
  list:user=>all('SELECT * FROM payments WHERE user_id=? ORDER BY created_at DESC',user.id).map(view),
  adminList:()=>all('SELECT p.*,u.name,u.email,c.title FROM payments p LEFT JOIN users u ON u.id=p.user_id JOIN courses c ON c.slug=p.course ORDER BY p.created_at DESC LIMIT 200').map(r=>({...view(r),student:r.name||'Deleted account',email:r.email||'',title:r.title,session_id:r.session_id})),
  scrubUser:id=>{for(const r of all('SELECT id,request_json FROM payments WHERE user_id=?',id)){const request=JSON.parse(r.request_json);delete request.customer_email;run('UPDATE payments SET request_json=? WHERE id=?',JSON.stringify(request),r.id);}}
 };
}
