import { useEffect } from 'react';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { DMMono_400Regular } from '@expo-google-fonts/dm-mono';
import { useFonts } from 'expo-font';
import { Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useOrientationLock } from '../shared/hooks/useLandscapeLock.js';
import { colors } from '../shared/theme.js';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    DMMono_400Regular,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Talina: require('../../assets/fonts/Talina.otf'),
  });

  // Child routes are landscape-only; adult routes are portrait (the vertical layout).
  const segments = useSegments();
  useOrientationLock(segments[0] === 'child' ? 'landscape' : segments[0] === 'adult' ? 'portrait' : null);

  const ready = fontsLoaded || fontError;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.cream }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }} />
    </GestureHandlerRootView>
  );
}
