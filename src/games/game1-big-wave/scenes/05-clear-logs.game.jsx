// SCENE 05 · GAME · Clear the logs (drag or flick)
// A pile of logs sits in the forest. Only the top log can be moved: it floats a little
// and glows, which is the "one small step at a time" lesson in game form. The child drags
// or flicks it out of the way, and the next log starts to glow. When the pile is gone,
// the scene moves on.
//
// The forest and the logs are drawn in code (no pictures needed).

import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Ellipse, Rect } from 'react-native-svg';
import { useStage } from '../../engine/Stage.js';
import DrawnLog from '../art/DrawnLog.jsx';

const DRAG_AWAY = 0.18; // dragged this far (fraction of screen height) and let go: the log goes
const FLICK_SPEED = 700; // px per second: a quick flick sends it away even after a short drag
const LOG_HEIGHT = 0.18; // each log's height as a fraction of the screen's
const LOG_LENGTH = 3.1; // log length as a multiple of its height

// Barks, light to dark, so the pile isn't all one brown.
const BARKS = ['#7a4d2a', '#6b4423', '#845630', '#5f3c1f'];

// How many logs sit in each row of the pile, bottom row first.
const ROWS = [3, 2, 2, 1];

// Where each log sits, bottom row first. The last log is the top of the pile.
function makePile(width, height) {
  const logH = height * LOG_HEIGHT;
  const logW = logH * LOG_LENGTH;
  const rowH = logH * 0.88;
  const baseY = height * 0.8 - logH; // top edge of the bottom row
  const logs = [];
  ROWS.forEach((count, r) => {
    const rowW = count * logW * 0.98;
    for (let c = 0; c < count; c++) {
      const n = logs.length;
      logs.push({
        key: n,
        left: (width - rowW) / 2 + c * logW * 0.98 + (n % 2 ? 4 : -4),
        top: baseY - r * rowH,
        tilt: ((n * 37) % 7) - 3, // a few degrees either way
        bark: BARKS[n % BARKS.length],
      });
    }
  });
  return { logW, logH, logs };
}

export default function ClearLogsScene({ onDone }) {
  const { width, height } = useStage();
  const pile = useMemo(() => makePile(width, height), [width, height]);
  const [remaining, setRemaining] = useState(pile.logs.length);
  const cleared = remaining === 0;

  useEffect(() => {
    if (!cleared) return;
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [cleared, onDone]);

  return (
    <View style={[StyleSheet.absoluteFill, styles.forest]}>
      <Forest width={width} height={height} />

      {/* Logs stack bottom → top in list order; only the top remaining one can be moved. */}
      {pile.logs.slice(0, remaining).map((log, i) => (
        <DraggableLog
          key={log.key}
          active={i === remaining - 1}
          log={log}
          width={pile.logW}
          height={pile.logH}
          awayDistance={height * DRAG_AWAY}
          farAway={Math.max(width, height) * 1.4}
          onAway={() => setRemaining((r) => r - 1)}
        />
      ))}
    </View>
  );
}

// A simple forest in the book's colours: dark bushes, tree trunks, grass.
function Forest({ width, height }) {
  return (
    <Svg style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]} width={width} height={height}>
      <Rect width={width} height={height * 0.6} fill="#6a9160" />
      <Ellipse cx={width * 0.1} cy={height * 0.48} rx={width * 0.16} ry={height * 0.3} fill="#1e3d17" />
      <Ellipse cx={width * 0.5} cy={height * 0.3} rx={width * 0.13} ry={height * 0.26} fill="#1e3d17" />
      <Ellipse cx={width * 0.88} cy={height * 0.48} rx={width * 0.14} ry={height * 0.22} fill="#9aaa56" />
      <Rect x={width * 0.7} width={width * 0.06} height={height * 0.6} fill="#543e0b" />
      <Rect x={width * 0.93} width={width * 0.035} height={height * 0.5} fill="#543e0b" />
      <Rect y={height * 0.6} width={width} height={height * 0.4} fill="#3d6b2f" />
      <Rect y={height * 0.88} width={width} height={height * 0.12} fill="#2a4d20" />
    </Svg>
  );
}

function DraggableLog({ active, log, width, height, awayDistance, farAway, onAway }) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const hover = useSharedValue(0); // 0 = resting, 1 = floating up
  const glow = useSharedValue(0);

  // The log that can be moved floats up and down and glows, so the child knows it's next.
  useEffect(() => {
    if (active) {
      const ease = Easing.inOut(Easing.sin);
      hover.set(
        withRepeat(
          withSequence(withTiming(1, { duration: 900, easing: ease }), withTiming(0.2, { duration: 900, easing: ease })),
          -1,
        ),
      );
      glow.set(withRepeat(withSequence(withTiming(1, { duration: 900 }), withTiming(0.4, { duration: 900 })), -1));
    } else {
      hover.set(0);
      glow.set(0);
    }
  }, [active, hover, glow]);

  const pan = Gesture.Pan()
    .enabled(active)
    .runOnJS(true)
    .onUpdate((e) => {
      tx.set(e.translationX);
      ty.set(e.translationY);
    })
    .onEnd((e) => {
      const dist = Math.hypot(e.translationX, e.translationY);
      const speed = Math.hypot(e.velocityX, e.velocityY);
      const flicked = speed > FLICK_SPEED && dist > 20;
      if (dist > awayDistance || flicked) {
        // Send it off the screen the way it was heading: the flick's direction, or the drag's.
        const [dx, dy, len] = flicked ? [e.velocityX, e.velocityY, speed] : [e.translationX, e.translationY, dist];
        const k = farAway / len;
        tx.set(withTiming(e.translationX + dx * k, { duration: 450, easing: Easing.in(Easing.quad) }));
        ty.set(withTiming(e.translationY + dy * k, { duration: 450, easing: Easing.in(Easing.quad) }));
        setTimeout(onAway, 300);
      } else {
        tx.set(withSpring(0));
        ty.set(withSpring(0));
      }
    });

  const logStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.get() },
      { translateY: ty.get() - hover.get() * height * 0.12 },
      { rotate: `${log.tilt}deg` },
      { scale: 1 + hover.get() * 0.04 },
    ],
  }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.get() * 0.7 }));
  const halo = -height * 0.15;

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.log, { left: log.left, top: log.top, width, height, zIndex: active ? 2 : 1 }, logStyle]}>
        {active && (
          <Animated.View
            style={[styles.glow, { borderRadius: height / 2, left: halo, right: halo, top: halo, bottom: halo }, glowStyle]}
          />
        )}
        <DrawnLog width={width} height={height} bark={log.bark} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  forest: { backgroundColor: '#3d6b2f' },
  log: { position: 'absolute' },
  // A soft golden halo behind the log that can be moved.
  glow: { position: 'absolute', backgroundColor: '#ffe27a', pointerEvents: 'none' },
});
