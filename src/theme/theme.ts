// Palette, border weight and corner radii mirror the "Monelo" design system
// (dark theme): backgroundDark, surfaceDark, inputDark, borderDark, textDark…
export const theme = {
  colors: {
    background: '#08090F', // Monelo backgroundDark
    card: '#161B2E', // Monelo surfaceDark
    cardRaised: '#1C2238', // Monelo inputDark
    tileEmpty: '#1C2238',
    textPrimary: '#EDF0FA', // Monelo textDark
    textSecondary: '#8A96B4', // Monelo secondaryDark
    separator: '#2A3250', // Monelo borderDark
    border: '#2A3250', // Monelo borderDark
    accent: '#3B7EFF', // Monelo accentBlue
    danger: '#F2514A', // Monelo accentRed
    white: '#FFFFFF',
  },
  radius: {
    card: 12, // Monelo rounded-xl
    control: 12, // Monelo rounded-xl
    tile: 3,
    check: 12,
  },
  border: {
    // Monelo uses hairline 1px borders (border-2 for emphasis/selection).
    width: 1,
    emphasis: 2,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  font: {
    title: 22,
    name: 17,
    body: 14,
    caption: 12,
  },
} as const;

export type Theme = typeof theme;

/** Returns a hex color as an rgba() string at the given alpha (0–1). */
export function withAlpha(hex: string, alpha: number): string {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Faded tint of a habit color used for unmarked tiles, icons and checkmarks. */
export const FADED_ALPHA = 0.18;

/** Even fainter tint for tiles before a habit's first completion. */
export const FADED_ALPHA_WEAK = 0.07;

/** Habit-tinted border for the icon tile and check button. */
export const BORDER_ALPHA = 0.35;
