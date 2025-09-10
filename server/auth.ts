import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import db from './db';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

router.post('/signup', (req, res) => {
  const { email, password, invitationCode, app_language, first_name, last_name, birthdate, username, interests, notifications, notify_interests, notify_daily, daily_schedule } = req.body;
  if (!email || !password || !invitationCode) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const code = db.prepare('SELECT * FROM invitation_codes WHERE code=?').get(invitationCode) as any;
  if (!code) return res.status(400).json({ error: 'Invalid invitation code' });
  const existing = db.prepare('SELECT id FROM users WHERE email=?').get(email) as any;
  if (existing) return res.status(400).json({ error: 'Email already registered' });
  const hash = bcrypt.hashSync(password, 10);
  const token = uuidv4();
  const stmt = db.prepare('INSERT INTO users (email, password_hash, level, app_language, first_name, last_name, birthdate, username, interests, notifications, notify_interests, notify_daily, daily_schedule, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const info = stmt.run(
    email,
    hash,
    code.level,
    app_language || 'en',
    first_name || '',
    last_name || '',
    birthdate || '',
    username || '',
    JSON.stringify(interests || []),
    notifications ? 1 : 0,
    notify_interests ? 1 : 0,
    notify_daily ? 1 : 0,
    daily_schedule ? JSON.stringify(daily_schedule) : null,
    token
  );
  res.json({ id: info.lastInsertRowid, verificationToken: token });
});

router.get('/confirm/:token', (req, res) => {
  const { token } = req.params;
  const result = db.prepare('UPDATE users SET is_verified=1 WHERE verification_token=?').run(token);
  if (result.changes === 0) return res.status(400).json({ error: 'Invalid token' });
  res.json({ success: true });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const user = db.prepare('SELECT * FROM users WHERE email=?').get(email) as any;
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  if (!bcrypt.compareSync(password, user.password_hash)) return res.status(400).json({ error: 'Invalid credentials' });
  if (!user.is_verified) return res.status(403).json({ error: 'Email not verified' });
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

export function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    (req as any).userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export default router;
