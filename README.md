# Andante

A calm, offline-first habit tracker for iOS and Android. Build daily habits, check them off with a tap, and watch your consistency fill in on a GitHub-style contribution grid.

Built with [Expo](https://expo.dev) (SDK 57), React Native and TypeScript.

## Features

- **Contribution-grid tracking** — each habit shows a tile grid of your history, so progress is visible at a glance.
- **Streaks & stats** — current and best streaks are computed locally and surfaced per habit.
- **Reminders** — schedule local notifications per habit, with per-weekday control.
- **Home-screen widget (Android)** — a resizable tile grid with one-tap check-off, kept in sync with the app.
- **Full customization** — pick from the full [Lucide](https://lucide.dev) icon set and a curated color palette per habit.
- **Offline-first** — everything is stored on-device in SQLite; no account required.
- **Import / share** — move your data with the built-in sharing flow.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Expo SDK 57, React Native 0.86, React 19 |
| Routing | `expo-router` (file-based) |
| State | Zustand |
| Persistence | `expo-sqlite` |
| Notifications | `expo-notifications` |
| Widget | `react-native-android-widget` |
| Icons | `lucide-react-native` |
| Language | TypeScript |

## Getting started

**Prerequisites:** Node.js 20+, the [Expo CLI](https://docs.expo.dev/more/expo-cli/), and (for native builds) Xcode and/or Android Studio.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm start

# or run directly on a platform (requires a native build)
npm run ios
npm run android
```

> This app relies on native modules (SQLite, notifications, the Android widget), so it needs a [development build](https://docs.expo.dev/develop/development-builds/introduction/) rather than Expo Go.

## Project structure

```
src/
├── app/            # Screens & navigation (expo-router: index, habit/[id], habit-editor, settings)
├── db/             # SQLite setup, migrations, and repositories
├── domain/         # Core logic: dates, grid data, streaks, shared types
├── features/       # UI feature modules (habits list/cards, editor pickers)
├── icons/          # Lucide icon catalog and the HabitIcon renderer
├── notifications/  # Reminder scheduling
├── store/          # Zustand store (useHabitStore)
├── theme/          # Design tokens (palette, spacing, radii, borders)
└── widget/         # Android home-screen widget + config
```

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo dev server |
| `npm run ios` | Build and run on iOS |
| `npm run android` | Build and run on Android |
| `npm run lint` | Lint with Expo's ESLint config |
| `npm test` | Run the Jest test suite |

## License

Private project — all rights reserved.
