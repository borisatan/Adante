import * as Notifications from 'expo-notifications';

import type { Habit } from '@/domain/types';

const CHANNEL_ID = 'reminders';

export async function initNotifications(): Promise<void> {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Habit reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

async function ensurePermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

/** ISO weekday 1(Mon)..7(Sun) → expo weekday 1(Sun)..7(Sat) */
function isoToExpoWeekday(iso: number): number {
  return iso === 7 ? 1 : iso + 1;
}

export async function cancelRemindersForHabit(habit: Habit): Promise<void> {
  await Promise.all(
    habit.notificationIds.map((id) =>
      Notifications.cancelScheduledNotificationAsync(id).catch(() => {}),
    ),
  );
}

/**
 * Cancels and reschedules this habit's weekly notifications; returns the new
 * notification ids. Archived habits and habits without a reminder end up with
 * none. Safe to call on every mutation path.
 */
export async function syncRemindersForHabit(habit: Habit): Promise<string[]> {
  await cancelRemindersForHabit(habit);

  const active = habit.archivedAt === null && habit.reminderTime && habit.reminderDays.length > 0;
  if (!active) return [];
  if (!(await ensurePermission())) return [];

  const [hour, minute] = habit.reminderTime!.split(':').map(Number);
  const ids: string[] = [];
  for (const day of habit.reminderDays) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: habit.name,
        body: habit.description || 'Time to check in',
        data: { habitId: habit.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: isoToExpoWeekday(day),
        hour,
        minute,
        channelId: CHANNEL_ID,
      },
    });
    ids.push(id);
  }
  return ids;
}
