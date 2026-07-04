import {
  bestStreakDaily,
  bestStreakWeekly,
  computeStats,
  currentStreakDaily,
  currentStreakWeekly,
} from '../streaks';

// 2026-07-04 is a Saturday; its week is Mon 2026-06-29 .. Sun 2026-07-05.
const TODAY = '2026-07-04';

describe('daily streaks', () => {
  test('empty set', () => {
    expect(currentStreakDaily(new Set(), TODAY)).toBe(0);
    expect(bestStreakDaily(new Set())).toBe(0);
  });

  test('single completion today', () => {
    const set = new Set([TODAY]);
    expect(currentStreakDaily(set, TODAY)).toBe(1);
    expect(bestStreakDaily(set)).toBe(1);
  });

  test('unticked today does not break the streak', () => {
    const set = new Set(['2026-07-01', '2026-07-02', '2026-07-03']);
    expect(currentStreakDaily(set, TODAY)).toBe(3);
  });

  test('gap yesterday breaks the streak', () => {
    const set = new Set(['2026-07-01', '2026-07-02']);
    expect(currentStreakDaily(set, TODAY)).toBe(0);
  });

  test('best streak finds longest historical run', () => {
    const set = new Set([
      '2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04', // run of 4
      '2026-06-10', '2026-06-11',                             // run of 2
      TODAY,
    ]);
    expect(bestStreakDaily(set)).toBe(4);
  });
});

describe('weekly streaks (N per week)', () => {
  test('empty set', () => {
    expect(currentStreakWeekly(new Set(), 2, TODAY)).toBe(0);
    expect(bestStreakWeekly(new Set(), 2, TODAY)).toBe(0);
  });

  test('current week already met counts as 1', () => {
    const set = new Set(['2026-06-29', '2026-07-01']); // Mon + Wed this week
    expect(currentStreakWeekly(set, 2, TODAY)).toBe(1);
  });

  test('pending week neither counts nor breaks', () => {
    // Goal 2/week: this week has 1 tick, but Sat(unticked)+Sun remain → still achievable.
    // Previous week (Jun 22–28) met the goal.
    const set = new Set(['2026-06-22', '2026-06-25', '2026-07-01']);
    expect(currentStreakWeekly(set, 2, TODAY)).toBe(1);
  });

  test('unwinnable week breaks the streak', () => {
    // Goal 6/week, today Sat with 1 done: 1 + (Sat itself + Sun = 2) < 6.
    const set = new Set(['2026-06-22', '2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26', '2026-06-27', '2026-06-29']);
    expect(currentStreakWeekly(set, 6, TODAY)).toBe(0);
  });

  test('consecutive prior weeks accumulate', () => {
    const set = new Set([
      '2026-06-15', '2026-06-17', // week of Jun 15
      '2026-06-22', '2026-06-25', // week of Jun 22
      '2026-06-29', '2026-07-01', // current week, already met
    ]);
    expect(currentStreakWeekly(set, 2, TODAY)).toBe(3);
  });

  test('sunday edge: remaining = just today', () => {
    const sunday = '2026-07-05';
    // Goal 2/week, 1 done, today Sunday unticked → 1 + 1 >= 2, still achievable (pending).
    const pending = new Set(['2026-06-22', '2026-06-24', '2026-06-30']);
    expect(currentStreakWeekly(pending, 2, sunday)).toBe(1);
    // Goal 3/week, 1 done, Sunday unticked → 1 + 1 < 3 → broken.
    expect(currentStreakWeekly(pending, 3, sunday)).toBe(0);
  });

  test('best weekly streak ignores the current partial week', () => {
    const set = new Set([
      '2026-06-08', '2026-06-10', // week met
      '2026-06-15', '2026-06-17', // week met
      // week of Jun 22 missed
      '2026-07-01',               // current week partial (1 of 2)
    ]);
    expect(bestStreakWeekly(set, 2, TODAY)).toBe(2);
  });
});

describe('computeStats', () => {
  test('habit created today with one completion', () => {
    const stats = computeStats(new Set([TODAY]), 'daily', 7, TODAY, TODAY);
    expect(stats).toEqual({ currentStreak: 1, bestStreak: 1, total: 1, completionRate: 100 });
  });

  test('empty habit has zero rate', () => {
    const stats = computeStats(new Set(), 'daily', 7, '2026-06-01', TODAY);
    expect(stats.completionRate).toBe(0);
    expect(stats.total).toBe(0);
  });

  test('daily rate over 10 days with 5 ticks is 50%', () => {
    const set = new Set(['2026-06-25', '2026-06-26', '2026-06-27', '2026-06-28', '2026-06-29']);
    const stats = computeStats(set, 'daily', 7, '2026-06-25', TODAY);
    expect(stats.completionRate).toBe(50);
  });

  test('weekly rate scales expectations by goal', () => {
    // 2/week over 14 days → expected 4; 2 done → 50%.
    const set = new Set(['2026-06-22', '2026-06-29']);
    const stats = computeStats(set, 'weekly', 2, '2026-06-21', TODAY);
    expect(stats.completionRate).toBe(50);
  });

  test('completions before created_at extend the active window', () => {
    // created Jul 1 but a completion on Jun 25 → window starts Jun 25 (10 days).
    const set = new Set(['2026-06-25']);
    const stats = computeStats(set, 'daily', 7, '2026-07-01', TODAY);
    expect(stats.completionRate).toBe(10);
  });

  test('rate caps at 100', () => {
    // 4/week goal but ticked every day for a week.
    const set = new Set(['2026-06-28', '2026-06-29', '2026-06-30', '2026-07-01', '2026-07-02', '2026-07-03', TODAY]);
    const stats = computeStats(set, 'weekly', 4, '2026-06-28', TODAY);
    expect(stats.completionRate).toBe(100);
  });
});
