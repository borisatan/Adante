import type { WidgetInfo } from 'react-native-android-widget';

import * as completionRepo from '@/db/completionRepo';
import * as habitRepo from '@/db/habitRepo';
import * as widgetBindingRepo from '@/db/widgetBindingRepo';
import { todayISO } from '@/domain/dates';

import { HabitWidget, PlaceholderWidget } from './HabitWidget';

/**
 * Builds the JSX for one widget instance from the database. Runs both in the
 * app process and in the headless widget task handler, so it must stay free
 * of React context and store access.
 */
export function renderHabitWidget(widgetInfo: WidgetInfo): React.JSX.Element {
  const habitId = widgetBindingRepo.getHabitId(widgetInfo.widgetId);
  const habit = habitId ? habitRepo.getById(habitId) : null;

  if (!habit || habit.archivedAt !== null) {
    return <PlaceholderWidget message="Hold this widget and choose Reconfigure to pick a habit" />;
  }

  return (
    <HabitWidget
      habit={habit}
      completions={completionRepo.getForHabit(habit.id)}
      today={todayISO()}
      widthDp={widgetInfo.width}
      heightDp={widgetInfo.height}
    />
  );
}
