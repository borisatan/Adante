// The 28 icons shown in the editor's default grid, HabitKit-style coverage:
// fitness, sleep, food, mind, work, music, money, leisure.
export const CURATED_ICONS = [
  'activity',
  'alarm-clock',
  'apple',
  'bed-double',
  'wallet',
  'heart-pulse',
  'baby',
  'dumbbell',
  'book-open',
  'square-terminal',
  'palette',
  'sparkles',
  'music',
  'shower-head',
  'list',
  'coffee',
  'dollar-sign',
  'heart',
  'leaf',
  'gamepad-2',
  'bike',
  'brain',
  'droplets',
  'footprints',
  'graduation-cap',
  'moon',
  'pencil',
  'utensils',
] as const;

export const DEFAULT_ICON = 'activity';

export function slugToPascal(slug: string): string {
  return slug
    .split('-')
    .map((part) => (/^\d/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('');
}
