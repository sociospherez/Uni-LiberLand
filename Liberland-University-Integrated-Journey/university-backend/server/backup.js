import {DatabaseSync,backup} from 'node:sqlite';
import fs from 'node:fs';import path from 'node:path';
import {randomUUID} from 'node:crypto';
const dir=process.env.DATA_DIR||path.resolve('data'),backupDir=path.resolve(process.env.BACKUP_DIR||'backups');
const directories=[dir,path.join(dir,'demo')].filter(folder=>fs.existsSync(path.join(folder,'campus.sqlite')));
if(!directories.length)throw Error('No campus database was found for backup.');
for(const folder of directories){
const database=path.join(folder,'campus.sqlite'),key=path.join(folder,'encryption.key');
if(!fs.existsSync(database)||!fs.existsSync(key))throw Error('A database and its authenticator encryption key are required for backup.');
fs.mkdirSync(backupDir,{recursive:true,mode:0o700});
const prefix=path.join(backupDir,(folder===dir?'campus-':'campus-demo-')+new Date().toISOString().replaceAll(':','-')+'-'+randomUUID().slice(0,8));
const db=new DatabaseSync(database,{readOnly:true});
try{await backup(db,prefix+'.sqlite');fs.copyFileSync(key,prefix+'.encryption.key',fs.constants.COPYFILE_EXCL);fs.chmodSync(prefix+'.sqlite',0o600);fs.chmodSync(prefix+'.encryption.key',0o600);}catch(error){fs.rmSync(prefix+'.sqlite',{force:true});fs.rmSync(prefix+'.encryption.key',{force:true});throw error;}finally{db.close();}
console.log('Matched database/key backup created: '+prefix+'\nKeep both files together in protected storage.');

}
