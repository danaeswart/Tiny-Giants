import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { adult } from '../../shared/theme.js';

const CYCLE = 2600; // one bounce plus a rest, in ms
const SPARKS = 10;

/**
 * The home-screen book. It hops up and lands on a loop; on each hop a ring of
 * short flame-orange stripes pops outward around it and fades. Still when the device asks
 * for reduced motion.
 *   size  the book's height; the sparks scale from it
 */
export default function BouncingBook({ size, children }) {
  const t = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    t.set(withRepeat(withTiming(1, { duration: CYCLE, easing: Easing.linear }), -1));
  }, [reduceMotion, t]);

  // 0–0.35 of the cycle is the hop (up fast, down a little faster); the rest is a quiet pause.
  const hop = useAnimatedStyle(() => {
    const p = t.get();
    const lift = interpolate(p, [0, 0.14, 0.3, 0.35, 1], [0, -22, 0, 0, 0]);
    const squash = interpolate(p, [0, 0.14, 0.3, 0.35, 0.42, 1], [1, 1.03, 1, 0.96, 1, 1]);
    return { transform: [{ translateY: lift }, { scale: squash }] };
  });

  const disc = size * 1.25; // the box the sparks ring around

  return (
    <View style={{ width: disc, height: disc, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: SPARKS }, (_, i) => (
        <Spark key={i} t={t} angle={(360 / SPARKS) * i} inner={disc / 2 + 6} />
      ))}
      <Animated.View style={hop}>{children}</Animated.View>
    </View>
  );
}

function Spark({ t, angle, inner }) {
  const style = useAnimatedStyle(() => {
    const p = t.get();
    // starts as the book leaves the ground, flies out, and is gone before the book lands
    const out = interpolate(p, [0.03, 0.3], [0, 34], 'clamp');
    const opacity = interpolate(p, [0.03, 0.08, 0.22, 0.32], [0, 1, 0.8, 0], 'clamp');
    const grow = interpolate(p, [0.03, 0.15, 0.3], [0.3, 1, 0.6], 'clamp');
    return {
      opacity,
      transform: [{ rotate: `${angle}deg` }, { translateY: -(inner + out) }, { scaleY: grow }],
    };
  });
  return <Animated.View style={[styles.spark, style]} />;
}

const styles = StyleSheet.create({
  spark: { position: 'absolute', width: 7, height: 24, borderRadius: 4, backgroundColor: adult.flame },
});
