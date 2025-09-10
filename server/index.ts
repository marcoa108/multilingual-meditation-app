import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import db from './db';
import { enqueueJob, startJobWorker } from './jobProcessor';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

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

app.get('/api/uploads/:id', (req, res) => {
  const id = Number(req.params.id);
  const upload = db.prepare('SELECT * FROM clip_uploads WHERE id=?').get(id);
  if (!upload) return res.status(404).json({ error: 'Not found' });
  const job = db.prepare('SELECT * FROM processing_jobs WHERE upload_id=? ORDER BY id DESC LIMIT 1').get(id);
  res.json({ upload, job });
});

app.get('/api/categories', (req, res) => {
  const categories = db.prepare('SELECT * FROM categories').all();
  res.json(categories);
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
