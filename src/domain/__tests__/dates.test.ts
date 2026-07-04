import { addDays, daysBetween, isoWeekday, mondayOf, todayISO } from '../dates';

describe('dates', () => {
  test('todayISO formats a local date', () => {
    expect(todayISO(new Date(2026, 6, 4, 0, 5))).toBe('2026-07-04');
    expect(todayISO(new Date(2026, 6, 4, 23, 55))).toBe('2026-07-04');
  });

  test('addDays crosses month and year boundaries', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
    expect(addDays('2024-02-28', 1)).toBe('2024-02-29'); // leap year
  });

  test('addDays is stable across DST transitions', () => {
    // Europe: DST starts last Sunday of March, ends last Sunday of October.
    expect(addDays('2026-03-28', 2)).toBe('2026-03-30');
    expect(addDays('2026-10-24', 2)).toBe('2026-10-26');
    expect(addDays('2026-03-30', -2)).toBe('2026-03-28');
  });

  test('isoWeekday: Monday=1, Sunday=7', () => {
    expect(isoWeekday('2026-06-29')).toBe(1); // Monday
    expect(isoWeekday('2026-07-04')).toBe(6); // Saturday
    expect(isoWeekday('2026-07-05')).toBe(7); // Sunday
  });

  test('mondayOf returns start of Mon–Sun week', () => {
    expect(mondayOf('2026-07-04')).toBe('2026-06-29');
    expect(mondayOf('2026-06-29')).toBe('2026-06-29'); // Monday maps to itself
    expect(mondayOf('2026-07-05')).toBe('2026-06-29'); // Sunday belongs to same week
  });

  test('daysBetween', () => {
    expect(daysBetween('2026-07-01', '2026-07-04')).toBe(3);
    expect(daysBetween('2026-07-04', '2026-07-01')).toBe(-3);
    expect(daysBetween('2025-12-31', '2026-01-01')).toBe(1);
  });
});
