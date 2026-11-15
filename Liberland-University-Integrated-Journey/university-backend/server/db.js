import { DatabaseSync } from 'node:sqlite';
export function openDatabase(file){
 const db=new DatabaseSync(file);db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,name TEXT NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('student','staff')),status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','suspended')),totp TEXT,totp_step INTEGER NOT NULL DEFAULT -1,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS sessions(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS courses(slug TEXT PRIMARY KEY,title TEXT NOT NULL,hours INTEGER NOT NULL,available INTEGER NOT NULL DEFAULT 1);
 CREATE TABLE IF NOT EXISTS enrolments(user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,course TEXT NOT NULL REFERENCES courses(slug),status TEXT NOT NULL CHECK(status IN ('pending','active','paused')),created_at TEXT NOT NULL,updated_at TEXT NOT NULL,PRIMARY KEY(user_id,course));
 CREATE TABLE IF NOT EXISTS learning(user_id TEXT NOT NULL,course TEXT NOT NULL,revision INTEGER NOT NULL DEFAULT 0,data TEXT NOT NULL DEFAULT '{}',updated_at TEXT NOT NULL,PRIMARY KEY(user_id,course),FOREIGN KEY(user_id,course) REFERENCES enrolments(user_id,course) ON DELETE CASCADE);
 CREATE TABLE IF NOT EXISTS enquiries(id TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id) ON DELETE SET NULL,name TEXT NOT NULL,email TEXT NOT NULL,subject TEXT NOT NULL,course TEXT REFERENCES courses(slug),status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open','resolved')),assigned_to TEXT REFERENCES users(id) ON DELETE SET NULL,created_at TEXT NOT NULL,updated_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS messages(id TEXT PRIMARY KEY,enquiry TEXT NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,author TEXT REFERENCES users(id) ON DELETE SET NULL,author_name TEXT NOT NULL,kind TEXT NOT NULL CHECK(kind IN ('message','note')),body TEXT NOT NULL,created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS outbox(id TEXT PRIMARY KEY,recipient TEXT NOT NULL,subject TEXT NOT NULL,body TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'preview-only',created_at TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY AUTOINCREMENT,actor TEXT,action TEXT NOT NULL,target TEXT NOT NULL,created_at TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS session_expiry ON sessions(expires);
 CREATE INDEX IF NOT EXISTS enquiries_owner ON enquiries(user_id);
 CREATE INDEX IF NOT EXISTS messages_thread ON messages(enquiry);
 `);return db;
}
