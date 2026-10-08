import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { adult } from '../../shared/theme.js';

/**
 * All grown-up routes: the four main pages live in the (tabs) group, and detail pages
 * (one insight, one game) slide in on top of it. Pages draw their own headers.
 */
export default function AdultLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: adult.bg },
        }}
      />
    </>
  );
}
