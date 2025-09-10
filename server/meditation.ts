import db from './db';

export interface GenerateParams {
  duration: number; // in minutes
  language: string;
  level: number;
}

export interface MeditationClip {
  clipId: number;
  path: string;
  duration: number;
}

export interface MeditationSequence {
  sequence: MeditationClip[];
  totalDuration: number;
}

export function generateMeditation(params: GenerateParams): MeditationSequence {
  const targetSeconds = Math.max(params.duration, 1) * 60;
  const rows = db.prepare(
    `SELECT c.id, c.duration, cu.filename, cu.user_id
     FROM clips c
     JOIN clip_uploads cu ON cu.id = c.upload_id
     WHERE c.language = ? AND c.level <= ?
     ORDER BY RANDOM()`
  ).all(params.language, params.level) as any[];

  const sequence: MeditationClip[] = [];
  let total = 0;
  for (const row of rows) {
    if (total + row.duration > targetSeconds) break;
    sequence.push({
      clipId: row.id,
      path: `/uploads/${row.user_id}/${row.filename}`,
      duration: row.duration,
    });
    total += row.duration;
  }
  return { sequence, totalDuration: total };
}
