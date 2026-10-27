// SCENE 01 · GAME · Forest path (drag)
// Cami needs help getting through the woods. The child drags her along the winding road.
// Very forgiving: the finger only needs to be roughly near the road and moving forward, and
// she never slides backwards. She turns to face the way she's heading.
//
// The forest is drawn in code (blobs of trees on a dark green floor, a sandy road)
// to match the map drawing; the road follows the points in art/forestMapPath.js.

import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useStage } from '../../engine/Stage.js';
import { MAP_ASPECT, MAP_PATH } from '../art/forestMapPath.js';

const AVATAR = require('../assets/images/avatar-top.png'); // top-down view, facing right

const FLOOR = '#34503c';
const ROAD = '#b9aa7b';
const TREES = ['#103a1e', '#103a1e', '#416329', '#3f5f2c', '#98aa5c']; // mostly dark, some light

const POINTS = MAP_PATH.length;
const LOOK_AHEAD = 8; // how far ahead along the road the finger can "grab" her
const TOLERANCE = 0.16; // how far from the road the finger can be, as a fraction of the map's height

// Fits the whole map on screen and turns the road's points into screen positions.
function layoutMap(width, height) {
  const mapW = Math.min(width, height * MAP_ASPECT);
  const mapH = mapW / MAP_ASPECT;
  const left = (width - mapW) / 2;
  const top = (height - mapH) / 2;
  return {
    mapH,
    path: MAP_PATH.map(([px, py]) => ({ x: left + px * mapW, y: top + py * mapH })),
  };
}

// Small repeatable random numbers, so the trees are the same every time.
function seeded(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Clumps of overlapping circles across the whole screen, kept clear of the road.
function makeTrees(width, height, mapH, path) {
  const rand = seeded(7);
  const clear = mapH * 0.075; // half the road's width plus a gap
  const trees = [];
  for (let n = 0; n < 160 && trees.length < 70; n++) {
    const x = rand() * width;
    const y = rand() * height;
    const r = mapH * (0.03 + rand() * 0.035);
    if (path.some((p) => Math.hypot(p.x - x, p.y - y) < clear + r)) continue;
    const color = TREES[Math.floor(rand() * TREES.length)];
    const blobs = Array.from({ length: 3 + Math.floor(rand() * 3) }, () => ({
      cx: x + (rand() - 0.5) * r * 1.2,
      cy: y + (rand() - 0.5) * r * 1.2,
      r: r * (0.6 + rand() * 0.5),
    }));
    trees.push({ key: n, color, blobs });
  }
  return trees;
}

export default function ForestPathScene({ onDone }) {
  const { width, height } = useStage();
  const { mapH, path } = useMemo(() => layoutMap(width, height), [width, height]);
  const trees = useMemo(() => makeTrees(width, height, mapH, path), [width, height, mapH, path]);
  const roadD = useMemo(() => {
    // the road carries on to both edges of the screen, like the drawing
    const pts = [{ x: 0, y: path[0].y }, ...path, { x: width, y: path[POINTS - 1].y }];
    return pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  }, [path, width]);

  const [progress, setProgress] = useState(0); // index into path
  const finished = progress >= POINTS - 1;

  const charSize = mapH * 0.1;
  const x = useSharedValue(path[0].x);
  const y = useSharedValue(path[0].y);
  const angle = useSharedValue(0);
  const nudge = useSharedValue(0);
  const lastAngle = useRef(0);

  // Move her smoothly to her new spot on the road, turned the way she's heading.
  useEffect(() => {
    x.set(withTiming(path[progress].x, { duration: 120 }));
    y.set(withTiming(path[progress].y, { duration: 120 }));
    const ahead = path[Math.min(POINTS - 1, progress + 6)];
    const here = path[progress];
    if (ahead !== here) {
      let a = Math.atan2(ahead.y - here.y, ahead.x - here.x);
      // keep turning the short way round, never spinning a full circle
      while (a - lastAngle.current > Math.PI) a -= 2 * Math.PI;
      while (a - lastAngle.current < -Math.PI) a += 2 * Math.PI;
      lastAngle.current = a;
      angle.set(withTiming(a, { duration: 250 }));
    }
  }, [progress, path, x, y, angle]);

  // Until the child first moves her, she rocks forward a little: "push me this way".
  const waiting = progress === 0;
  useEffect(() => {
    if (waiting) {
      nudge.set(
        withRepeat(
          withSequence(
            withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) }),
            withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) }),
            withTiming(0, { duration: 700 }),
          ),
          -1,
        ),
      );
    } else {
      nudge.set(withTiming(0, { duration: 200 }));
    }
  }, [waiting, nudge]);

  useEffect(() => {
    if (!finished) return;
    const t = setTimeout(onDone, 2800);
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
    if (bestDist < mapH * TOLERANCE && best > from) {
      setProgress((p) => Math.max(p, best));
    }
  };

  const pan = Gesture.Pan()
    .minDistance(0)
    .runOnJS(true)
    .onBegin((e) => follow(e.x, e.y))
    .onUpdate((e) => follow(e.x, e.y));

  const charStyle = useAnimatedStyle(() => {
    const push = nudge.get() * charSize * 0.3; // forward, along the way she's facing
    return {
      transform: [
        { translateX: x.get() - charSize / 2 + Math.cos(angle.get()) * push },
        { translateY: y.get() - charSize / 2 + Math.sin(angle.get()) * push },
        { rotate: `${angle.get()}rad` },
        { scale: 1 + nudge.get() * 0.08 },
      ],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: FLOOR }]}>
        {/* width and height are set because on the web an <svg> ignores absoluteFill and shows at 300 x 150 */}
        <Svg width={width} height={height} style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
          <Rect width={width} height={height} fill={FLOOR} />
          <Path d={roadD} stroke={ROAD} strokeWidth={mapH * 0.085} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {trees.map((t) =>
            t.blobs.map((b, i) => <Circle key={`${t.key}-${i}`} cx={b.cx} cy={b.cy} r={b.r} fill={t.color} />),
          )}
        </Svg>
        <Animated.View style={[styles.character, charStyle]}>
          <Image source={AVATAR} style={{ width: charSize, height: charSize }} />
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  character: { position: 'absolute', left: 0, top: 0, pointerEvents: 'none' },
});
