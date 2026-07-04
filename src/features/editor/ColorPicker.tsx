import { Pressable, StyleSheet, View } from 'react-native';

import { HABIT_COLORS } from '@/theme/palette';
import { theme } from '@/theme/theme';

interface Props {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: Props) {
  return (
    <View style={styles.grid}>
      {HABIT_COLORS.map((color) => {
        const selected = color === value;
        return (
          <Pressable
            key={color}
            onPress={() => onChange(color)}
            style={[styles.cell, selected && styles.cellSelected]}
          >
            <View style={[styles.swatch, { backgroundColor: color }]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  cell: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.control,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cellSelected: {
    borderColor: theme.colors.textPrimary,
  },
  swatch: {
    width: 26,
    height: 26,
    borderRadius: 8,
  },
});
