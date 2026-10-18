// SCENE 12 · GAME · Build the sandcastle (tap)
// Zoomed in on the sand: the child taps 9 times and the castle grows a piece at a time.
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
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useStage } from '../../engine/Stage.js';
import { BeachBackdrop } from '../art/Backdrops.jsx';
import Candle from '../art/Candle.jsx';
import Castle, { CASTLE_STEPS } from '../art/Castle.jsx';
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

  const castleSize = height * 1.05;
  const castleStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: squish.get() }, { scaleX: 2 - squish.get() }] }));

  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onTap} accessibilityRole="button" accessibilityLabel="Pat the sand">
      <BeachBackdrop />
      {/* zoomed in: the castle fills the screen, standing on a close-up of the sand */}
      <View style={[styles.sand, { height: height * 0.3 }]} />
      <Place x={0.5} bottom={0.1}>
        <Animated.View style={[{ transformOrigin: 'bottom' }, castleStyle]}>
          {FRAMES.length ? (
            <Image source={FRAMES[step]} style={{ width: castleSize, height: castleSize * 0.8 }} resizeMode="contain" />
          ) : (
            <Castle step={step} size={castleSize} />
          )}
          {/* step 7: the lit candle goes on the top tower */}
          {step >= 7 && (
            <View style={{ position: 'absolute', left: 0, right: 0, bottom: castleSize * 0.8 * 0.76, alignItems: 'center' }}>
              <Candle size={height * 0.27} />
            </View>
          )}
        </Animated.View>
        {puffs > 0 && <SandPuff key={puffs} width={castleSize} />}
      </Place>
      {step === 0 && puffs === 0 && <TapHint size={height * 0.3} bottom={height * 0.16} />}
    </Pressable>
  );
}

// Shows the child where to tap, without words: a ring pulses on the sand where
// the child should tap. It goes away after the first tap.
function TapHint({ size, bottom }) {
  const reduceMotion = useReducedMotion();
  const t = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) return;
    t.set(withRepeat(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.quad) }), -1, true));
  }, [reduceMotion, t]);
  const ring = useAnimatedStyle(() => ({ opacity: 0.9 - 0.6 * t.get(), transform: [{ scale: 0.7 + 0.5 * t.get() }] }));
  return (
    <View
      style={{ position: 'absolute', left: '50%', bottom, width: size, height: size, marginLeft: -size / 2, pointerEvents: 'none' }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View style={[styles.ring, { borderRadius: size / 2 }, ring]} />
    </View>
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
  sand: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#f2d7a2', pointerEvents: 'none' },
  ring: { ...StyleSheet.absoluteFill, borderWidth: 6, borderColor: '#ffffff', backgroundColor: 'rgba(255,255,255,0.25)' },
  grain: {
    position: 'absolute',
    left: '50%',
    bottom: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#d1a45e',
  },
});
