import { StyleSheet, Text, View } from 'react-native';

import type { GoalType, HabitStats } from '@/domain/types';
import { theme } from '@/theme/theme';

interface Props {
  stats: HabitStats;
  goalType: GoalType;
}

export function StatsRow({ stats, goalType }: Props) {
  const unit = goalType === 'daily' ? 'd' : 'wk';
  return (
    <View style={styles.row}>
      <StatCell label="Streak" value={`${stats.currentStreak} ${unit}`} />
      <StatCell label="Best" value={`${stats.bestStreak} ${unit}`} />
      <StatCell label="Total" value={String(stats.total)} />
      <StatCell label="Rate" value={`${stats.completionRate}%`} />
    </View>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  cell: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.control,
    borderWidth: theme.border.width,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  value: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.name,
    fontWeight: '700',
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.caption,
  },
});
