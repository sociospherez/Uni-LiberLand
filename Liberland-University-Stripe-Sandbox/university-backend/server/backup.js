import {DatabaseSync,backup} from 'node:sqlite';
import fs from 'node:fs';import path from 'node:path';
const dir=process.env.DATA_DIR||path.resolve('data');fs.mkdirSync('backups',{recursive:true});
const target=path.resolve('backups','campus-'+new Date().toISOString().replaceAll(':','-')+'.sqlite');
const db=new DatabaseSync(path.join(dir,'campus.sqlite'));await backup(db,target);db.close();
console.log('Database backup created: '+target+'\nBack up data/encryption.key separately to protected storage; it is required for staff MFA.');
