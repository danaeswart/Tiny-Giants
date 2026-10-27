import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useForceLandscapeOnWeb } from '../../shared/hooks/useLandscapeLock.js';
import { adult, colors } from '../../shared/theme.js';

/**
 * Navigator for every /child route. The landscape lock itself is applied in the
 * root layout (it has to be released again for adult routes). The child view is always
 * landscape: locked on a phone or tablet app, and turned a quarter turn on the web.
 */
export default function ChildLayout() {
  useForceLandscapeOnWeb();
  return (
    <View style={{ flex: 1, backgroundColor: adult.hero }}>
      <StatusBar hidden />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: colors.white },
        }}
      />
    </View>
  );
}
