import { router } from 'expo-router';
import { View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Button from '../../shared/components/Button.jsx';
import { colors } from '../../shared/theme.js';
import ChildScreen from './ChildScreen.jsx';

/** Full-screen friendly message with one way out, used for empty and unavailable states. */
export default function ChildMessage({ title, children }) {
  return (
    <ChildScreen style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', gap: 20, maxWidth: 560 }}>
        <AppText size={30} weight="extrabold" align="center" accessibilityRole="header">
          {title}
        </AppText>
        {children && (
          <AppText size={20} color={colors.inkSoft} align="center">
            {children}
          </AppText>
        )}
        <Button icon="home" onPress={() => router.dismissTo('/child')}>
          Home
        </Button>
      </View>
    </ChildScreen>
  );
}
