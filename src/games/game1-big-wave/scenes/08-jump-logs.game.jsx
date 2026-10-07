// SCENE 08 · GAME · Jump the logs (tap)
// Logs roll toward her one at a time; the child taps anywhere to make her jump.
// No way to fail: if the child doesn't tap, the log just waits in front of her.
// On the LAST log she trips and falls, which leads into scene 09.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Captions from '../../engine/Captions.jsx';
import { useStage } from '../../engine/Stage.js';
import { ForestBackdrop } from '../art/Backdrops.jsx';
import Character from '../art/Character.jsx';
import { Log } from '../art/Logs.jsx';

const LOG_COUNT = 5;
const ROLL_IN_MS = 2200; // how long a log takes to reach her
const JUMP_MS = 380; // up, then the same back down

export default function JumpLogsScene({ onDone }) {
  const { width, height } = useStage();
  const [jumped, setJumped] = useState(0);
  const [fallen, setFallen] = useState(false);
  const busy = useRef(false); // mid-jump (or fallen): ignore taps

  const charSize = height * 0.34;
  const charW = charSize * 0.75;
  const charX = width * 0.2;
  const ground = height * 0.16; // her feet / the logs sit this far above the bottom
  const logH = height * 0.09;
  const logW = logH * 2.4;
  const waitX = charX + charW * 0.9; // where a log stops if she hasn't jumped yet

  const logX = useSharedValue(width + 40);
  const jumpY = useSharedValue(0);
  const tilt = useSharedValue(0);

  const rollIn = useCallback(() => {
    logX.set(width + 40);
    logX.set(withTiming(waitX, { duration: ROLL_IN_MS, easing: Easing.linear }));
  }, [logX, width, waitX]);

  useEffect(() => {
    rollIn();
  }, [rollIn]);

  useEffect(() => {
    if (!fallen) return;
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, [fallen, onDone]);

  const onTap = () => {
    if (busy.current) return;
    busy.current = true;
    const isLast = jumped === LOG_COUNT - 1;
    const logIsClose = logX.get() < waitX + charW * 2.2;

    if (!logIsClose) {
      // Log's still far away: a happy little hop, nothing else.
      jumpY.set(withSequence(
        withTiming(-height * 0.12, { duration: JUMP_MS * 0.7, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: JUMP_MS * 0.7, easing: Easing.in(Easing.quad) }),
      ));
      setTimeout(() => (busy.current = false), JUMP_MS * 1.4);
      return;
    }

    // Jump, and the log rolls underneath her.
    const peak = isLast ? -height * 0.1 : -height * 0.3; // last jump is too low: she catches her foot
    jumpY.set(withSequence(
      withTiming(peak, { duration: JUMP_MS, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: JUMP_MS, easing: Easing.in(Easing.quad) }),
    ));
    logX.set(withTiming(charX - logW - 60, { duration: JUMP_MS * 2, easing: Easing.linear }));

    if (isLast) {
      // Trip: she tips forward and lands on the ground.
      tilt.set(withSequence(withTiming(0, { duration: JUMP_MS }), withTiming(80, { duration: 350 })));
      setTimeout(() => setFallen(true), JUMP_MS * 2);
      return;
    }

    setTimeout(() => {
      setJumped((n) => n + 1);
      busy.current = false;
      rollIn();
    }, JUMP_MS * 2 + 400);
  };

  const charStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: jumpY.get() }, { rotate: `${tilt.get()}deg` }],
  }));
  const logStyle = useAnimatedStyle(() => ({ transform: [{ translateX: logX.get() }] }));

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onTap} accessibilityRole="button" accessibilityLabel="Jump">
      <ForestBackdrop />
      <Animated.View style={[styles.abs, { left: 0, bottom: ground - logH * 0.2 }, logStyle]}>
        <Log width={logW} height={logH} />
      </Animated.View>
      <Animated.View
        style={[styles.abs, { left: charX, bottom: ground, transformOrigin: 'bottom right' }, charStyle]}
      >
        <Character size={charSize} mood={fallen ? 'ouch' : 'happy'} candle="out" />
      </Animated.View>

      {/* how many logs are left */}
      <View style={styles.counter}>
        {Array.from({ length: LOG_COUNT }, (_, i) => (
          <View key={i} style={[styles.dot, i < jumped && styles.dotDone]} />
        ))}
      </View>

      <Captions text={fallen ? 'Oh no!' : 'Tap to jump over the logs!'} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  abs: { position: 'absolute', pointerEvents: 'none' },
  counter: { position: 'absolute', top: 96, alignSelf: 'center', flexDirection: 'row', gap: 10 },
  dot: { width: 22, height: 22, borderRadius: 11, borderWidth: 3, borderColor: '#fff7ea', backgroundColor: 'rgba(43, 39, 51, 0.25)' },
  dotDone: { backgroundColor: '#ffc24b' },
});
