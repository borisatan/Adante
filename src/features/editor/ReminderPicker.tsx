import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { theme } from '@/theme/theme';

interface Props {
  time: string | null;
  days: number[];
  onChange: (time: string | null, days: number[]) => void;
}

const WEEKDAYS = [
  { iso: 1, label: 'Mon' },
  { iso: 2, label: 'Tue' },
  { iso: 3, label: 'Wed' },
  { iso: 4, label: 'Thu' },
  { iso: 5, label: 'Fri' },
  { iso: 6, label: 'Sat' },
  { iso: 7, label: 'Sun' },
];

const ALL_DAYS = WEEKDAYS.map((d) => d.iso);
const DEFAULT_TIME = '09:00';

function timeToDate(time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

export function ReminderPicker({ time, days, onChange }: Props) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const enabled = time !== null;

  return (
    <View style={styles.container}>
      <View style={styles.toggleRow}>
        <Text style={styles.label}>Reminder</Text>
        <Switch
          value={enabled}
          onValueChange={(on) => onChange(on ? DEFAULT_TIME : null, on ? ALL_DAYS : [])}
          trackColor={{ true: theme.colors.cardRaised, false: theme.colors.cardRaised }}
          thumbColor={enabled ? theme.colors.textPrimary : theme.colors.textSecondary}
        />
      </View>
      {enabled && (
        <>
          <View style={styles.daysRow}>
            {WEEKDAYS.map(({ iso, label }) => {
              const selected = days.includes(iso);
              return (
                <Pressable
                  key={iso}
                  onPress={() => {
                    const next = selected ? days.filter((d) => d !== iso) : [...days, iso].sort();
                    onChange(time, next);
                  }}
                  style={[styles.day, selected && styles.daySelected]}
                >
                  <Text style={[styles.dayText, selected && styles.dayTextSelected]}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable style={styles.timeButton} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.timeText}>{time}</Text>
          </Pressable>
          {showTimePicker && (
            <DateTimePicker
              value={timeToDate(time ?? DEFAULT_TIME)}
              mode="time"
              is24Hour
              onChange={(event, date) => {
                setShowTimePicker(false);
                if (event.type === 'set' && date) {
                  const hh = String(date.getHours()).padStart(2, '0');
                  const mm = String(date.getMinutes()).padStart(2, '0');
                  onChange(`${hh}:${mm}`, days);
                }
              }}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.body,
  },
  daysRow: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  day: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.control,
    backgroundColor: theme.colors.cardRaised,
    alignItems: 'center',
  },
  daySelected: {
    backgroundColor: theme.colors.textPrimary,
  },
  dayText: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.caption,
  },
  dayTextSelected: {
    color: theme.colors.background,
    fontWeight: '600',
  },
  timeButton: {
    backgroundColor: theme.colors.cardRaised,
    borderRadius: theme.radius.control,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  timeText: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.name,
    fontWeight: '600',
  },
});
