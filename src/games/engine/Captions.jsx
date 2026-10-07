import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../shared/components/AppText.jsx';
import { colors, radius } from '../../shared/theme.js';

/**
 * The read-along text box along the bottom of the stage. Purely visual: whatever
 * owns the clock (Narration, or a playing video) decides which line to show.
 */
export default function Captions({ text }) {
  const insets = useSafeAreaInsets();
  if (!text) return null;

  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, 16) }]}>
      {/* key on the text so each new line fades in */}
      <Animated.View key={text} entering={FadeIn.duration(250)} style={styles.box}>
        <AppText size={26} weight="bold" align="center" accessibilityLiveRegion="polite">
          {text}
        </AppText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    pointerEvents: 'none',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 96, // leaves room for the round buttons in the corners
  },
  box: {
    maxWidth: 760,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255, 253, 247, 0.94)',
    borderWidth: 3,
    borderColor: colors.inkFaint,
  },
});
