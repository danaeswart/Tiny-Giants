import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import Icon from '../../shared/components/Icon.jsx';
import { colors } from '../../shared/theme.js';

const CORNER = 44;
const NUDGE = 10;

/**
 * "You can swipe" cue for the first and last spread: a lifted page corner plus a small
 * arrow below it that nudges the way to swipe. `side="right"` (first spread) points left;
 * `side="left"` (last spread) is the mirror image. Place it inside the open book view.
 * `fade` is a shared value, 1 = fully visible, 0 = hidden (it fades out while dragging).
 */
export default function SwipeHint({ side, pageWidth, pageHeight, fade }) {
  const reduceMotion = useReducedMotion();
  const phase = useSharedValue(0);
  const dir = side === 'right' ? -1 : 1;

  useEffect(() => {
    if (reduceMotion) return;
    phase.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
      ),
    );
  }, [reduceMotion, phase]);

  const wrapStyle = useAnimatedStyle(() => ({ opacity: fade ? fade.get() : 1 }));
  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dir * interpolate(phase.get(), [0, 1], [0, NUDGE]) }],
  }));
  // The folded corner lifts slightly and settles, in time with the arrow.
  const cornerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(phase.get(), [0, 1], [1, 1.18]) }],
  }));

  const mirror = side === 'left' ? -1 : 1;
  const edge = side === 'right' ? { right: 0 } : { left: 0 };

  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { zIndex: 11 }, wrapStyle]}>
      <Animated.View
        style={[styles.corner, edge, { top: pageHeight - CORNER, transformOrigin: side === 'right' ? 'right bottom' : 'left bottom' }, cornerStyle]}
      >
        <View style={{ transform: [{ scaleX: mirror }] }}>
          <Svg width={CORNER} height={CORNER} viewBox="0 0 44 44">
            {/* What's under the lifted corner */}
            <Path d="M44 0 L44 44 L0 44 Z" fill={colors.inkFaint} />
            {/* The corner, folded up over the page */}
            <Path d="M44 0 L0 44 L0 0 Z" fill={colors.paper} stroke={colors.inkFaint} strokeWidth={1} strokeLinejoin="round" />
          </Svg>
        </View>
      </Animated.View>

      <Animated.View style={[styles.arrow, { top: pageHeight + 4, [side]: 10 }, arrowStyle]}>
        <View style={{ transform: [{ scaleX: mirror }] }}>
          <Icon name="back" size={26} color="#ffffff" strokeWidth={3} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  corner: { position: 'absolute', width: CORNER, height: CORNER },
  arrow: { position: 'absolute' },
});
