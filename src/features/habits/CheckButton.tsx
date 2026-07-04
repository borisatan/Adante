import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { BORDER_ALPHA, FADED_ALPHA, theme, withAlpha } from '@/theme/theme';

interface Props {
  color: string;
  done: boolean;
  onPress: () => void;
  size?: number;
}

export function CheckButton({ color, done, onPress, size = 44 }: Props) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: theme.radius.check,
          backgroundColor: done ? color : withAlpha(color, FADED_ALPHA),
          borderWidth: theme.border.width,
          borderColor: done ? 'transparent' : withAlpha(color, BORDER_ALPHA),
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Check
        size={size * 0.5}
        color={done ? theme.colors.background : color}
        strokeWidth={3}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
