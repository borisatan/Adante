import { useRouter } from 'expo-router';
import { Plus, Settings } from 'lucide-react-native';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
  type RenderItemParams,
} from 'react-native-draggable-flatlist';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import type { Habit } from '@/domain/types';
import { HabitCard } from '@/features/habits/HabitCard';
import { selectActiveHabits, useHabitStore } from '@/store/useHabitStore';
import { theme } from '@/theme/theme';

export default function HomeScreen() {
  const router = useRouter();
  const hydrated = useHabitStore((s) => s.hydrated);
  const habits = useHabitStore(useShallow(selectActiveHabits));
  const completions = useHabitStore((s) => s.completions);
  const today = useHabitStore((s) => s.today);
  const toggleCompletion = useHabitStore((s) => s.toggleCompletion);
  const reorderHabits = useHabitStore((s) => s.reorderHabits);

  const renderItem = useCallback(
    ({ item, drag }: RenderItemParams<Habit>) => (
      <ScaleDecorator activeScale={1.03}>
        <View style={styles.cardWrap}>
          <HabitCard
            habit={item}
            completions={completions[item.id] ?? EMPTY_SET}
            today={today}
            onPress={() => router.push(`/habit/${item.id}`)}
            onToggleToday={() => toggleCompletion(item.id)}
            onLongPress={drag}
          />
        </View>
      </ScaleDecorator>
    ),
    [completions, today, router, toggleCompletion],
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={() => router.push('/settings')}>
          <Settings size={22} color={theme.colors.textSecondary} />
        </Pressable>
        <Text style={styles.title}>
          Andante
        </Text>
        <Pressable hitSlop={8} style={styles.addButton} onPress={() => router.push('/habit-editor')}>
          <Plus size={22} color={theme.colors.background} strokeWidth={2.5} />
        </Pressable>
      </View>
      {!hydrated ? null : habits.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No habits yet</Text>
          <Text style={styles.emptyBody}>Tap + to create your first habit.</Text>
        </View>
      ) : (
        <DraggableFlatList
          data={habits}
          keyExtractor={(h) => h.id}
          renderItem={renderItem}
          onDragEnd={({ data }) => reorderHabits(data.map((h) => h.id))}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const EMPTY_SET = new Set<string>();

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.title,
    fontWeight: '700',
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  cardWrap: {
    marginBottom: theme.spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  emptyTitle: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.name,
    fontWeight: '600',
  },
  emptyBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.body,
  },
});
