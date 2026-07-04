import { Platform } from 'react-native';
import { requestWidgetUpdate, requestWidgetUpdateById } from 'react-native-android-widget';

import * as widgetBindingRepo from '@/db/widgetBindingRepo';

import { renderHabitWidget } from './renderHabitWidget';

export const WIDGET_NAME = 'HabitWidget';

export async function updateAllWidgets(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await requestWidgetUpdate({
    widgetName: WIDGET_NAME,
    renderWidget: (info) => renderHabitWidget(info),
    widgetNotFound: () => {},
  }).catch(() => {});
}

export async function updateWidgetById(widgetId: number): Promise<void> {
  if (Platform.OS !== 'android') return;
  await requestWidgetUpdateById({
    widgetName: WIDGET_NAME,
    widgetId,
    renderWidget: (info) => renderHabitWidget(info),
    widgetNotFound: () => {},
  }).catch(() => {});
}

export async function updateWidgetsForHabit(habitId: string): Promise<void> {
  if (Platform.OS !== 'android') return;
  const widgetIds = widgetBindingRepo.getWidgetIdsForHabit(habitId);
  await Promise.all(widgetIds.map((id) => updateWidgetById(id)));
}
