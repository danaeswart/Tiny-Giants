import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { adult } from '../theme.js';

/**
 * Big, slowly drifting circles for the blue backdrop: a flame disc with a thin ring around it,
 * and a small lime dot. Sits behind everything and ignores touches.
 */
export default function Blobs() {
  const breathe = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    breathe.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: 3600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 3600, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
      ),
    );
  }, [reduceMotion, breathe]);

  const disc = useAnimatedStyle(() => ({
    transform: [{ translateY: -10 * breathe.get() }, { scale: 1 + 0.05 * breathe.get() }],
  }));
  const ring = useAnimatedStyle(() => ({ transform: [{ scale: 1.04 - 0.06 * breathe.get() }] }));
  const dot = useAnimatedStyle(() => ({ transform: [{ translateY: 8 * breathe.get() }] }));

  return (
    <>
      <Animated.View style={[styles.ring, ring]} />
      <Animated.View style={[styles.disc, disc]} />
      <Animated.View style={[styles.dot, dot]} />
    </>
  );
}

const styles = StyleSheet.create({
  disc: {
    position: 'absolute',
    right: -90,
    bottom: -110,
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: adult.flame,
    pointerEvents: 'none',
  },
  ring: {
    position: 'absolute',
    right: -150,
    bottom: -170,
    width: 500,
    height: 500,
    borderRadius: 250,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    pointerEvents: 'none',
  },
  dot: {
    position: 'absolute',
    left: 28,
    top: 90,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: adult.lime,
    pointerEvents: 'none',
  },
});
