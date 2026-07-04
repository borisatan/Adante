import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import * as completionRepo from '@/db/completionRepo';
import { getDb } from '@/db/db';
import * as habitRepo from '@/db/habitRepo';
import { todayISO } from '@/domain/dates';
import type { ExportFile, Habit } from '@/domain/types';
import { cancelRemindersForHabit, syncRemindersForHabit } from '@/notifications/reminders';
import { updateAllWidgets } from '@/widget/updateWidgets';

export function buildExport(): ExportFile {
  const habits = habitRepo.getAll().map(({ notificationIds: _, ...habit }) => habit);
  const completionsByHabit = completionRepo.getAll();
  const completions: ExportFile['completions'] = [];
  for (const [habitId, dates] of Object.entries(completionsByHabit)) {
    for (const date of dates) completions.push({ habitId, date });
  }
  return {
    app: 'andante',
    version: 1,
    exportedAt: new Date().toISOString(),
    habits,
    completions,
  };
}

export async function exportData(): Promise<void> {
  const file = new File(Paths.cache, `andante-export-${todayISO()}.json`);
  if (file.exists) file.delete();
  file.write(JSON.stringify(buildExport(), null, 2));
  await Sharing.shareAsync(file.uri, { mimeType: 'application/json' });
}

export function validateExport(data: unknown): ExportFile {
  const file = data as ExportFile;
  if (
    !file ||
    file.app !== 'andante' ||
    typeof file.version !== 'number' ||
    file.version > 1 ||
    !Array.isArray(file.habits) ||
    !Array.isArray(file.completions)
  ) {
    throw new Error('Not a valid Andante export file.');
  }
  for (const habit of file.habits) {
    if (typeof habit.id !== 'string' || typeof habit.name !== 'string') {
      throw new Error('Export file contains an invalid habit.');
    }
  }
  for (const completion of file.completions) {
    if (typeof completion.habitId !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(completion.date)) {
      throw new Error('Export file contains an invalid completion.');
    }
  }
  return file;
}

/** Returns the imported habits, or null when the user cancelled the picker. */
export async function importData(currentHabits: Habit[]): Promise<Habit[] | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: 'application/json',
    copyToCacheDirectory: true,
  });
  if (result.canceled) return null;

  const content = await new File(result.assets[0].uri).text();
  const data = validateExport(JSON.parse(content));

  for (const habit of currentHabits) {
    await cancelRemindersForHabit(habit);
  }

  const habits: Habit[] = data.habits.map((h) => ({ ...h, notificationIds: [] }));
  const db = getDb();
  db.withTransactionSync(() => {
    habitRepo.wipeAll();
    for (const habit of habits) habitRepo.insert(habit);
    for (const completion of data.completions) {
      completionRepo.insert(completion.habitId, completion.date);
    }
  });

  for (const habit of habits) {
    const notificationIds = await syncRemindersForHabit(habit);
    habitRepo.update({ ...habit, notificationIds });
  }
  await updateAllWidgets();
  return habits;
}
