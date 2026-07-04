import { addDays, compareISO, daysBetween, isoWeekday, mondayOf } from './dates';
import type { CompletionSet, DateISO, GoalType, HabitStats } from './types';

// Streaks for daily habits are measured in days; for weekly habits ("N times
// per week", Mon–Sun) in weeks. In both cases the current (incomplete)
// day/week must not break an ongoing streak while it is still achievable.

export function currentStreakDaily(set: CompletionSet, today: DateISO): number {
  let d = set.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (set.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

export function bestStreakDaily(set: CompletionSet): number {
  const dates = [...set].sort(compareISO);
  let best = 0;
  let run = 0;
  for (let i = 0; i < dates.length; i++) {
    run = i > 0 && dates[i] === addDays(dates[i - 1], 1) ? run + 1 : 1;
    if (run > best) best = run;
  }
  return best;
}

function weekCounts(set: CompletionSet): Map<DateISO, number> {
  const counts = new Map<DateISO, number>();
  for (const date of set) {
    const week = mondayOf(date);
    counts.set(week, (counts.get(week) ?? 0) + 1);
  }
  return counts;
}

export function currentStreakWeekly(
  set: CompletionSet,
  timesPerWeek: number,
  today: DateISO,
): number {
  const counts = weekCounts(set);
  const currentWeek = mondayOf(today);
  const done = counts.get(currentWeek) ?? 0;
  // Days still usable this week: the rest of the week plus today if unticked.
  const remaining = 7 - isoWeekday(today) + (set.has(today) ? 0 : 1);

  let streak = 0;
  if (done >= timesPerWeek) {
    streak = 1; // current week already met the goal
  } else if (done + remaining < timesPerWeek) {
    return 0; // goal can no longer be met this week
  }
  // Otherwise the current week is pending: it neither counts nor breaks.

  let week = addDays(currentWeek, -7);
  while ((counts.get(week) ?? 0) >= timesPerWeek) {
    streak++;
    week = addDays(week, -7);
  }
  return streak;
}

export function bestStreakWeekly(
  set: CompletionSet,
  timesPerWeek: number,
  today: DateISO,
): number {
  if (set.size === 0) return 0;
  const counts = weekCounts(set);
  const firstWeek = [...counts.keys()].sort(compareISO)[0];
  const currentWeek = mondayOf(today);

  let best = 0;
  let run = 0;
  for (let week = firstWeek; compareISO(week, currentWeek) <= 0; week = addDays(week, 7)) {
    if ((counts.get(week) ?? 0) >= timesPerWeek) {
      run++;
      if (run > best) best = run;
    } else if (week !== currentWeek) {
      run = 0; // a finished week that missed the goal breaks the run
    }
    // The current partial week never resets the run; it just stops counting.
  }
  return best;
}

export function computeStats(
  set: CompletionSet,
  goalType: GoalType,
  timesPerWeek: number,
  createdAt: DateISO,
  today: DateISO,
): HabitStats {
  const total = set.size;

  let currentStreak: number;
  let bestStreak: number;
  if (goalType === 'daily') {
    currentStreak = currentStreakDaily(set, today);
    bestStreak = bestStreakDaily(set);
  } else {
    currentStreak = currentStreakWeekly(set, timesPerWeek, today);
    bestStreak = bestStreakWeekly(set, timesPerWeek, today);
  }

  let completionRate = 0;
  if (total > 0) {
    const earliest = [...set].sort(compareISO)[0];
    const start = compareISO(earliest, createdAt) < 0 ? earliest : createdAt;
    const daysActive = daysBetween(start, today) + 1;
    const perWeek = goalType === 'daily' ? 7 : timesPerWeek;
    const expected = Math.max(1, (daysActive * perWeek) / 7);
    completionRate = Math.min(100, Math.round((total / expected) * 100));
  }

  return { currentStreak, bestStreak, total, completionRate };
}
