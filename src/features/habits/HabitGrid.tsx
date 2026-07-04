import { memo } from 'react';
import { Pressable, View } from 'react-native';

import type { Tile, WeekColumn } from '@/domain/gridData';
import type { DateISO } from '@/domain/types';
import { theme } from '@/theme/theme';

interface Props {
  weeks: WeekColumn[];
  color: string;
  tileSize: number;
  gap: number;
  /** When set, non-future tiles are tappable (detail screen). */
  onTilePress?: (date: DateISO) => void;
}

function tileColor(tile: Tile, color: string): string {
  switch (tile.state) {
    case 'done':
      return color;
    case 'empty':
      return theme.colors.tileEmpty;
    case 'future':
      return 'transparent';
  }
}

export const HabitGrid = memo(function HabitGrid({
  weeks,
  color,
  tileSize,
  gap,
  onTilePress,
}: Props) {
  const radius = Math.max(2, Math.round(tileSize * 0.28));
  return (
    <View style={{ flexDirection: 'row', gap }}>
      {weeks.map((week) => (
        <View key={week[0].date} style={{ gap }}>
          {week.map((tile) => {
            const style = {
              width: tileSize,
              height: tileSize,
              borderRadius: radius,
              backgroundColor: tileColor(tile, color),
            };
            if (onTilePress && tile.state !== 'future') {
              return (
                <Pressable
                  key={tile.date}
                  onPress={() => onTilePress(tile.date)}
                  style={style}
                  hitSlop={gap / 2}
                />
              );
            }
            return <View key={tile.date} style={style} />;
          })}
        </View>
      ))}
    </View>
  );
});
