import { useEffect, useState } from 'react';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { DMMono_400Regular } from '@expo-google-fonts/dm-mono';
import { useFonts } from 'expo-font';
import { Stack, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuth } from '../shared/hooks/useAuth.js';
import { useOrientationLock } from '../shared/hooks/useLandscapeLock.js';
import PrototypeShell, { reportOrientation, shouldShowMockup } from '../shared/components/PrototypeShell';
import { colors } from '../shared/theme.js';

SplashScreen.preventAutoHideAsync();

// On a desktop browser the app is shown inside a phone mockup (the app itself runs in an iframe).
export default function RootLayout() {
  const [showMockup] = useState(shouldShowMockup);
  useEffect(() => {
    if (showMockup) SplashScreen.hideAsync();
  }, [showMockup]);

  return showMockup ? <PrototypeShell /> : <AppLayout />;
}

function AppLayout() {
  const { user, ready: authReady } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    DMMono_400Regular,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Talina: require('../../assets/fonts/Talina.otf'),
  });

  // Child routes are landscape-only; adult routes are portrait (the vertical layout).
  const segments = useSegments();
  const orientation = segments[0] === 'child' ? 'landscape' : segments[0] ? 'portrait' : null;
  useOrientationLock(orientation);
  // When embedded in the web phone mockup, tell it which way to turn.
  useEffect(() => reportOrientation(orientation ?? 'portrait'), [orientation]);

  // Hold the splash until fonts are in and Firebase has checked for a saved sign-in.
  const ready = (fontsLoaded || fontError) && authReady;
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.cream }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.cream } }}>
        {/* Signed in: the app. Signed out: only the login screens. Expo Router redirects when this flips. */}
        <Stack.Protected guard={!!user} redirectTo="/welcome">
          <Stack.Screen name="index" />
          <Stack.Screen name="child" />
          <Stack.Screen name="adult" />
          <Stack.Screen name="create-pin" />
          <Stack.Screen name="add-child" />
        </Stack.Protected>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="welcome" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
        </Stack.Protected>
      </Stack>
    </GestureHandlerRootView>
  );
}
