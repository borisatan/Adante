import { Activity, type LucideIcon } from 'lucide-react-native';
import * as lucide from 'lucide-react-native';

import { slugToPascal } from './curated';

// Lucide (v1.x, react-native) builds every icon with `forwardRef`, so the
// components are objects (`$$typeof: react.forward_ref`), not plain functions.
// A `typeof === 'function'` gate therefore rejects all of them.
export function isLucideIcon(value: unknown): value is LucideIcon {
  if (typeof value === 'function') return true;
  return typeof value === 'object' && value !== null && '$$typeof' in value;
}

export function iconForSlug(slug: string): LucideIcon {
  const candidate = (lucide as unknown as Record<string, unknown>)[slugToPascal(slug)];
  return isLucideIcon(candidate) ? candidate : Activity;
}

interface Props {
  slug: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function HabitIcon({ slug, size = 22, color = '#F1F5F9', strokeWidth = 2 }: Props) {
  const Icon = iconForSlug(slug);
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}
