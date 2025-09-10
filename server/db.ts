import Database from 'better-sqlite3';
import path from 'path';

const dbFile = path.join(__dirname, 'data', 'app.db');
const db = new Database(dbFile);

// Create tables if they do not exist
const createTables = `
CREATE TABLE IF NOT EXISTS clip_uploads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  originalname TEXT NOT NULL,
  duration INTEGER,
  language TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL,
  level_required INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS processing_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  upload_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  retries INTEGER NOT NULL DEFAULT 0,
  error TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(upload_id) REFERENCES clip_uploads(id)
);

CREATE TABLE IF NOT EXISTS clips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  upload_id INTEGER UNIQUE NOT NULL,
  language TEXT NOT NULL,
  level INTEGER NOT NULL,
  voice TEXT,
  duration INTEGER NOT NULL,
  type TEXT,
  FOREIGN KEY(upload_id) REFERENCES clip_uploads(id)
);

CREATE TABLE IF NOT EXISTS invitation_codes (
  code TEXT PRIMARY KEY,
  level INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  level INTEGER NOT NULL,
  app_language TEXT,
  first_name TEXT,
  last_name TEXT,
  birthdate TEXT,
  username TEXT,
  interests TEXT,
  notifications INTEGER DEFAULT 0,
  is_verified INTEGER DEFAULT 0,
  verification_token TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

db.exec(createTables);

// Insert default categories if table empty
const defaultCategories = [
  { name: 'Standard', color: '#667eea', level_required: 1 },
  { name: 'Wellness', color: '#4facfe', level_required: 1 },
  { name: 'Depth', color: '#43e97b', level_required: 3 },
  { name: 'Channel Balancing', color: '#f093fb', level_required: 3 },
  { name: 'Footsoak', color: '#f5576c', level_required: 1 },
  { name: 'Deity Names', color: '#764ba2', level_required: 5 },
  { name: 'Workout', color: '#38f9d7', level_required: 1 },
  { name: 'Introspection', color: '#00f2fe', level_required: 3 },
  { name: 'Relaxation', color: '#43e97b', level_required: 1 },
  { name: 'Focus', color: '#ff9a9e', level_required: 1 },
];

const existing = db.prepare('SELECT COUNT(*) as count FROM categories').get() as {count:number};
if (existing.count === 0) {
  const insert = db.prepare('INSERT INTO categories (name, color, level_required) VALUES (?, ?, ?)');
  const insertMany = db.transaction((cats: typeof defaultCategories) => {
    for (const c of cats) insert.run(c.name, c.color, c.level_required);
  });
  insertMany(defaultCategories);
}

const defaultInvites = [
  { code: 'BEGINNER', level: 1 },
  { code: 'BASIC', level: 3 },
  { code: 'INTERMEDIATE', level: 5 },
  { code: 'ADVANCED', level: 7 }
];

const inviteCount = db.prepare('SELECT COUNT(*) as count FROM invitation_codes').get() as {count:number};
if (inviteCount.count === 0) {
  const insertInv = db.prepare('INSERT INTO invitation_codes (code, level) VALUES (?, ?)');
  const insertInvMany = db.transaction((rows: typeof defaultInvites) => {
    for (const r of rows) insertInv.run(r.code, r.level);
  });
  insertInvMany(defaultInvites);
}

export default db;
