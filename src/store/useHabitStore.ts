import { create } from 'zustand';

import * as completionRepo from '@/db/completionRepo';
import * as habitRepo from '@/db/habitRepo';
import { todayISO } from '@/domain/dates';
import type { CompletionSet, DateISO, Habit } from '@/domain/types';
import { cancelRemindersForHabit, syncRemindersForHabit } from '@/notifications/reminders';
import { updateWidgetsForHabit } from '@/widget/updateWidgets';

interface HabitState {
  hydrated: boolean;
  habits: Habit[];
  completions: Record<string, CompletionSet>;
  /** local calendar date the UI treats as "today"; refreshed on hydrate */
  today: DateISO;

  hydrate: () => void;
  createHabit: (data: habitRepo.NewHabit) => Promise<Habit>;
  updateHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  archiveHabit: (id: string) => Promise<void>;
  restoreHabit: (id: string) => Promise<void>;
  toggleCompletion: (habitId: string, date?: DateISO) => void;
  reorderHabits: (orderedIds: string[]) => void;
}

async function applyReminders(habit: Habit): Promise<Habit> {
  const notificationIds = await syncRemindersForHabit(habit);
  const updated = { ...habit, notificationIds };
  habitRepo.update(updated);
  return updated;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  hydrated: false,
  habits: [],
  completions: {},
  today: todayISO(),

  hydrate: () => {
    set({
      habits: habitRepo.getAll(),
      completions: completionRepo.getAll(),
      today: todayISO(),
      hydrated: true,
    });
  },

  createHabit: async (data) => {
    let habit = habitRepo.create(data);
    habit = await applyReminders(habit);
    set((s) => ({ habits: [...s.habits, habit] }));
    void updateWidgetsForHabit(habit.id);
    return habit;
  },

  updateHabit: async (habit) => {
    const updated = await applyReminders(habit);
    set((s) => ({ habits: s.habits.map((h) => (h.id === updated.id ? updated : h)) }));
    void updateWidgetsForHabit(updated.id);
  },

  deleteHabit: async (id) => {
    const habit = get().habits.find((h) => h.id === id);
    if (habit) await cancelRemindersForHabit(habit);
    habitRepo.remove(id);
    set((s) => {
      const { [id]: _, ...completions } = s.completions;
      return { habits: s.habits.filter((h) => h.id !== id), completions };
    });
    void updateWidgetsForHabit(id);
  },

  archiveHabit: async (id) => {
    const habit = get().habits.find((h) => h.id === id);
    if (!habit) return;
    const archived = await applyReminders({ ...habit, archivedAt: new Date().toISOString() });
    set((s) => ({ habits: s.habits.map((h) => (h.id === id ? archived : h)) }));
    void updateWidgetsForHabit(id);
  },

  restoreHabit: async (id) => {
    const habit = get().habits.find((h) => h.id === id);
    if (!habit) return;
    const restored = await applyReminders({ ...habit, archivedAt: null });
    set((s) => ({ habits: s.habits.map((h) => (h.id === id ? restored : h)) }));
    void updateWidgetsForHabit(id);
  },

  toggleCompletion: (habitId, date) => {
    const day = date ?? get().today;
    completionRepo.toggle(habitId, day);
    set((s) => {
      const current = s.completions[habitId] ?? new Set();
      const next = new Set(current);
      if (next.has(day)) next.delete(day);
      else next.add(day);
      return { completions: { ...s.completions, [habitId]: next } };
    });
    void updateWidgetsForHabit(habitId);
  },

  reorderHabits: (orderedIds) => {
    habitRepo.setPositions(orderedIds);
    set((s) => {
      const byId = new Map(s.habits.map((h) => [h.id, h]));
      const ordered = orderedIds
        .map((id, index) => {
          const habit = byId.get(id);
          return habit ? { ...habit, position: index } : null;
        })
        .filter((h): h is Habit => h !== null);
      const rest = s.habits.filter((h) => !orderedIds.includes(h.id));
      return { habits: [...ordered, ...rest] };
    });
  },
}));

export const selectActiveHabits = (s: HabitState) =>
  s.habits.filter((h) => h.archivedAt === null);

export const selectArchivedHabits = (s: HabitState) =>
  s.habits.filter((h) => h.archivedAt !== null);
