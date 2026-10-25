import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useIsPortrait } from '../../shared/hooks/useLandscapeLock.js';
import { adult, colors } from '../../shared/theme.js';
import RotatePrompt from './RotatePrompt.jsx';

const ROTATE_PROMPT_MS = 4000; // how long the "turn your phone" screen stays before the child view opens

/**
 * Navigator for every /child route. The landscape lock itself is applied in the
 * root layout (it has to be released again for adult routes). If the screen is
 * still portrait anyway (web, or an iPad in split view), show the rotate prompt,
 * keeping the screens mounted underneath so the child doesn't lose their place.
 */
export default function ChildLayout() {
  const { isPortrait, showRotatePrompt } = useIsPortrait();
  const [promptDone, setPromptDone] = useState(false);

  // The prompt is a nudge, not a gate: after a few seconds the child view opens even if the
  // phone hasn't been turned yet.
  useEffect(() => {
    if (!showRotatePrompt || promptDone) return;
    const t = setTimeout(() => setPromptDone(true), ROTATE_PROMPT_MS);
    return () => clearTimeout(t);
  }, [showRotatePrompt, promptDone]);

  const holdForRotate = isPortrait && !promptDone;

  return (
    <View style={{ flex: 1, backgroundColor: adult.hero }}>
      <StatusBar hidden />
      <View style={{ flex: 1, display: holdForRotate ? 'none' : 'flex' }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
            contentStyle: { backgroundColor: colors.white },
          }}
        />
      </View>
      {showRotatePrompt && !promptDone && <RotatePrompt />}
    </View>
  );
}
