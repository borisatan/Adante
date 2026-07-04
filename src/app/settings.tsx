import { ArchiveRestore, Download, Trash2, Upload } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { exportData, importData } from '@/features/settings/exportImport';
import { HabitIcon } from '@/icons/HabitIcon';
import { selectArchivedHabits, useHabitStore } from '@/store/useHabitStore';
import { theme } from '@/theme/theme';

export default function SettingsScreen() {
  const archived = useHabitStore(useShallow(selectArchivedHabits));
  const habits = useHabitStore((s) => s.habits);
  const hydrate = useHabitStore((s) => s.hydrate);
  const restoreHabit = useHabitStore((s) => s.restoreHabit);
  const deleteHabit = useHabitStore((s) => s.deleteHabit);
  const [busy, setBusy] = useState(false);

  const onExport = async () => {
    setBusy(true);
    try {
      await exportData();
    } catch (e) {
      Alert.alert('Export failed', String(e instanceof Error ? e.message : e));
    } finally {
      setBusy(false);
    }
  };

  const onImport = () => {
    Alert.alert(
      'Import data',
      'Importing replaces all current habits and history. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Import',
          style: 'destructive',
          onPress: async () => {
            setBusy(true);
            try {
              const imported = await importData(habits);
              if (imported) {
                hydrate();
                Alert.alert('Import complete', `Restored ${imported.length} habits.`);
              }
            } catch (e) {
              Alert.alert('Import failed', String(e instanceof Error ? e.message : e));
            } finally {
              setBusy(false);
            }
          },
        },
      ],
    );
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert('Delete habit', `Delete "${name}" and all its history?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => void deleteHabit(id) },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>Backup</Text>
      <Pressable style={styles.row} onPress={onExport} disabled={busy}>
        <Upload size={20} color={theme.colors.textSecondary} />
        <Text style={styles.rowText}>Export data</Text>
      </Pressable>
      <Pressable style={styles.row} onPress={onImport} disabled={busy}>
        <Download size={20} color={theme.colors.textSecondary} />
        <Text style={styles.rowText}>Import data</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>Archived habits</Text>
      {archived.length === 0 ? (
        <Text style={styles.emptyText}>Nothing archived.</Text>
      ) : (
        archived.map((habit) => (
          <View key={habit.id} style={styles.row}>
            <HabitIcon slug={habit.icon} size={20} color={habit.color} />
            <Text style={[styles.rowText, { flex: 1 }]} numberOfLines={1}>
              {habit.name}
            </Text>
            <Pressable hitSlop={8} onPress={() => void restoreHabit(habit.id)}>
              <ArchiveRestore size={20} color={theme.colors.textSecondary} />
            </Pressable>
            <Pressable hitSlop={8} onPress={() => confirmDelete(habit.id, habit.name)}>
              <Trash2 size={20} color={theme.colors.danger} />
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.caption,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.control,
    borderWidth: theme.border.width,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  rowText: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.body,
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.body,
  },
});
