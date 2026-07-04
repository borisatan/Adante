import { buildGridWeeks } from '@/domain/gridData';
import type { CompletionSet, DateISO } from '@/domain/types';
import { FADED_ALPHA, FADED_ALPHA_WEAK } from '@/theme/theme';

// Mirror the dashboard card grid (HabitCard: TILE 11, GAP 3).
export const GRID_TILE = 11;
export const GRID_GAP = 3;

export interface GridSvg {
  svg: string;
  width: number;
  height: number;
}

/**
 * The whole tile grid as a single SVG string. One SvgWidget inflates into a
 * single RemoteViews image; 140 nested FlexWidgets would blow up the Binder
 * transaction size.
 */
export function buildGridSvg(
  set: CompletionSet,
  numWeeks: number,
  today: DateISO,
  color: string,
  tile: number = GRID_TILE,
): GridSvg {
  const weeks = buildGridWeeks(set, numWeeks, today);
  const step = tile + GRID_GAP;
  const radius = Math.max(2, Math.round(tile * 0.28));
  const width = numWeeks * step - GRID_GAP;
  const height = 7 * step - GRID_GAP;

  const rects: string[] = [];
  weeks.forEach((week, col) => {
    week.forEach((t, row) => {
      if (t.state === 'future') return;
      // Same tint scheme as the app: full color when done, faded when empty,
      // and even fainter before the habit's first completion.
      const opacity = t.state === 'done' ? 1 : t.state === 'empty' ? FADED_ALPHA : FADED_ALPHA_WEAK;
      rects.push(
        `<rect x="${col * step}" y="${row * step}" width="${tile}" height="${tile}" rx="${radius}" fill="${color}" fill-opacity="${opacity}"/>`,
      );
    });
  });

  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${rects.join('')}</svg>`,
    width,
    height,
  };
}

/** How many week columns fit a given content width in dp. */
export function columnsForWidth(contentWidthDp: number, tile: number = GRID_TILE): number {
  return Math.max(1, Math.floor((contentWidthDp + GRID_GAP) / (tile + GRID_GAP)));
}
