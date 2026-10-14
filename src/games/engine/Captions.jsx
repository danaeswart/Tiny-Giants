import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../shared/components/AppText.jsx';
import { colors, radius } from '../../shared/theme.js';

/**
 * The read-along text box along the bottom of the stage. Purely visual: whatever
 * owns the clock (Narration, or a playing video) decides which line to show.
 * `position`: 'bottom' (default, centred), 'top' (centred along the top) or 'top-right' (for videos with the action on the left).
 */
export default function Captions({ text, hidden = false, position = 'bottom' }) {
  const insets = useSafeAreaInsets();
  if (!text || hidden) return null;

  return (
    <View
      style={[
        styles.wrap,
        position === 'top-right'
          ? // sits below the skip button in that corner
            [styles.topRight, { top: Math.max(insets.top, 16) + 72, paddingRight: Math.max(insets.right, 16) }]
          : position === 'top'
            ? { top: Math.max(insets.top, 16) }
            : { bottom: Math.max(insets.bottom, 16) },
      ]}
    >
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
  topRight: { alignItems: 'flex-end', paddingLeft: '62%' },
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
