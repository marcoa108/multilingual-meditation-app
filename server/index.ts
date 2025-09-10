import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import db from './db';
import { enqueueJob, startJobWorker } from './jobProcessor';
import { v4 as uuidv4 } from 'uuid';
import authRouter, { requireAuth } from './auth';
import { generateMeditation } from './meditation';

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const upload = multer({
  dest: tempDir,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) cb(null, true);
    else cb(new Error('Invalid audio format'));
  }
});

app.post('/api/uploads', upload.single('clip'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const userId = req.body.userId || 'anonymous';
  const userDir = path.join(__dirname, 'uploads', userId);
  fs.mkdirSync(userDir, { recursive: true });
  const ext = path.extname(req.file.originalname);
  const filename = uuidv4() + ext;
  const destPath = path.join(userDir, filename);
  fs.renameSync(req.file.path, destPath);

  const stmt = db.prepare('INSERT INTO clip_uploads (user_id, filename, originalname, language) VALUES (?, ?, ?, ?)');
  const result = stmt.run(userId, filename, req.file.originalname, req.body.language || 'unknown');
  const uploadId = result.lastInsertRowid as number;
  const jobId = enqueueJob(uploadId);
  res.json({ uploadId, jobId });
});

app.get('/api/me', requireAuth, (req, res) => {
  const id = (req as any).userId as number;
  const row = db
    .prepare('SELECT id, email, level, app_language, first_name, last_name, birthdate, username, interests, notifications, notify_interests, notify_daily, daily_schedule FROM users WHERE id=?')
    .get(id) as any;
  const user = {
    ...row,
    interests: row?.interests ? JSON.parse(row.interests) : [],
    daily_schedule: row?.daily_schedule ? JSON.parse(row.daily_schedule) : null,
  };
  res.json(user);
});

app.put('/api/me', requireAuth, (req, res) => {
  const id = (req as any).userId as number;
  const {
    app_language,
    first_name,
    last_name,
    birthdate,
    username,
    interests,
    notifications,
    notify_interests,
    notify_daily,
    daily_schedule,
  } = req.body;
  const stmt = db.prepare(
    'UPDATE users SET app_language=?, first_name=?, last_name=?, birthdate=?, username=?, interests=?, notifications=?, notify_interests=?, notify_daily=?, daily_schedule=? WHERE id=?'
  );
  stmt.run(
    app_language || null,
    first_name || null,
    last_name || null,
    birthdate || null,
    username || null,
    JSON.stringify(interests || []),
    notifications ? 1 : 0,
    notify_interests ? 1 : 0,
    notify_daily ? 1 : 0,
    daily_schedule ? JSON.stringify(daily_schedule) : null,
    id
  );
  res.json({ success: true });
});

app.get('/api/uploads/:id', (req, res) => {
  const id = Number(req.params.id);
  const upload = db.prepare('SELECT * FROM clip_uploads WHERE id=?').get(id);
  if (!upload) return res.status(404).json({ error: 'Not found' });
  const job = db.prepare('SELECT * FROM processing_jobs WHERE upload_id=? ORDER BY id DESC LIMIT 1').get(id);
  res.json({ upload, job });
});

app.post('/api/meditations', requireAuth, (req, res) => {
  const { duration, language, level } = req.body;
  try {
    const result = generateMeditation({ duration, language, level });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories').all();
  res.json(categories);
});

app.get('/api/tags', (req, res) => {
  const tags = db.prepare('SELECT * FROM tags').all();
  res.json(tags);
});

app.post('/api/categories', (req, res) => {
  const { name, color, level_required } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO categories (name, color, level_required) VALUES (?, ?, ?)');
    const info = stmt.run(name, color, level_required);
    res.json({ id: info.lastInsertRowid });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

startJobWorker();
