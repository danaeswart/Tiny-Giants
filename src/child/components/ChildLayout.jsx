import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useIsPortrait } from '../../shared/hooks/useLandscapeLock.js';
import { colors } from '../../shared/theme.js';
import RotatePrompt from './RotatePrompt.jsx';

/**
 * Navigator for every /child route. The landscape lock itself is applied in the
 * root layout (it has to be released again for adult routes). If the screen is
 * still portrait anyway (web, or an iPad in split view), show the rotate prompt,
 * keeping the screens mounted underneath so the child doesn't lose their place.
 */
export default function ChildLayout() {
  const { isPortrait, showRotatePrompt } = useIsPortrait();

  return (
    <View style={{ flex: 1, backgroundColor: colors.cream }}>
      <StatusBar hidden />
      <View style={{ flex: 1, display: isPortrait ? 'none' : 'flex' }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: colors.cream },
          }}
        />
      </View>
      {showRotatePrompt && <RotatePrompt />}
    </View>
  );
}
