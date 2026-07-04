import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CURATED_ICONS } from '@/icons/curated';
import { HabitIcon } from '@/icons/HabitIcon';
import { theme } from '@/theme/theme';

import { IconSearchSheet } from './IconSearchSheet';

interface Props {
  value: string;
  accentColor: string;
  onChange: (slug: string) => void;
}

export function IconPicker({ value, accentColor, onChange }: Props) {
  const [sheetOpen, setSheetOpen] = useState(false);
  // Keep a custom-picked icon visible in the grid where the curated set
  // doesn't contain it.
  const icons: string[] = CURATED_ICONS.includes(value as (typeof CURATED_ICONS)[number])
    ? [...CURATED_ICONS]
    : [value, ...CURATED_ICONS.slice(0, CURATED_ICONS.length - 1)];

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {icons.map((slug) => {
          const selected = slug === value;
          return (
            <Pressable
              key={slug}
              onPress={() => onChange(slug)}
              style={[styles.cell, selected && styles.cellSelected]}
            >
              <HabitIcon
                slug={slug}
                size={20}
                color={selected ? theme.colors.textPrimary : theme.colors.textSecondary}
              />
            </Pressable>
          );
        })}
      </View>
      <Pressable
        style={[styles.moreButton, { backgroundColor: accentColor }]}
        onPress={() => setSheetOpen(true)}
      >
        <Text style={styles.moreText}>More icons</Text>
      </Pressable>
      <IconSearchSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onSelect={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  cell: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.control,
    backgroundColor: theme.colors.cardRaised,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: theme.border.emphasis,
    borderColor: theme.colors.border,
  },
  cellSelected: {
    borderColor: theme.colors.accent,
  },
  moreButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.control,
  },
  moreText: {
    color: theme.colors.background,
    fontSize: theme.font.body,
    fontWeight: '600',
  },
});
