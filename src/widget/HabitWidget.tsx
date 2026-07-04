import { FlexWidget, SvgWidget, TextWidget } from 'react-native-android-widget';
import type { ColorProp } from 'react-native-android-widget';

import type { DateISO, Habit } from '@/domain/types';
import type { CompletionSet } from '@/domain/types';
import { widgetIconSvg } from '@/icons/widgetSvg';

import { buildGridSvg, columnsForWidth } from './gridSvg';

const BG = '#151E31';
const RAISED = '#1E2A44';
const TEXT = '#F1F5F9';
const PADDING = 12;
const CHECK_SIZE = 36;

const CHECK_MARK = (color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

interface Props {
  habit: Habit;
  completions: CompletionSet;
  today: DateISO;
  /** widget width in dp, from WidgetInfo */
  widthDp: number;
}

export function HabitWidget({ habit, completions, today, widthDp }: Props) {
  const doneToday = completions.has(today);
  const cols = columnsForWidth(widthDp - PADDING * 2);
  const grid = buildGridSvg(completions, cols, today, habit.color);

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: BG,
        borderRadius: 16,
        padding: PADDING,
        flexDirection: 'column',
        flexGap: 10,
      }}
    >
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          alignItems: 'center',
          flexGap: 8,
        }}
      >
        <SvgWidget
          svg={widgetIconSvg(habit.icon, habit.color)}
          style={{ height: 20, width: 20 }}
        />
        <FlexWidget style={{ flex: 1, flexDirection: 'row' }}>
          <TextWidget
            text={habit.name}
            maxLines={1}
            truncate="END"
            style={{ color: TEXT, fontSize: 15, fontWeight: '600' }}
          />
        </FlexWidget>
        <FlexWidget
          clickAction="TOGGLE_TODAY"
          clickActionData={{ habitId: habit.id }}
          style={{
            height: CHECK_SIZE,
            width: CHECK_SIZE,
            borderRadius: 12,
            backgroundColor: doneToday ? (habit.color as ColorProp) : RAISED,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SvgWidget
            svg={CHECK_MARK(doneToday ? '#0B1220' : '#8A94A8')}
            style={{ height: 18, width: 18 }}
          />
        </FlexWidget>
      </FlexWidget>
      <SvgWidget svg={grid.svg} style={{ width: grid.width, height: grid.height }} />
    </FlexWidget>
  );
}

export function PlaceholderWidget({ message }: { message: string }) {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: BG,
        borderRadius: 16,
        padding: PADDING,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextWidget text={message} style={{ color: '#8A94A8', fontSize: 13 }} />
    </FlexWidget>
  );
}
