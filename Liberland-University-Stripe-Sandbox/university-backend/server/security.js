import { randomBytes, scrypt as rawScrypt, timingSafeEqual, createHash, createHmac, createCipheriv, createDecipheriv } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt=promisify(rawScrypt);
export const token=()=>randomBytes(32).toString('hex');
export const hash=s=>createHash('sha256').update(s).digest('hex');
export async function passwordHash(password){const salt=randomBytes(16).toString('hex');return salt+':'+(await scrypt(password,salt,64)).toString('hex');}
export async function passwordCheck(password,stored){const [salt,h]=stored.split(':');const a=await scrypt(password,salt,64),b=Buffer.from(h,'hex');return a.length===b.length&&timingSafeEqual(a,b);}
const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
export function newTotpSecret(){const bytes=randomBytes(20);let bits='';for(const b of bytes)bits+=b.toString(2).padStart(8,'0');return bits.match(/.{5}/g).map(b=>alphabet[parseInt(b,2)]).join('');}
export function totp(secret,step=Math.floor(Date.now()/30000)){let bits='';for(const c of secret)bits+=alphabet.indexOf(c).toString(2).padStart(5,'0');const key=Buffer.from(bits.match(/.{8}/g).map(b=>parseInt(b,2)));const counter=Buffer.alloc(8);counter.writeBigUInt64BE(BigInt(step));const digest=createHmac('sha1',key).update(counter).digest();const offset=digest[19]&15;return String((digest.readUInt32BE(offset)&0x7fffffff)%1000000).padStart(6,'0');}
export function totpStep(secret,code,last=-1){if(!/^\d{6}$/.test(code||''))return null;const now=Math.floor(Date.now()/30000);for(const step of [now-1,now,now+1])if(step>last&&timingSafeEqual(Buffer.from(totp(secret,step)),Buffer.from(code)))return step;return null;}
export function seal(text,key){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',key,iv);const body=Buffer.concat([cipher.update(text,'utf8'),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),body]).toString('base64');}
export function unseal(text,key){const b=Buffer.from(text,'base64'),cipher=createDecipheriv('aes-256-gcm',key,b.subarray(0,12));cipher.setAuthTag(b.subarray(12,28));return Buffer.concat([cipher.update(b.subarray(28)),cipher.final()]).toString('utf8');}
