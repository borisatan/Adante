import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pencil } from 'lucide-react-native';
import { useEffect, useMemo, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { buildGridWeeks } from '@/domain/gridData';
import { computeStats } from '@/domain/streaks';
import { HabitIcon } from '@/icons/HabitIcon';
import { StatsRow } from '@/features/habits/StatsRow';
import { HabitGrid } from '@/features/habits/HabitGrid';
import { useHabitStore } from '@/store/useHabitStore';
import { theme } from '@/theme/theme';

const TILE = 18;
const GAP = 2;
const NUM_WEEKS = 53;

export default function HabitDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const habit = useHabitStore((s) => s.habits.find((h) => h.id === id));
  const completions = useHabitStore((s) => (id ? s.completions[id] : undefined));
  const today = useHabitStore((s) => s.today);
  const toggleCompletion = useHabitStore((s) => s.toggleCompletion);
  const scrollRef = useRef<ScrollView>(null);

  const set = completions ?? EMPTY_SET;

  const weeks = useMemo(() => buildGridWeeks(set, NUM_WEEKS, today), [set, today]);
  const stats = useMemo(
    () =>
      habit
        ? computeStats(set, habit.goalType, habit.timesPerWeek, habit.createdAt.slice(0, 10), today)
        : null,
    [set, habit, today],
  );

  useEffect(() => {
    // Show the most recent weeks first.
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 0);
    return () => clearTimeout(t);
  }, []);

  if (!habit || !stats) return null;

  return (
    <>
      <Stack.Screen
        options={{
          title: habit.name,
          headerRight: () => (
            <Pressable
              hitSlop={8}
              onPress={() => router.push({ pathname: '/habit-editor', params: { id: habit.id } })}
            >
              <Pencil size={20} color={theme.colors.textPrimary} />
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={[styles.iconTile, { backgroundColor: habit.color }]}>
            <HabitIcon slug={habit.icon} size={24} color={theme.colors.background} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{habit.name}</Text>
            {habit.description !== '' && (
              <Text style={styles.description}>{habit.description}</Text>
            )}
          </View>
        </View>

        <StatsRow stats={stats} goalType={habit.goalType} />

        <Text style={styles.hint}>Tap a tile to toggle that day</Text>
        <View style={styles.gridCard}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          >
            <HabitGrid
              weeks={weeks}
              color={habit.color}
              tileSize={TILE}
              gap={GAP}
              onTilePress={(date) => {
                if (date <= today) toggleCompletion(habit.id, date);
              }}
            />
          </ScrollView>
        </View>
      </ScrollView>
    </>
  );
}

const EMPTY_SET = new Set<string>();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconTile: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.title,
    fontWeight: '700',
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.body,
  },
  hint: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.caption,
  },
  gridCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.card,
    borderWidth: theme.border.width,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
  },
});
