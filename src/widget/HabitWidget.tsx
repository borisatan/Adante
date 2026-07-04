'use no memo';

import { FlexWidget, SvgWidget, TextWidget } from 'react-native-android-widget';
import type { ColorProp } from 'react-native-android-widget';

import type { DateISO, Habit } from '@/domain/types';
import type { CompletionSet } from '@/domain/types';
import { widgetIconSvg } from '@/icons/widgetSvg';

import { buildGridSvg, columnsForWidth, tileForHeight } from './gridSvg';

// Mirrors the app dashboard card exactly (HabitCard + CheckButton). See
// src/theme/theme.ts and src/features/habits/*.
const BG = '#161B2E'; // theme.colors.card
const BACKGROUND = '#08090F'; // theme.colors.background (check mark when done)
const TEXT = '#EDF0FA'; // theme.colors.textPrimary
const SECONDARY = '#8A96B4'; // theme.colors.textSecondary
const BORDER = '#2A3250'; // theme.colors.border
const CARD_RADIUS = 12; // theme.radius.card / radius.check
const PADDING = 12; // theme.spacing.md (card padding)
const CARD_GAP = 8; // theme.spacing.sm (card gap)
const HEADER_GAP = 12; // theme.spacing.md (header gap)
const CONTROL_SIZE = 44; // icon tile & check button (matches card)
const ICON_SIZE = 26;
const CHECK_MARK_SIZE = 22; // CheckButton: size * 0.5

// Faded/border tints of the habit color (theme FADED_ALPHA / BORDER_ALPHA),
// as #AARRGGBB so react-native-android-widget composites them over the card.
const FADED_ALPHA = 0.18;
const BORDER_ALPHA = 0.35;
function argb(hex: string, alpha: number): ColorProp {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${a}${hex.replace('#', '')}` as ColorProp;
}

// Fallbacks for renders where WidgetInfo has no measured size yet (e.g. the
// configuration activity reports width/height 0), based on the 3x2 target cell.
const DEFAULT_WIDTH = 180;
const DEFAULT_HEIGHT = 120;

const CHECK_MARK = (color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

interface Props {
  habit: Habit;
  completions: CompletionSet;
  today: DateISO;
  /** widget width in dp, from WidgetInfo */
  widthDp: number;
  /** widget height in dp, from WidgetInfo */
  heightDp: number;
}

export function HabitWidget({ habit, completions, today, widthDp, heightDp }: Props) {
  const doneToday = completions.has(today);

  const w = widthDp > 0 ? widthDp : DEFAULT_WIDTH;
  const h = heightDp > 0 ? heightDp : DEFAULT_HEIGHT;
  const contentW = w - PADDING * 2;
  const contentH = h - PADDING * 2 - CONTROL_SIZE - CARD_GAP;
  const tile = tileForHeight(contentH);
  const cols = columnsForWidth(contentW, tile);
  const grid = buildGridSvg(completions, cols, today, habit.color, tile);

  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: BG,
        borderRadius: CARD_RADIUS,
        borderWidth: 1,
        borderColor: BORDER,
        padding: PADDING,
        flexDirection: 'column',
        flexGap: CARD_GAP,
      }}
    >
      <FlexWidget
        style={{
          width: 'match_parent',
          flexDirection: 'row',
          alignItems: 'center',
          flexGap: HEADER_GAP,
        }}
      >
        <FlexWidget
          style={{
            height: CONTROL_SIZE,
            width: CONTROL_SIZE,
            borderRadius: CARD_RADIUS,
            backgroundColor: argb(habit.color, FADED_ALPHA),
            borderWidth: 1,
            borderColor: argb(habit.color, BORDER_ALPHA),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SvgWidget
            svg={widgetIconSvg(habit.icon, habit.color)}
            style={{ height: ICON_SIZE, width: ICON_SIZE }}
          />
        </FlexWidget>
        <FlexWidget style={{ flex: 1, flexDirection: 'column', flexGap: 2 }}>
          <TextWidget
            text={habit.name}
            maxLines={1}
            truncate="END"
            style={{ color: TEXT, fontSize: 17, fontWeight: '600' }}
          />
          {habit.description !== '' && (
            <TextWidget
              text={habit.description}
              maxLines={1}
              truncate="END"
              style={{ color: SECONDARY, fontSize: 12 }}
            />
          )}
        </FlexWidget>
        <FlexWidget
          clickAction="TOGGLE_TODAY"
          clickActionData={{ habitId: habit.id }}
          style={{
            height: CONTROL_SIZE,
            width: CONTROL_SIZE,
            borderRadius: CARD_RADIUS,
            backgroundColor: doneToday ? (habit.color as ColorProp) : argb(habit.color, FADED_ALPHA),
            borderWidth: 1,
            borderColor: doneToday ? '#00000000' : argb(habit.color, BORDER_ALPHA),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <SvgWidget
            svg={CHECK_MARK(doneToday ? BACKGROUND : habit.color)}
            style={{ height: CHECK_MARK_SIZE, width: CHECK_MARK_SIZE }}
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
        borderRadius: CARD_RADIUS,
        borderWidth: 1,
        borderColor: BORDER,
        padding: PADDING,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextWidget text={message} style={{ color: SECONDARY, fontSize: 14 }} />
    </FlexWidget>
  );
}
