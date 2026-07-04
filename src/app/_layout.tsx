import * as Notifications from 'expo-notifications';
import { DarkTheme, Stack, ThemeProvider, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { initNotifications } from '@/notifications/reminders';
import { useHabitStore } from '@/store/useHabitStore';
import { theme } from '@/theme/theme';

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: theme.colors.background,
    card: theme.colors.background,
    text: theme.colors.textPrimary,
    border: theme.colors.separator,
    primary: theme.colors.textPrimary,
  },
};

export default function RootLayout() {
  const hydrate = useHabitStore((s) => s.hydrate);
  const router = useRouter();

  useEffect(() => {
    hydrate();
    void initNotifications();
    // Rehydrate whenever the app returns to the foreground: this picks up
    // completions toggled from the home-screen widget and date rollover.
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') hydrate();
    });
    return () => sub.remove();
  }, [hydrate]);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const habitId = response.notification.request.content.data?.habitId;
      if (typeof habitId === 'string') router.push(`/habit/${habitId}`);
    });
    return () => sub.remove();
  }, [router]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={navTheme}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShadowVisible: false,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
          <Stack.Screen name="habit/[id]" options={{ title: '' }} />
          <Stack.Screen
            name="habit-editor"
            options={{ presentation: 'modal', headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
