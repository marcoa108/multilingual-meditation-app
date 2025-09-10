import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import db from './db';

export interface Job {
  id: number;
  upload_id: number;
  status: string;
  retries: number;
}

export function enqueueJob(uploadId: number) {
  const stmt = db.prepare("INSERT INTO processing_jobs (upload_id, status) VALUES (?, 'pending')");
  const info = stmt.run(uploadId);
  return info.lastInsertRowid as number;
}

export function startJobWorker() {
  setInterval(processNextJob, 1000);
}

async function processNextJob() {
  const job = db.prepare("SELECT * FROM processing_jobs WHERE status='pending' ORDER BY id LIMIT 1").get() as Job | undefined;
  if (!job) return;
  db.prepare("UPDATE processing_jobs SET status='processing', updated_at=CURRENT_TIMESTAMP WHERE id=?").run(job.id);
  try {
    await handleJob(job);
    db.prepare("UPDATE processing_jobs SET status='completed', updated_at=CURRENT_TIMESTAMP WHERE id=?").run(job.id);
  } catch (err: any) {
    const retries = job.retries + 1;
    const status = retries >= 3 ? 'failed' : 'pending';
    db.prepare("UPDATE processing_jobs SET status=?, retries=?, error=?, updated_at=CURRENT_TIMESTAMP WHERE id=?")
      .run(status, retries, err.message, job.id);
  }
}

async function handleJob(job: Job) {
  const upload = db.prepare('SELECT * FROM clip_uploads WHERE id=?').get(job.upload_id) as any;
  if (!upload) throw new Error('Upload not found');
  const filePath = path.join(__dirname, 'uploads', upload.user_id, upload.filename);

  const metadata: any = await new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, data) => {
      if (err) reject(err); else resolve(data);
    });
  });
  const duration = Math.round(metadata.format.duration || 0);
  db.prepare('UPDATE clip_uploads SET duration=? WHERE id=?').run(duration, job.upload_id);

  db.prepare(`
    INSERT INTO clips (upload_id, language, level, voice, duration, type)
    VALUES (?, ?, 1, 'default', ?, 'generic')
    ON CONFLICT(upload_id) DO UPDATE SET duration=excluded.duration, language=excluded.language
  `).run(job.upload_id, upload.language || 'unknown', duration);

  // placeholder for transcription and categorization
  const vttPath = filePath.replace(/\.[^/.]+$/, '.vtt');
  if (!fs.existsSync(path.dirname(vttPath))) fs.mkdirSync(path.dirname(vttPath), { recursive: true });
  fs.writeFileSync(vttPath, 'WEBVTT\n\n');
}
