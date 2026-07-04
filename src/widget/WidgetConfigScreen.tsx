import { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import type { WidgetConfigurationScreenProps } from 'react-native-android-widget';

import * as habitRepo from '@/db/habitRepo';
import * as widgetBindingRepo from '@/db/widgetBindingRepo';
import { HabitIcon } from '@/icons/HabitIcon';
import { theme } from '@/theme/theme';

import { renderHabitWidget } from './renderHabitWidget';

/**
 * Rendered inside the Android widget configuration activity when a widget is
 * added (and on long-press → Reconfigure). Reads straight from the DB — the
 * zustand store may not be hydrated in this activity.
 */
export function WidgetConfigScreen({
  widgetInfo,
  renderWidget,
  setResult,
}: WidgetConfigurationScreenProps) {
  const habits = useMemo(() => habitRepo.getAll().filter((h) => h.archivedAt === null), []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a habit</Text>
      {habits.length === 0 ? (
        <Text style={styles.empty}>No habits yet — create one in the app first.</Text>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(h) => h.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable
              style={styles.row}
              onPress={() => {
                widgetBindingRepo.bind(widgetInfo.widgetId, item.id);
                renderWidget(renderHabitWidget(widgetInfo));
                setResult('ok');
              }}
            >
              <View style={[styles.iconTile, { backgroundColor: item.color }]}>
                <HabitIcon slug={item.icon} size={18} color={theme.colors.background} />
              </View>
              <Text style={styles.name} numberOfLines={1}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      )}
      <Pressable style={styles.cancel} onPress={() => setResult('cancel')}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl * 2,
    gap: theme.spacing.md,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.title,
    fontWeight: '700',
  },
  empty: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.body,
  },
  list: {
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.control,
    padding: theme.spacing.md,
  },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.body,
    fontWeight: '600',
    flex: 1,
  },
  cancel: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  cancelText: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.body,
  },
});
