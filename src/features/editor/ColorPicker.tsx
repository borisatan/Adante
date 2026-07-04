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
            style={[styles.cell, { backgroundColor: color }, selected && styles.cellSelected]}
          />
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
    borderWidth: theme.border.emphasis,
    borderColor: 'transparent',
  },
  cellSelected: {
    borderColor: theme.colors.textPrimary,
  },
});
