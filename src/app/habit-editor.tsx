import { useLocalSearchParams, useRouter } from 'expo-router';
import { Archive, Check, Trash2, X } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { GoalType } from '@/domain/types';
import { ColorPicker } from '@/features/editor/ColorPicker';
import { IconPicker } from '@/features/editor/IconPicker';
import { ReminderPicker } from '@/features/editor/ReminderPicker';
import { DEFAULT_ICON } from '@/icons/curated';
import { useHabitStore } from '@/store/useHabitStore';
import { DEFAULT_HABIT_COLOR } from '@/theme/palette';
import { theme } from '@/theme/theme';

export default function HabitEditorScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = useHabitStore((s) => (id ? s.habits.find((h) => h.id === id) : undefined));
  const { createHabit, updateHabit, deleteHabit, archiveHabit } = useHabitStore();

  const [name, setName] = useState(existing?.name ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [icon, setIcon] = useState(existing?.icon ?? DEFAULT_ICON);
  const [color, setColor] = useState(existing?.color ?? DEFAULT_HABIT_COLOR);
  // Streak-goal configuration was removed from the editor; habits keep the
  // simple daily goal so the underlying data model stays valid.
  const goalType: GoalType = existing?.goalType ?? 'daily';
  const timesPerWeek = existing?.timesPerWeek ?? 7;
  const [reminderTime, setReminderTime] = useState<string | null>(existing?.reminderTime ?? null);
  const [reminderDays, setReminderDays] = useState<number[]>(existing?.reminderDays ?? []);

  const canSave = name.trim().length > 0;

  const save = async () => {
    if (!canSave) return;
    const data = {
      name: name.trim(),
      description: description.trim(),
      icon,
      color,
      goalType,
      timesPerWeek,
      reminderTime,
      reminderDays: reminderTime ? reminderDays : [],
    };
    if (existing) {
      await updateHabit({ ...existing, ...data });
    } else {
      await createHabit(data);
    }
    router.back();
  };

  const confirmDelete = () => {
    if (!existing) return;
    Alert.alert('Delete habit', `Delete "${existing.name}" and all its history?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteHabit(existing.id);
          router.dismissAll();
        },
      },
    ]);
  };

  const archive = async () => {
    if (!existing) return;
    await archiveHabit(existing.id);
    router.dismissAll();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={() => router.back()}>
          <X size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>{existing ? 'Edit Habit' : 'New Habit'}</Text>
        <Pressable hitSlop={8} onPress={save} disabled={!canSave} style={{ opacity: canSave ? 1 : 0.3 }}>
          <Check size={24} color={theme.colors.textPrimary} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Reading"
          placeholderTextColor={theme.colors.textSecondary}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Read every day for at least 15 minutes"
          placeholderTextColor={theme.colors.textSecondary}
        />

        <ReminderPicker
          time={reminderTime}
          days={reminderDays}
          onChange={(time, days) => {
            setReminderTime(time);
            setReminderDays(days);
          }}
        />

        <Text style={styles.label}>Icon</Text>
        <IconPicker value={icon} accentColor={color} onChange={setIcon} />

        <Text style={styles.label}>Color</Text>
        <ColorPicker value={color} onChange={setColor} />

        {existing && (
          <View style={styles.dangerRow}>
            <Pressable style={styles.dangerButton} onPress={archive}>
              <Archive size={18} color={theme.colors.textSecondary} />
              <Text style={styles.dangerText}>Archive</Text>
            </Pressable>
            <Pressable style={styles.dangerButton} onPress={confirmDelete}>
              <Trash2 size={18} color={theme.colors.danger} />
              <Text style={[styles.dangerText, { color: theme.colors.danger }]}>Delete</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.name,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.caption,
    marginTop: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.control,
    borderWidth: theme.border.width,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.textPrimary,
    fontSize: theme.font.body,
  },
  dangerRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  dangerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.control,
    borderWidth: theme.border.width,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
  },
  dangerText: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.body,
    fontWeight: '600',
  },
});
