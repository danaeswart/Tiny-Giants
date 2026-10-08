import { router } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { adult } from '../../shared/theme.js';

/** "‹ Back" at the top of a detail page. Falls back to the dashboard if there's nothing to go back to. */
export default function BackBar({ label = 'Back', onDark = false }) {
  function goBack() {
    if (router.canGoBack()) router.back();
    else router.replace('/adult');
  }

  return (
    <Pressable
      onPress={goBack}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={({ pressed }) => [styles.back, pressed && { opacity: 0.6 }]}
    >
      <Icon name="chevron-left" size={22} color={onDark ? '#ffffff' : adult.accent} strokeWidth={2.6} />
      <AppText size={17} weight="bold" color={onDark ? '#ffffff' : adult.accent}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  back: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 44 },
});
