// Explicit opt-in integration check against the running local app and real Stripe sandbox.
// Uses a fictional account; never loads or prints API keys.
import fs from 'node:fs';import path from 'node:path';import {randomUUID} from 'node:crypto';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/zabba/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base='http://127.0.0.1:3000',credentialsFile=path.resolve('data/stripe-qa-account.json');
let credentials=fs.existsSync(credentialsFile)?JSON.parse(fs.readFileSync(credentialsFile,'utf8')):{name:'Stripe Sandbox Review',email:'stripe-review-'+Date.now()+'@example.test',password:randomUUID()+randomUUID()};
const existing=fs.existsSync(credentialsFile);const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:1440,height:1000}});
try{
 await page.goto(base+'/portal.html');
 const login=await page.evaluate(async({credentials,existing})=>{const r=await fetch('/api/'+(existing?'login':'register'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(credentials)});return {ok:r.ok,status:r.status};},{credentials,existing});
 if(!login.ok)throw Error('Review account sign-in failed: '+login.status);if(!existing)fs.writeFileSync(credentialsFile,JSON.stringify(credentials),{mode:0o600});
 await page.goto(base+'/checkout.html?course=excel');
 await page.waitForFunction(()=>document.getElementById('checkout-status').textContent!=='Preparing your checkout…',{},{timeout:60000});
 if((await page.locator('#checkout-status').innerText()).includes('could not be opened')){await page.reload();await page.waitForFunction(()=>document.getElementById('checkout-status').textContent!=='Preparing your checkout…',{},{timeout:60000});}
 console.log('Checkout page status:',await page.locator('#checkout-status').innerText());
 await page.waitForTimeout(5000);
 const frames=page.frames().filter(f=>f!==page.mainFrame());
 const paymentFrame=frames.find(f=>f.name().includes('embedded'))||await (async()=>{for(const f of frames)if(await f.locator('#cardNumber').count())return f;})();
 if(process.argv.includes('--pay')){
  if(!paymentFrame)throw Error('Card form not found.');
  await paymentFrame.locator('#cardNumber').fill('4242424242424242');await paymentFrame.locator('#cardExpiry').fill('1234');await paymentFrame.locator('#cardCvc').fill('123');await paymentFrame.locator('#billingName').fill('Sandbox Test Student');await paymentFrame.locator('#billingCountry').selectOption('GB');
  await paymentFrame.getByRole('button',{name:'Pay',exact:true}).click();
  try{await page.waitForURL('**/payment-return.html?*',{timeout:30000});await page.getByRole('heading',{name:'Test payment confirmed.'}).waitFor({timeout:30000});const result=await page.evaluate(async()=>{const data=await(await fetch('/api/me')).json();return data.enrolments.find(e=>e.course==='excel')?.status;});console.log('Real sandbox payment confirmed; enrolment:',result);}catch{console.log('Interactive sandbox payment was not completed. Any verification challenge must be completed by the user.');}
 }
 await page.screenshot({path:path.resolve('../stripe-checkout-review.png'),fullPage:true});
}finally{await browser.close();}
