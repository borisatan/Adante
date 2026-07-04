export type GoalType = 'daily' | 'weekly';

export interface Habit {
  id: string;
  name: string;
  description: string;
  /** lucide icon slug, kebab-case, e.g. "book-open" */
  icon: string;
  /** hex color from the palette */
  color: string;
  goalType: GoalType;
  /** 1..6 when weekly, 7 when daily */
  timesPerWeek: number;
  /** 'HH:MM' local time, null = no reminder */
  reminderTime: string | null;
  /** ISO weekdays 1 (Mon) .. 7 (Sun) */
  reminderDays: number[];
  /** scheduled expo notification ids */
  notificationIds: string[];
  position: number;
  /** ISO datetime, null = active */
  archivedAt: string | null;
  createdAt: string;
}

/** 'YYYY-MM-DD' local calendar date */
export type DateISO = string;

export type CompletionSet = Set<DateISO>;

export interface WidgetBinding {
  widgetId: number;
  habitId: string;
}

export interface ExportFile {
  app: 'andante';
  version: 1;
  exportedAt: string;
  habits: Omit<Habit, 'notificationIds'>[];
  completions: { habitId: string; date: DateISO }[];
}

export interface HabitStats {
  /** in days for daily habits, in weeks for weekly habits */
  currentStreak: number;
  bestStreak: number;
  total: number;
  /** 0..100 */
  completionRate: number;
}
