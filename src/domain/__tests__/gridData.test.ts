import { buildGridWeeks } from '../gridData';

const TODAY = '2026-07-04'; // Saturday

describe('buildGridWeeks', () => {
  test('shape: numWeeks columns of 7 tiles, oldest first', () => {
    const weeks = buildGridWeeks(new Set(), 3, TODAY);
    expect(weeks).toHaveLength(3);
    for (const week of weeks) expect(week).toHaveLength(7);
    expect(weeks[0][0].date).toBe('2026-06-15'); // Monday two weeks back
    expect(weeks[2][0].date).toBe('2026-06-29'); // Monday of current week
  });

  test('future days only in current week after today', () => {
    const weeks = buildGridWeeks(new Set(), 2, TODAY);
    const current = weeks[1];
    expect(current[5].date).toBe(TODAY);
    expect(current[5].state).toBe('empty');
    expect(current[6].state).toBe('future'); // Sunday
    expect(weeks[0].every((t) => t.state !== 'future')).toBe(true);
  });

  test('done tiles come from the completion set', () => {
    const weeks = buildGridWeeks(new Set(['2026-07-01', TODAY]), 1, TODAY);
    const states = weeks[0].map((t) => t.state);
    expect(states).toEqual(['empty', 'empty', 'done', 'empty', 'empty', 'done', 'future']);
  });

  test('today as Sunday has no future tiles', () => {
    const weeks = buildGridWeeks(new Set(), 1, '2026-07-05');
    expect(weeks[0].every((t) => t.state !== 'future')).toBe(true);
  });
});
