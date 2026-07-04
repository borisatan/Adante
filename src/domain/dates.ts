import type { DateISO } from './types';

// All date math works on local calendar dates as 'YYYY-MM-DD' strings.
// Date objects are only ever constructed at local noon so that DST shifts
// (±1h) can never move a date across midnight.

function toDate(iso: DateISO): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

function toISO(date: Date): DateISO {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayISO(now: Date = new Date()): DateISO {
  return toISO(now);
}

export function addDays(iso: DateISO, days: number): DateISO {
  const date = toDate(iso);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

/** ISO weekday: 1 = Monday .. 7 = Sunday */
export function isoWeekday(iso: DateISO): number {
  const jsDay = toDate(iso).getDay(); // 0 = Sunday
  return jsDay === 0 ? 7 : jsDay;
}

/** Monday of the week containing `iso` */
export function mondayOf(iso: DateISO): DateISO {
  return addDays(iso, 1 - isoWeekday(iso));
}

/** Whole days from a to b (positive when b is later) */
export function daysBetween(a: DateISO, b: DateISO): number {
  const ms = toDate(b).getTime() - toDate(a).getTime();
  return Math.round(ms / 86_400_000);
}

export function compareISO(a: DateISO, b: DateISO): number {
  return a < b ? -1 : a > b ? 1 : 0;
}
