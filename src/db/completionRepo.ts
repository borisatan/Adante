import type { CompletionSet, DateISO } from '@/domain/types';

import { getDb } from './db';

/** Toggle a completion; returns true when the day is now completed. */
export function toggle(habitId: string, date: DateISO): boolean {
  const db = getDb();
  const deleted = db.runSync(
    'DELETE FROM completions WHERE habit_id = ? AND date = ?;',
    [habitId, date],
  );
  if (deleted.changes > 0) return false;
  db.runSync(
    'INSERT INTO completions (habit_id, date, created_at) VALUES (?, ?, ?);',
    [habitId, date, new Date().toISOString()],
  );
  return true;
}

export function insert(habitId: string, date: DateISO): void {
  getDb().runSync(
    'INSERT OR IGNORE INTO completions (habit_id, date, created_at) VALUES (?, ?, ?);',
    [habitId, date, new Date().toISOString()],
  );
}

export function getForHabit(habitId: string): CompletionSet {
  const rows = getDb().getAllSync<{ date: DateISO }>(
    'SELECT date FROM completions WHERE habit_id = ?;',
    [habitId],
  );
  return new Set(rows.map((r) => r.date));
}

export function getAll(): Record<string, CompletionSet> {
  const rows = getDb().getAllSync<{ habit_id: string; date: DateISO }>(
    'SELECT habit_id, date FROM completions;',
  );
  const map: Record<string, CompletionSet> = {};
  for (const row of rows) {
    (map[row.habit_id] ??= new Set()).add(row.date);
  }
  return map;
}
