// 21 habit colors, arranged like HabitKit's picker: warm → green → teal → blue → purple → pink → gray.
export const HABIT_COLORS = [
  '#F87171', // red
  '#FB923C', // orange
  '#FBBF24', // amber
  '#FDE047', // yellow
  '#A3E635', // lime
  '#4ADE80', // green
  '#34D399', // emerald
  '#2DD4BF', // teal
  '#22D3EE', // cyan
  '#38BDF8', // sky
  '#60A5FA', // blue
  '#818CF8', // indigo
  '#A78BFA', // violet
  '#C084FC', // purple
  '#E879F9', // fuchsia
  '#F472B6', // pink
  '#FB7185', // rose
  '#94A3B8', // slate
  '#9CA3AF', // gray
  '#78716C', // stone
  '#A8A29E', // warm gray
] as const;

export const DEFAULT_HABIT_COLOR = HABIT_COLORS[13]; // purple, like HabitKit's default vibe
