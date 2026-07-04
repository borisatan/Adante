import { addDays, isoWeekday, mondayOf } from './dates';
import type { CompletionSet, DateISO } from './types';

export type TileState = 'done' | 'empty' | 'inactive' | 'future';

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

  // ISO dates sort chronologically, so the min string is the earliest completion.
  let firstDone: DateISO | undefined;
  for (const date of set) {
    if (firstDone === undefined || date < firstDone) firstDone = date;
  }

  for (let w = numWeeks - 1; w >= 0; w--) {
    const monday = addDays(currentMonday, -7 * w);
    const column: WeekColumn = [];
    for (let d = 0; d < 7; d++) {
      const date = addDays(monday, d);
      const isFuture = w === 0 && d > todayIdx;
      let state: TileState;
      if (isFuture) {
        state = 'future';
      } else if (set.has(date)) {
        state = 'done';
      } else if (firstDone === undefined || date < firstDone) {
        // Days before the habit's first completion — barely there.
        state = 'inactive';
      } else {
        state = 'empty';
      }
      column.push({ date, state });
    }
    weeks.push(column);
  }
  return weeks;
}
