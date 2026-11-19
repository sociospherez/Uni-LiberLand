import fs from 'node:fs';
import path from 'node:path';
import {randomBytes} from 'node:crypto';

export const DEMO_STAFF_EMAIL = 'staff.admin@universityofliberland.land';
export const DEMO_STAFF_NAME = 'Staff Admin';
export function demoEnabled(value = process.env.DEMO_MODE || 'false') {
 if (!['true', 'false'].includes(value)) throw Error('DEMO_MODE must be true or false.');
 return value === 'true';
}
export function selectDataDirectory(base, enabled) {
 if (!enabled) return base;
 const dir = path.join(path.resolve(base), 'demo');
 fs.mkdirSync(dir, {recursive:true, mode:0o700});
 const marker = path.join(dir, 'demo-only.json');
 if (fs.lstatSync(dir).isSymbolicLink() || fs.realpathSync(dir) !== path.join(fs.realpathSync(path.resolve(base)), 'demo')) throw Error('Demo data must be a separate directory, not a link.');
 if (!fs.existsSync(marker) && fs.readdirSync(dir).length) throw Error('The demo directory is not marked as demo-only. Use an empty demo directory.');
 if (fs.existsSync(marker)) {
  if (JSON.parse(fs.readFileSync(marker, 'utf8')).purpose !== 'liberland-demo-only') throw Error('Invalid demo directory marker.');
 } else fs.writeFileSync(marker, JSON.stringify({purpose:'liberland-demo-only'}), {mode:0o600, flag:'wx'});
 return dir;
}
export function seedDemoStaff(db) {
 let user = db.prepare('SELECT * FROM users WHERE email=?').get(DEMO_STAFF_EMAIL);
 if (user && (user.role !== 'staff' || user.id !== 'demo-staff-admin')) throw Error('Demo staff identity conflicts with an existing record.');
 if (!user) {
  // No usable password or authenticator secret exists for this dedicated shortcut identity.
  db.prepare('INSERT INTO users(id,email,name,password,role,created_at) VALUES(?,?,?,?,?,?)').run('demo-staff-admin',DEMO_STAFF_EMAIL,DEMO_STAFF_NAME,randomBytes(16).toString('hex')+':'+randomBytes(64).toString('hex'),'staff',new Date().toISOString());
 }
 db.prepare("UPDATE users SET name=?,status='active' WHERE id='demo-staff-admin'").run(DEMO_STAFF_NAME);
 // Restarting demo mode invalidates every previous demo session, including after an off/on cycle.
 db.prepare('DELETE FROM sessions').run();
 return db.prepare("SELECT * FROM users WHERE id='demo-staff-admin'").get();
}
