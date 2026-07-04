import { buildGridWeeks } from '@/domain/gridData';
import type { CompletionSet, DateISO } from '@/domain/types';

export const GRID_TILE = 11;
export const GRID_GAP = 3;
const RADIUS = 3;
const EMPTY_COLOR = '#1C2740';

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
): GridSvg {
  const weeks = buildGridWeeks(set, numWeeks, today);
  const step = GRID_TILE + GRID_GAP;
  const width = numWeeks * step - GRID_GAP;
  const height = 7 * step - GRID_GAP;

  const rects: string[] = [];
  weeks.forEach((week, col) => {
    week.forEach((tile, row) => {
      if (tile.state === 'future') return;
      const fill = tile.state === 'done' ? color : EMPTY_COLOR;
      rects.push(
        `<rect x="${col * step}" y="${row * step}" width="${GRID_TILE}" height="${GRID_TILE}" rx="${RADIUS}" fill="${fill}"/>`,
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
export function columnsForWidth(contentWidthDp: number): number {
  return Math.max(1, Math.floor((contentWidthDp + GRID_GAP) / (GRID_TILE + GRID_GAP)));
}
