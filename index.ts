import { Platform } from 'react-native';
import {
  registerWidgetConfigurationScreen,
  registerWidgetTaskHandler,
} from 'react-native-android-widget';

import { WidgetConfigScreen } from './src/widget/WidgetConfigScreen';
import { widgetTaskHandler } from './src/widget/widgetTaskHandler';

if (Platform.OS === 'android') {
  registerWidgetTaskHandler(widgetTaskHandler);
  registerWidgetConfigurationScreen(WidgetConfigScreen);
}

// Loaded via require so the widget registrations above run first — a plain
// import would be hoisted ahead of them.
require('expo-router/entry');
