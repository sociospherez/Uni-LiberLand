import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {createRequire} from 'node:module';import assert from 'node:assert/strict';import {createApp} from '../server/app.js';import Stripe from 'stripe';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/zabba/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'journey-')),sessions=new Map(),real=new Stripe('sk_test_fixture');let count=0;
const fake={webhooks:real.webhooks,checkout:{sessions:{create:async p=>{const s={id:'cs_test_journey'+(++count),client_secret:'fixture',livemode:false,mode:'payment',status:'open',payment_status:'unpaid',amount_total:p.line_items[0].price_data.unit_amount,currency:p.line_items[0].price_data.currency,metadata:p.metadata,client_reference_id:p.client_reference_id};sessions.set(s.id,s);return s;},retrieve:async id=>sessions.get(id)}}};
const app=createApp({dataDir:dir,port:0,stripeOptions:{secretKey:'sk_test_fixture',publishableKey:'pk_test_fixture',webhookSecret:'whsec_fixture',stripeClient:fake}}),base=await app.start(),browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
await page.route('https://js.stripe.com/**',r=>r.fulfill({contentType:'application/javascript',body:'window.Stripe=()=>({createEmbeddedCheckoutPage:async()=>({mount:s=>document.querySelector(s).textContent="Checkout test fixture"})});'}));
await page.goto(base+'/index.html');
for(const route of ['dashboard','certificate-enrol','certificate-enrolled','welcome']){
 await page.evaluate(route=>localStorage.setItem('ldc-state',JSON.stringify({route,selectedCourse:'cert-databases'})),route);
 await page.goto(base+'/index.html');await page.waitForFunction(()=>!document.documentElement.classList.contains('account-loading'));
 assert.equal(new URL(page.url()).pathname,'/index.html');assert.equal(await page.evaluate(()=>state.route),'home');
}
await page.evaluate(()=>go('programme',{course:'cert-databases'}));await page.getByRole('link',{name:'Enrol now'}).waitFor();assert.equal(new URL(page.url()).pathname,'/index.html');
await page.getByRole('button',{name:'Preview learning experience',exact:false}).click();assert.equal(new URL(page.url()).pathname,'/index.html');
await page.goto(base+'/checkout.html?course=social-media');await page.waitForURL('**/portal.html?course=social-media&intent=enrol&tab=login');
await page.getByRole('button',{name:'Create a student account'}).click();await page.locator('[name=name]').fill('Journey Student');await page.locator('[name=email]').fill('journey@example.test');await page.locator('[name=password]').fill('journey test password');await page.getByRole('button',{name:'Create account & continue',exact:true}).click();
await page.getByText('Checkout test fixture',{exact:true}).waitFor();assert.equal(count,1);assert.equal([...sessions.values()][0].metadata.course,'social-media');
const s=[...sessions.values()][0];await page.goto(base+'/payment-return.html?session_id='+s.id);await page.getByRole('heading',{name:'Checkout is still open.'}).waitFor();assert.equal(await page.locator('#start-learning').count(),0);
s.status='complete';s.payment_status='paid';await page.getByRole('button',{name:'Check with Stripe again'}).click();await page.getByRole('link',{name:'Start learning',exact:true}).click();await page.getByRole('heading',{name:'Social Media Analytics',exact:true}).waitFor();
await page.goto(base+'/checkout.html?course=social-media');await page.waitForURL('**/index.html?learn=social-media');await page.getByRole('heading',{name:'Social Media Analytics',exact:true}).waitFor();assert.equal(count,1);
await page.goto(base+'/portal.html?course=social-media');await page.getByRole('link',{name:'Continue learning',exact:true}).waitFor();await page.setViewportSize({width:390,height:844});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
await page.goto(base+'/index.html');
await page.waitForFunction(()=>!document.documentElement.classList.contains('account-loading'));
await page.evaluate(()=>openCertificateCatalogue());
assert.equal(await page.locator('.cert-catalogue-card').count(),29);
await page.goto(base+'/index.html?programme=ai-in-executive-strategy');
await page.getByRole('heading',{name:'AI in Executive Strategy'}).waitFor();
await page.getByText('£1,300.00',{exact:false}).waitFor();
await page.goto(base+'/portal.html?course=ai-in-executive-strategy');
await page.getByText('3 months · Tuition fee £1,300.00',{exact:true}).waitFor();
await page.getByRole('link',{name:'Continue to test payment'}).click();
await page.getByText('Sandbox checkout ready · £1,300.00',{exact:true}).waitFor();
await page.goto(base+'/portal.html?course=unknown');await page.getByText('That course could not be found.',{exact:false}).waitFor();assert.deepEqual(errors,[]);console.log('PASS: guest checkout redirects with course; registration retains selection; checkout starts once; unpaid return stays locked; verified payment opens learning; active purchase redirects; invalid course fallback; mobile layout. Stripe simulated.');
}finally{await browser.close();await app.close();fs.rmSync(dir,{recursive:true,force:true});}
