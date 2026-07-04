import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';

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

const DEFAULT_TIME = '09:00';

const TOGGLE_W = 52;
const TOGGLE_H = 32;
const TOGGLE_PAD = 3;
const THUMB = TOGGLE_H - TOGGLE_PAD * 2;

function timeToDate(time: string): Date {
  const [h, m] = time.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

/** A custom, animated on/off toggle (replaces the default RN Switch). */
function AnimatedToggle({ value, onToggle }: { value: boolean; onToggle: (next: boolean) => void }) {
  const progress = useDerivedValue(() => withTiming(value ? 1 : 0, { duration: 200 }), [value]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.colors.cardRaised, theme.colors.accent],
    ),
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * (TOGGLE_W - THUMB - TOGGLE_PAD * 2) }],
  }));

  return (
    <Pressable hitSlop={8} onPress={() => onToggle(!value)}>
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
    </Pressable>
  );
}

export function ReminderPicker({ time, days, onChange }: Props) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const enabled = time !== null;

  return (
    <View style={styles.container}>
      <View style={styles.toggleRow}>
        <Text style={styles.label}>Reminder</Text>
        <AnimatedToggle
          value={enabled}
          onToggle={(on) => onChange(on ? DEFAULT_TIME : null, [])}
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
              onValueChange={(_event, date) => {
                setShowTimePicker(false);
                if (date) {
                  const hh = String(date.getHours()).padStart(2, '0');
                  const mm = String(date.getMinutes()).padStart(2, '0');
                  onChange(`${hh}:${mm}`, days);
                }
              }}
              onDismiss={() => setShowTimePicker(false)}
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
  track: {
    width: TOGGLE_W,
    height: TOGGLE_H,
    borderRadius: TOGGLE_H / 2,
    padding: TOGGLE_PAD,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: theme.colors.white,
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
