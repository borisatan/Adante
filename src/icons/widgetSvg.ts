import * as lucideStatic from 'lucide-static';

import { slugToPascal } from './curated';

const FALLBACK = 'Activity';

/**
 * Raw SVG string for a lucide slug, recolored for widget rendering.
 * RemoteViews can't host React components, so the widget renders these
 * strings via SvgWidget.
 */
export function widgetIconSvg(slug: string, color: string): string {
  const catalog = lucideStatic as unknown as Record<string, string>;
  const svg = catalog[slugToPascal(slug)] ?? catalog[FALLBACK];
  return svg.replace(/stroke="currentColor"/g, `stroke="${color}"`);
}
