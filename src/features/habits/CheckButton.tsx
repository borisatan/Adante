import { Check } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';

import { theme } from '@/theme/theme';

interface Props {
  color: string;
  done: boolean;
  onPress: () => void;
  size?: number;
}

export function CheckButton({ color, done, onPress, size = 48 }: Props) {
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
          backgroundColor: done ? color : theme.colors.cardRaised,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Check
        size={size * 0.5}
        color={done ? '#0B1220' : theme.colors.textSecondary}
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
