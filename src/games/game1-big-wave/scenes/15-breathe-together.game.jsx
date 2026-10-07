// SCENE 15 · GAME · Breathing without the candle (guided breathing)
// Her candle is gone, but she breathes slowly on her own and invites the child to
// breathe with her. A soft circle grows (breathe in) and shrinks (breathe out).
// No tapping needed: the child just follows along.
//
// Flow: intro narration → BREATHS slow breaths → Next arrow

import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Captions from '../../engine/Captions.jsx';
import Narration from '../../engine/Narration.jsx';
import NextButton from '../../engine/NextButton.jsx';
import { useStage } from '../../engine/Stage.js';
import { BeachBackdrop } from '../art/Backdrops.jsx';
import Castle from '../art/Castle.jsx';
import Character from '../art/Character.jsx';
import Place from '../art/Place.jsx';

const BREATHS = 3;
const IN_MS = 4000;
const OUT_MS = 4000;

const INTRO = {
  audio: null, // require('../assets/audio/15-breathe-intro.m4a')
  lines: [
    { text: 'My candle is gone. The wave took it away.' },
    { text: 'But I can still breathe slowly, all by myself.' },
    { text: 'Will you breathe with me?' },
  ],
};

export default function BreatheTogetherScene({ onDone }) {
  const { width, height } = useStage();
  const [phase, setPhase] = useState('intro'); // intro → breathing → done
  const [breath, setBreath] = useState(0); // which breath we're on
  const [inhaling, setInhaling] = useState(true);
  const grow = useSharedValue(0);

  // Run the breaths: in (circle grows), out (circle shrinks), BREATHS times.
  useEffect(() => {
    if (phase !== 'breathing') return;
    grow.set(withTiming(inhaling ? 1 : 0, {
      duration: inhaling ? IN_MS : OUT_MS,
      easing: Easing.inOut(Easing.sin),
    }));
    const t = setTimeout(
      () => {
        if (inhaling) return setInhaling(false);
        if (breath + 1 >= BREATHS) return setPhase('done');
        setBreath(breath + 1);
        setInhaling(true);
      },
      inhaling ? IN_MS : OUT_MS,
    );
    return () => clearTimeout(t);
  }, [phase, inhaling, breath, grow]);

  const circle = height * 0.62;
  const circleStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + grow.get() * 0.35,
    transform: [{ scale: 0.45 + grow.get() * 0.55 }],
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <BeachBackdrop />
      <Place x={0.8} bottom={0.1}>
        <Castle size={height * 0.4} step={2} />
      </Place>

      {/* the breathing circle, behind her */}
      <Animated.View
        style={[
          styles.circle,
          {
            width: circle,
            height: circle,
            borderRadius: circle,
            left: width * 0.4 - circle / 2,
            top: height * 0.45 - circle / 2,
          },
          circleStyle,
        ]}
      />
      <Place x={0.4} bottom={0.14}>
        <Character size={height * 0.42} mood={phase === 'breathing' && !inhaling ? 'blowing' : 'calm'} candle={null} />
      </Place>

      {phase === 'intro' && <Narration {...INTRO} onEnd={() => setPhase('breathing')} />}
      {phase === 'breathing' && (
        <Captions text={inhaling ? 'Breathe in… 1, 2, 3, 4' : 'And slowly out… 1, 2, 3, 4'} />
      )}
      {phase === 'done' && (
        <>
          <Captions text="Well done. We did it together." />
          <NextButton onPress={onDone} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderWidth: 6,
    borderColor: '#ffd66b',
    pointerEvents: 'none',
  },
});
