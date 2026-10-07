// SCENE 05 · GAME · Clear the path (drag)
// The child drags the logs off the path one at a time. Only the top log can move
// (it glows), which is the "one small step at a time" lesson in game form.
// Drag a log far enough and it rolls away; let go too early and it slides back.

import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Captions from '../../engine/Captions.jsx';
import { useStage } from '../../engine/Stage.js';
import { ForestBackdrop } from '../art/Backdrops.jsx';
import Character from '../art/Character.jsx';
import { Log, PILE } from '../art/Logs.jsx';
import Place from '../art/Place.jsx';

const DRAG_AWAY = 0.22; // how far to drag (fraction of screen height) before a log counts as moved

export default function ClearLogsScene({ onDone }) {
  const { width, height } = useStage();
  const [remaining, setRemaining] = useState(PILE.length);
  const cleared = remaining === 0;

  useEffect(() => {
    if (!cleared) return;
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [cleared, onDone]);

  const logH = height * 0.09;
  const logW = logH * 3.6;
  const pileW = logH * 5.2 + logW;
  const pileLeft = width * 0.66 - pileW / 2;
  const pileBottom = height * 0.14;

  const moved = PILE.length - remaining;

  return (
    <View style={StyleSheet.absoluteFill}>
      <ForestBackdrop />
      <Place x={0.2} bottom={0.14}>
        <Character size={height * 0.42} mood={cleared ? 'happy' : 'calm'} candle="out" />
      </Place>

      {/* Logs stack bottom → top in PILE order; only the top remaining one is draggable. */}
      {PILE.slice(0, remaining).map((p, i) => (
        <DraggableLog
          key={i}
          active={i === remaining - 1}
          left={pileLeft + p.x * logH}
          bottom={pileBottom + p.y * logH * 0.92}
          width={logW}
          height={logH}
          awayDistance={height * DRAG_AWAY}
          onAway={() => setRemaining((r) => r - 1)}
        />
      ))}

      <Captions
        text={
          cleared
            ? 'The path is clear!'
            : moved === 0
              ? 'Drag the shiny log out of the way. One at a time!'
              : `${moved} moved… keep going, one at a time!`
        }
      />
    </View>
  );
}

function DraggableLog({ active, left, bottom, width, height, awayDistance, onAway }) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const glow = useSharedValue(0);

  useEffect(() => {
    glow.set(active ? withRepeat(withTiming(1, { duration: 700 }), -1, true) : 0);
  }, [active, glow]);

  const pan = Gesture.Pan()
    .enabled(active)
    .runOnJS(true)
    .onUpdate((e) => {
      tx.set(e.translationX);
      ty.set(e.translationY);
    })
    .onEnd((e) => {
      const dist = Math.hypot(e.translationX, e.translationY);
      if (dist > awayDistance) {
        // Roll it off the screen in the direction it was dragged.
        const k = 1600 / dist;
        tx.set(withTiming(e.translationX * k, { duration: 450 }));
        ty.set(withTiming(e.translationY * k, { duration: 450 }));
        setTimeout(onAway, 300);
      } else {
        tx.set(withSpring(0));
        ty.set(withSpring(0));
      }
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.get() }, { translateY: ty.get() }, { scale: 1 + glow.get() * 0.05 }],
    shadowOpacity: glow.get() * 0.9,
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          styles.log,
          { left, bottom, width, height, borderRadius: height, zIndex: active ? 2 : 1 },
          active && styles.activeLog,
          style,
        ]}
      >
        <Log width={width} height={height} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  log: { position: 'absolute' },
  // Soft golden glow on the log the child can move.
  activeLog: {
    shadowColor: '#ffe27a',
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
});
