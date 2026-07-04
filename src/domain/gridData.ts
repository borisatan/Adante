import { addDays, isoWeekday, mondayOf } from './dates';
import type { CompletionSet, DateISO } from './types';

export type TileState = 'done' | 'empty' | 'future';

export interface Tile {
  date: DateISO;
  state: TileState;
}

/** One column = one Mon–Sun week, oldest week first (render left → right). */
export type WeekColumn = Tile[];

export function buildGridWeeks(
  set: CompletionSet,
  numWeeks: number,
  today: DateISO,
): WeekColumn[] {
  const currentMonday = mondayOf(today);
  const todayIdx = isoWeekday(today) - 1;
  const weeks: WeekColumn[] = [];

  for (let w = numWeeks - 1; w >= 0; w--) {
    const monday = addDays(currentMonday, -7 * w);
    const column: WeekColumn = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(monday, d);
      const isFuture = w === 0 && d > todayIdx;
      column.push({
        date,
        state: isFuture ? 'future' : set.has(date) ? 'done' : 'empty',
      });
    }
    weeks.push(column);
  }
  return weeks;
}
