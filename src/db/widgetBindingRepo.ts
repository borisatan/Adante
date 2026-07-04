import { getDb } from './db';

export function getHabitId(widgetId: number): string | null {
  const row = getDb().getFirstSync<{ habit_id: string }>(
    'SELECT habit_id FROM widget_bindings WHERE widget_id = ?;',
    [widgetId],
  );
  return row?.habit_id ?? null;
}

export function bind(widgetId: number, habitId: string): void {
  getDb().runSync(
    'INSERT OR REPLACE INTO widget_bindings (widget_id, habit_id) VALUES (?, ?);',
    [widgetId, habitId],
  );
}

export function remove(widgetId: number): void {
  getDb().runSync('DELETE FROM widget_bindings WHERE widget_id = ?;', [widgetId]);
}

export function getWidgetIdsForHabit(habitId: string): number[] {
  const rows = getDb().getAllSync<{ widget_id: number }>(
    'SELECT widget_id FROM widget_bindings WHERE habit_id = ?;',
    [habitId],
  );
  return rows.map((r) => r.widget_id);
}
