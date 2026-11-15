import {spawn} from 'node:child_process';import fs from 'node:fs';import path from 'node:path';import {loadEnvFile} from 'node:process';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),envFile=path.join(root,'.env');loadEnvFile(envFile);
const key=process.env.STRIPE_SECRET_KEY;if(!key?.startsWith('sk_test_'))throw Error('Configure a sandbox secret key in .env first.');
const shim=process.env.STRIPE_CLI_SHIM||path.join(process.env.APPDATA||'', 'npm/node_modules/@stripe/cli/bin/shim.js');
const command=process.platform==='win32'?process.execPath:'stripe',prefix=process.platform==='win32'?[shim]:[];
if(process.platform==='win32'&&!fs.existsSync(shim))throw Error('Install the Stripe CLI with npm install -g @stripe/cli, then retry.');
const childEnv={...process.env,STRIPE_API_KEY:key};
function child(args){return spawn(command,[...prefix,...args],{env:childEnv,windowsHide:true,stdio:['ignore','pipe','pipe']});}
const readSecret=child(['listen','--print-secret','--skip-update']);let output='';readSecret.stdout.on('data',b=>output+=b);readSecret.stderr.on('data',b=>output+=b);
const code=await new Promise(resolve=>{readSecret.on('close',resolve);readSecret.on('error',()=>resolve(1));});
const secret=output.match(/whsec_[A-Za-z0-9]+/)?.[0];if(code!==0||!secret){console.error('Unable to obtain the sandbox webhook secret. Check the sandbox key and your network connection.');process.exit(1);}
let env=fs.readFileSync(envFile,'utf8');env=/^STRIPE_WEBHOOK_SECRET=.*$/m.test(env)?env.replace(/^STRIPE_WEBHOOK_SECRET=.*$/m,'STRIPE_WEBHOOK_SECRET='+secret):env+'\nSTRIPE_WEBHOOK_SECRET='+secret+'\n';fs.writeFileSync(envFile,env,{mode:0o600});
console.log('Sandbox webhook secret saved locally. Start or restart the backend after this message.');
if(process.argv.includes('--configure-only'))process.exit(0);
const port=Number(process.env.PORT||3000);if(!Number.isInteger(port)||port<1||port>65535)throw Error('Invalid PORT.');
const listener=child(['listen','--skip-update','--events','checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed,checkout.session.expired','--forward-to',`http://127.0.0.1:${port}/api/stripe/webhook`]);
function safeLine(s){return s.replaceAll(secret,'[saved locally]').replaceAll(key,'[redacted]').replace(/whsec_[A-Za-z0-9]+/g,'[saved locally]').replace(/(?:sk|pk|rk)_(?:test|live)_[A-Za-z0-9_]+/g,'[redacted]');}
function logger(){let buffer='';return b=>{buffer+=b.toString();const lines=buffer.split('\n');buffer=lines.pop();for(const line of lines)process.stdout.write(safeLine(line)+'\n');};}
listener.stdout.on('data',logger());listener.stderr.on('data',logger());listener.on('error',()=>{console.error('The Stripe listener could not start.');process.exitCode=1;});listener.on('close',c=>process.exitCode=c||0);process.on('SIGINT',()=>listener.kill());process.on('SIGTERM',()=>listener.kill());
