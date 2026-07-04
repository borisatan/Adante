import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

import * as completionRepo from '@/db/completionRepo';
import * as widgetBindingRepo from '@/db/widgetBindingRepo';
import { todayISO } from '@/domain/dates';

import { renderHabitWidget } from './renderHabitWidget';
import { updateWidgetById } from './updateWidgets';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetAction, widgetInfo, clickAction, clickActionData, renderWidget } = props;

  switch (widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE': // periodic updates + requestWidgetUpdate
    case 'WIDGET_RESIZED':
      renderWidget(renderHabitWidget(widgetInfo));
      break;

    case 'WIDGET_DELETED':
      widgetBindingRepo.remove(widgetInfo.widgetId);
      break;

    case 'WIDGET_CLICK':
      if (clickAction === 'TOGGLE_TODAY' && typeof clickActionData?.habitId === 'string') {
        const habitId = clickActionData.habitId;
        completionRepo.toggle(habitId, todayISO());
        renderWidget(renderHabitWidget(widgetInfo));
        // Other widget instances showing the same habit need a refresh too.
        for (const widgetId of widgetBindingRepo.getWidgetIdsForHabit(habitId)) {
          if (widgetId !== widgetInfo.widgetId) await updateWidgetById(widgetId);
        }
      }
      break;
  }
}
