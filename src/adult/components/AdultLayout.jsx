import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, fonts } from '../../shared/theme.js';

/** Adult routes: a normal stack with a header and back button, any orientation. */
export default function AdultLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.cream },
          headerTintColor: colors.seaDeep,
          headerTitleStyle: { fontFamily: fonts.extrabold, fontSize: 20, color: colors.ink },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.white },
        }}
      />
    </>
  );
}
