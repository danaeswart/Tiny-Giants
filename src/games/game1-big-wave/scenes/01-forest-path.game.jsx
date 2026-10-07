// SCENE 01 · GAME · Forest path (drag)
// The child drags her along a winding path through the woods. Very forgiving:
// the finger only needs to be roughly near the path and moving forward, and she
// never slides backwards.

import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import Captions from '../../engine/Captions.jsx';
import { useStage } from '../../engine/Stage.js';
import { ForestBackdrop } from '../art/Backdrops.jsx';
import Character from '../art/Character.jsx';

const POINTS = 80; // how finely the path is measured
const LOOK_AHEAD = 10; // how far ahead along the path the finger can "grab" her
const TOLERANCE = 0.28; // how far from the path the finger can be, as a fraction of screen height

// The path as a list of points across the screen: a gentle S-curve.
function buildPath(width, height) {
  return Array.from({ length: POINTS }, (_, i) => {
    const t = i / (POINTS - 1);
    return {
      x: width * (0.1 + t * 0.8),
      y: height * (0.7 + Math.sin(t * Math.PI * 2.2) * 0.1),
    };
  });
}

export default function ForestPathScene({ onDone }) {
  const { width, height } = useStage();
  const path = useMemo(() => buildPath(width, height), [width, height]);
  const [progress, setProgress] = useState(0); // index into path
  const finished = progress >= POINTS - 1;

  const charSize = height * 0.32;
  const x = useSharedValue(path[0].x);
  const y = useSharedValue(path[0].y);

  // Move her smoothly to her new spot on the path.
  useEffect(() => {
    x.set(withTiming(path[progress].x, { duration: 120 }));
    y.set(withTiming(path[progress].y, { duration: 120 }));
  }, [progress, path, x, y]);

  useEffect(() => {
    if (!finished) return;
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [finished, onDone]);

  // Find the point just ahead of her that's closest to the finger.
  const follow = (fx, fy) => {
    const from = progress;
    let best = from;
    let bestDist = Infinity;
    for (let i = from; i <= Math.min(POINTS - 1, from + LOOK_AHEAD); i++) {
      const d = Math.hypot(path[i].x - fx, path[i].y - fy);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    if (bestDist < height * TOLERANCE && best > from) {
      setProgress((p) => Math.max(p, best));
    }
  };

  const pan = Gesture.Pan()
    .minDistance(0)
    .runOnJS(true)
    .onBegin((e) => follow(e.x, e.y))
    .onUpdate((e) => follow(e.x, e.y));

  const charStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.get() - charSize * 0.375 }, { translateY: y.get() - charSize * 0.95 }],
  }));

  const d = path.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const end = path[POINTS - 1];
  const hint = path[Math.min(POINTS - 1, progress + 8)];

  return (
    <GestureDetector gesture={pan}>
      <View style={StyleSheet.absoluteFill}>
        <ForestBackdrop path={false} />
        <Svg style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
          <Path d={d} stroke="#d9b98a" strokeWidth={height * 0.12} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Path d={d} stroke="#fff7ea" strokeWidth={6} strokeDasharray="4 18" strokeLinecap="round" fill="none" opacity={0.8} />
          {/* the way out of the woods */}
          <Circle cx={end.x} cy={end.y} r={height * 0.06} fill="#ffc24b" />
        </Svg>
        {!finished && <Hint x={hint.x} y={hint.y} size={height * 0.12} />}
        <Animated.View style={[styles.character, charStyle]}>
          <Character size={charSize} mood="happy" candle="lit" />
        </Animated.View>
        <Captions text={finished ? 'We made it through the trees!' : 'Drag me along the path!'} />
      </View>
    </GestureDetector>
  );
}

// A pulsing ring showing where to drag next.
function Hint({ x, y, size }) {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.set(withRepeat(withTiming(1, { duration: 900 }), -1, true));
  }, [pulse]);
  const style = useAnimatedStyle(() => ({
    opacity: 0.5 + pulse.get() * 0.4,
    transform: [{ scale: 0.8 + pulse.get() * 0.3 }],
  }));
  return (
    <Animated.View
      style={[
        styles.hint,
        { left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: size },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  character: { position: 'absolute', left: 0, top: 0, pointerEvents: 'none' },
  hint: { position: 'absolute', borderWidth: 6, borderColor: '#ffffff', pointerEvents: 'none' },
});
