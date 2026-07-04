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
    card: 16, // Monelo rounded-2xl
    control: 12, // Monelo rounded-xl
    tile: 3,
    check: 14,
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
