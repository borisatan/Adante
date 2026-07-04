import * as Crypto from 'expo-crypto';

import type { GoalType, Habit } from '@/domain/types';

import { getDb } from './db';

interface HabitRow {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  goal_type: GoalType;
  times_per_week: number;
  reminder_time: string | null;
  reminder_days: string;
  notification_ids: string;
  position: number;
  archived_at: string | null;
  created_at: string;
}

function rowToHabit(row: HabitRow): Habit {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    icon: row.icon,
    color: row.color,
    goalType: row.goal_type,
    timesPerWeek: row.times_per_week,
    reminderTime: row.reminder_time,
    reminderDays: JSON.parse(row.reminder_days),
    notificationIds: JSON.parse(row.notification_ids),
    position: row.position,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
  };
}

export type NewHabit = Omit<Habit, 'id' | 'notificationIds' | 'position' | 'archivedAt' | 'createdAt'>;

export function getAll(): Habit[] {
  const rows = getDb().getAllSync<HabitRow>(
    'SELECT * FROM habits ORDER BY position, created_at;',
  );
  return rows.map(rowToHabit);
}

export function getById(id: string): Habit | null {
  const row = getDb().getFirstSync<HabitRow>('SELECT * FROM habits WHERE id = ?;', [id]);
  return row ? rowToHabit(row) : null;
}

export function create(data: NewHabit): Habit {
  const db = getDb();
  const maxPos = db.getFirstSync<{ max: number | null }>(
    'SELECT MAX(position) AS max FROM habits;',
  );
  const habit: Habit = {
    ...data,
    id: Crypto.randomUUID(),
    notificationIds: [],
    position: (maxPos?.max ?? -1) + 1,
    archivedAt: null,
    createdAt: new Date().toISOString(),
  };
  insert(habit);
  return habit;
}

export function insert(habit: Habit): void {
  getDb().runSync(
    `INSERT INTO habits (id, name, description, icon, color, goal_type, times_per_week,
       reminder_time, reminder_days, notification_ids, position, archived_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      habit.id,
      habit.name,
      habit.description,
      habit.icon,
      habit.color,
      habit.goalType,
      habit.timesPerWeek,
      habit.reminderTime,
      JSON.stringify(habit.reminderDays),
      JSON.stringify(habit.notificationIds),
      habit.position,
      habit.archivedAt,
      habit.createdAt,
    ],
  );
}

export function update(habit: Habit): void {
  getDb().runSync(
    `UPDATE habits SET name = ?, description = ?, icon = ?, color = ?, goal_type = ?,
       times_per_week = ?, reminder_time = ?, reminder_days = ?, notification_ids = ?,
       position = ?, archived_at = ? WHERE id = ?;`,
    [
      habit.name,
      habit.description,
      habit.icon,
      habit.color,
      habit.goalType,
      habit.timesPerWeek,
      habit.reminderTime,
      JSON.stringify(habit.reminderDays),
      JSON.stringify(habit.notificationIds),
      habit.position,
      habit.archivedAt,
      habit.id,
    ],
  );
}

export function remove(id: string): void {
  getDb().runSync('DELETE FROM habits WHERE id = ?;', [id]);
}

export function setPositions(orderedIds: string[]): void {
  const db = getDb();
  db.withTransactionSync(() => {
    orderedIds.forEach((id, index) => {
      db.runSync('UPDATE habits SET position = ? WHERE id = ?;', [index, id]);
    });
  });
}

export function wipeAll(): void {
  const db = getDb();
  db.runSync('DELETE FROM completions;');
  db.runSync('DELETE FROM habits;');
}
