// PLACEHOLDER ART: the big close-up candle for the blowing scenes (03, 10).
// The flame is animated in code so it can react to the child's breath. Even with
// final art, keep the flame as its own layer so it can still move.

import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, Path, RadialGradient, Stop } from 'react-native-svg';

/**
 *   size   overall height in pixels
 *   blow   shared value 0–1: how hard the child is blowing right now (flame leans and shrinks)
 *   lit    false = the flame goes out and a puff of smoke rises
 */
export default function Candle({ size = 300, blow, lit = true }) {
  const flameW = size * 0.22;
  const flameH = size * 0.34;
  const bodyW = size * 0.26;

  const flicker = useSharedValue(0);
  const out = useSharedValue(lit ? 0 : 1);

  useEffect(() => {
    flicker.set(withRepeat(
      withSequence(
        withTiming(1, { duration: 180, easing: Easing.inOut(Easing.quad) }),
        withTiming(-1, { duration: 220, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      true,
    ));
  }, [flicker]);

  useEffect(() => {
    out.set(withTiming(lit ? 0 : 1, { duration: 350 }));
  }, [lit, out]);

  const flameStyle = useAnimatedStyle(() => {
    const b = blow ? blow.get() : 0;
    return {
      opacity: 1 - out.get(),
      transform: [
        { rotate: `${-b * 40 + flicker.get() * 3}deg` },
        { scaleY: (1 - b * 0.4 + flicker.get() * 0.05) * (1 - out.get()) },
        { scaleX: 1 - b * 0.15 - flicker.get() * 0.04 },
      ],
    };
  });

  return (
    <View style={{ width: size * 0.6, height: size, alignItems: 'center', justifyContent: 'flex-end', pointerEvents: 'none' }}>
      {/* smoke, only once it's out */}
      {!lit && <Smoke size={size} />}
      {/* flame grows from its base, so it leans like a real one */}
      <Animated.View style={[{ width: flameW, height: flameH, transformOrigin: 'bottom' }, flameStyle]}>
        <Svg width={flameW} height={flameH} viewBox="0 0 40 60">
          <Defs>
            <RadialGradient id="flame" cx="50%" cy="70%" r="60%">
              <Stop offset="0" stopColor="#fff6c2" />
              <Stop offset="0.5" stopColor="#ffc24b" />
              <Stop offset="1" stopColor="#f07b2f" />
            </RadialGradient>
          </Defs>
          <Path d="M20 0 C30 18 40 30 38 42 C36 54 28 60 20 60 C12 60 4 54 2 42 C0 30 10 18 20 0 Z" fill="url(#flame)" />
        </Svg>
      </Animated.View>
      {/* wick */}
      <View style={{ width: 4, height: size * 0.05, backgroundColor: '#2b2733', borderRadius: 2 }} />
      {/* wax */}
      <View
        style={{
          width: bodyW,
          height: size * 0.55,
          backgroundColor: '#fff3d6',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderWidth: 3,
          borderColor: '#e6cf9f',
        }}
      />
      {/* holder */}
      <View style={{ width: size * 0.5, height: size * 0.06, backgroundColor: '#c98f4f', borderRadius: 999 }} />
    </View>
  );
}

function Smoke({ size }) {
  return (
    <View style={{ position: 'absolute', bottom: size * 0.62, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <Puff key={i} delay={i * 220} size={size * (0.08 + i * 0.03)} />
      ))}
    </View>
  );
}

function Puff({ delay, size }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.set(withDelay(delay, withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) })));
  }, [delay, t]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.6 * (1 - t.get()),
    transform: [{ translateY: -t.get() * size * 3 }, { translateX: Math.sin(t.get() * 6) * 10 }, { scale: 0.6 + t.get() }],
  }));
  return (
    <Animated.View
      style={[{ position: 'absolute', width: size, height: size, borderRadius: size, backgroundColor: '#c9c3cf' }, style]}
    />
  );
}
