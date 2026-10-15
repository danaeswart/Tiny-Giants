// SCENE 08 · GAME · Jump the logs (tap)
// Cami (seen from the side) stands on the path while logs roll toward her one at a time.
// The child taps anywhere to make her jump. No way to fail: if the child doesn't tap, the
// log just waits in front of her. As soon as she lands the last jump, the tripping video
// (scene 08b) takes over.
//
// The scenery and the logs are drawn in code; Cami is character-side.png.

import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';
import Captions from '../../engine/Captions.jsx';
import { useStage } from '../../engine/Stage.js';
import DrawnLog from '../art/DrawnLog.jsx';

const CAMI = require('../../../../assets/book/games/game1/character-side.png'); // faces right
const CAMI_ASPECT = 1073 / 1682;

const LOG_COUNT = 7;
const ROLL_IN_MS = 2200; // how long a log takes to reach her
const JUMP_MS = 380; // up, then the same back down

export default function JumpLogsScene({ onDone }) {
  const { width, height } = useStage();
  const [jumped, setJumped] = useState(0);
  const [finished, setFinished] = useState(false);
  const busy = useRef(false); // mid-jump (or finished): ignore taps

  const charH = height * 0.36;
  const charW = charH * CAMI_ASPECT;
  const charX = width * 0.2;
  const ground = height * 0.2; // her feet sit this far above the bottom
  const logH = height * 0.11;
  const logW = logH * 2.8;
  const waitX = charX + charW * 0.9; // where a log stops if she hasn't jumped yet

  const logX = useSharedValue(width + 40);
  const jumpY = useSharedValue(0);

  const rollIn = useCallback(() => {
    logX.set(width + 40);
    logX.set(withTiming(waitX, { duration: ROLL_IN_MS, easing: Easing.linear }));
  }, [logX, width, waitX]);

  useEffect(() => {
    rollIn();
  }, [rollIn]);

  useEffect(() => {
    if (finished) onDone();
  }, [finished, onDone]);

  const onTap = () => {
    if (busy.current) return;
    busy.current = true;
    const isLast = jumped === LOG_COUNT - 1;
    const logIsClose = logX.get() < waitX + charW * 2.2;

    if (!logIsClose) {
      // Log's still far away: a happy little hop, nothing else.
      jumpY.set(
        withSequence(
          withTiming(-height * 0.12, { duration: JUMP_MS * 0.7, easing: Easing.out(Easing.quad) }),
          withTiming(0, { duration: JUMP_MS * 0.7, easing: Easing.in(Easing.quad) }),
        ),
      );
      setTimeout(() => (busy.current = false), JUMP_MS * 1.4);
      return;
    }

    // Jump, and the log rolls underneath her.
    jumpY.set(
      withSequence(
        withTiming(-height * 0.3, { duration: JUMP_MS, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: JUMP_MS, easing: Easing.in(Easing.quad) }),
      ),
    );
    logX.set(withTiming(charX - logW - 60, { duration: JUMP_MS * 2, easing: Easing.linear }));

    if (isLast) {
      // Cleared the last one: the tripping clip plays right away.
      setTimeout(() => setFinished(true), JUMP_MS * 2);
      return;
    }

    setTimeout(() => {
      setJumped((n) => n + 1);
      busy.current = false;
      rollIn();
    }, JUMP_MS * 2 + 400);
  };

  const charStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: jumpY.get() }],
  }));
  const logStyle = useAnimatedStyle(() => ({ transform: [{ translateX: logX.get() }] }));

  return (
    <Pressable style={[StyleSheet.absoluteFill, styles.sky]} onPress={onTap} accessibilityRole="button" accessibilityLabel="Jump">
      <Scenery width={width} height={height} />
      <Animated.View style={[styles.abs, { left: 0, bottom: ground - logH * 0.25 }, logStyle]}>
        <DrawnLog width={logW} height={logH} bark="#5a410c" cut="#b8963f" ring="#7a5f1c" />
      </Animated.View>
      <Animated.View style={[styles.abs, { left: charX, bottom: ground, transformOrigin: 'bottom right' }, charStyle]}>
        <Image source={CAMI} style={{ width: charW, height: charH }} />
      </Animated.View>

      {/* a hint until she's made her first jump */}
      <Captions text={jumped === 0 && !finished ? 'Tap to jump over the logs!' : null} />
    </Pressable>
  );
}

// Sky, rolling hills and the dark grass she walks on, in the same colours as the book's art.
function Scenery({ width, height }) {
  return (
    <Svg style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]} width={width} height={height}>
      <Rect width={width} height={height} fill="#b8e0dc" />
      <Path
        d={`M0 ${height * 0.66} Q${width * 0.25} ${height * 0.62} ${width * 0.5} ${height * 0.64} T${width} ${height * 0.62} V${height} H0 Z`}
        fill="#4e7a3f"
      />
      <Path
        d={`M0 ${height * 0.73} Q${width * 0.3} ${height * 0.71} ${width * 0.6} ${height * 0.73} T${width} ${height * 0.71} V${height} H0 Z`}
        fill="#19330f"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  sky: { backgroundColor: '#b8e0dc' },
  abs: { position: 'absolute', pointerEvents: 'none' },
});
