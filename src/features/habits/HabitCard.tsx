import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { buildGridWeeks } from '@/domain/gridData';
import type { CompletionSet, DateISO, Habit } from '@/domain/types';
import { HabitIcon } from '@/icons/HabitIcon';
import { theme } from '@/theme/theme';

import { CheckButton } from './CheckButton';
import { HabitGrid } from './HabitGrid';

const TILE = 11;
const GAP = 3;

interface Props {
  habit: Habit;
  completions: CompletionSet;
  today: DateISO;
  onPress: () => void;
  onToggleToday: () => void;
  onLongPress?: () => void;
}

export const HabitCard = memo(function HabitCard({
  habit,
  completions,
  today,
  onPress,
  onToggleToday,
  onLongPress,
}: Props) {
  const [gridWidth, setGridWidth] = useState(0);
  const numWeeks = Math.max(1, Math.floor((gridWidth + GAP) / (TILE + GAP)));
  const weeks = gridWidth > 0 ? buildGridWeeks(completions, numWeeks, today) : [];
  const doneToday = completions.has(today);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={200}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.header}>
        <View style={styles.iconTile}>
          <HabitIcon slug={habit.icon} size={20} color={theme.colors.textPrimary} />
        </View>
        <View style={styles.titles}>
          <Text style={styles.name} numberOfLines={1}>
            {habit.name}
          </Text>
          {habit.description !== '' && (
            <Text style={styles.description} numberOfLines={1}>
              {habit.description}
            </Text>
          )}
        </View>
        <CheckButton color={habit.color} done={doneToday} onPress={onToggleToday} />
      </View>
      <View
        style={styles.gridWrap}
        onLayout={(e) => setGridWidth(Math.round(e.nativeEvent.layout.width))}
      >
        {weeks.length > 0 && (
          <HabitGrid weeks={weeks} color={habit.color} tileSize={TILE} gap={GAP} />
        )}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: theme.border.width,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.control,
    backgroundColor: theme.colors.cardRaised,
    borderWidth: theme.border.width,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.name,
    fontWeight: '600',
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.caption,
  },
  gridWrap: {
    alignSelf: 'stretch',
  },
});
