import type { LucideIcon } from 'lucide-react-native';
import * as lucide from 'lucide-react-native';

import { isLucideIcon } from './HabitIcon';

function pascalToSlug(name: string): string {
  return name
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Za-z])(\d)/g, '$1-$2')
    .toLowerCase();
}

// Every unique icon component, keyed by slug. Alias exports (FooIcon, and
// deprecated names pointing at the same component) are deduped by reference.
function buildCatalog(): { slug: string; Icon: LucideIcon }[] {
  const seen = new Set<LucideIcon>();
  const catalog: { slug: string; Icon: LucideIcon }[] = [];
  for (const [name, value] of Object.entries(lucide)) {
    if (name === 'Icon' || name === 'createLucideIcon') continue;
    if (name.endsWith('Icon')) continue; // alias of the bare name
    if (!isLucideIcon(value)) continue;
    const Icon = value;
    if (seen.has(Icon)) continue;
    seen.add(Icon);
    catalog.push({ slug: pascalToSlug(name), Icon });
  }
  return catalog.sort((a, b) => a.slug.localeCompare(b.slug));
}

export const ALL_ICONS = buildCatalog();
