// SCENE 12 · GAME · Build the sandcastle (tap)
// Each tap shows the next picture of the castle, so it looks like the child is
// patting the sand into shape. A little bounce and sand puff on every tap.
//
// To use your drawings: list them in order in FRAMES, e.g.
//   const FRAMES = [
//     require('../assets/images/12-castle-1.png'),
//     require('../assets/images/12-castle-2.png'),
//     ...
//   ];
// Use transparent PNGs, all the same size. While FRAMES is empty, the code-drawn
// placeholder castle is used.

import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Captions from '../../engine/Captions.jsx';
import { useStage } from '../../engine/Stage.js';
import { BeachBackdrop } from '../art/Backdrops.jsx';
import Castle, { CASTLE_STEPS } from '../art/Castle.jsx';
import Character from '../art/Character.jsx';
import Place from '../art/Place.jsx';

const FRAMES = [];
const STEPS = FRAMES.length || CASTLE_STEPS;

export default function BuildCastleScene({ onDone }) {
  const { height } = useStage();
  const [step, setStep] = useState(0);
  const [puffs, setPuffs] = useState(0); // bumps to replay the sand puff
  const done = step === STEPS - 1;

  const squish = useSharedValue(1);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [done, onDone]);

  const onTap = () => {
    if (done) return;
    setStep((s) => Math.min(s + 1, STEPS - 1));
    setPuffs((p) => p + 1);
    squish.set(withSequence(withTiming(0.88, { duration: 80 }), withSpring(1, { damping: 6 })));
  };

  const castleSize = height * 0.55;
  const castleStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: squish.get() }, { scaleX: 2 - squish.get() }] }));

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onTap} accessibilityRole="button" accessibilityLabel="Pat the sand">
      <BeachBackdrop />
      <Place x={0.22} bottom={0.12}>
        <Character size={height * 0.4} mood="happy" candle="out" />
      </Place>
      <Place x={0.6} bottom={0.1}>
        <Animated.View style={[{ transformOrigin: 'bottom' }, castleStyle]}>
          {FRAMES.length ? (
            <Image source={FRAMES[step]} style={{ width: castleSize, height: castleSize * 0.8 }} resizeMode="contain" />
          ) : (
            <Castle step={step} size={castleSize} />
          )}
        </Animated.View>
        {puffs > 0 && <SandPuff key={puffs} width={castleSize} />}
      </Place>
      <Captions text={done ? 'We built a sandcastle!' : 'Tap the sand to build the castle!'} />
    </Pressable>
  );
}

// A few grains of sand that pop up and fall around the castle.
function SandPuff({ width }) {
  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
      {[-0.35, -0.15, 0.1, 0.3, 0.42].map((dx, i) => (
        <Grain key={i} dx={dx * width} rise={30 + (i % 3) * 18} />
      ))}
    </View>
  );
}

function Grain({ dx, rise }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.set(withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) }));
  }, [t]);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - t.get(),
    transform: [{ translateX: dx * t.get() }, { translateY: -rise * Math.sin(t.get() * Math.PI) }],
  }));
  return <Animated.View style={[styles.grain, style]} />;
}

const styles = StyleSheet.create({
  grain: {
    position: 'absolute',
    left: '50%',
    bottom: 10,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#d1a45e',
  },
});
