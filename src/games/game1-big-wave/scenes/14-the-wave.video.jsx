// SCENE 14 · VIDEO · The wave
// A big wave rolls in and washes the candle away. The uncontrollable moment.
// This is the best scene to make as a real video (water is hard to draw in code).
//
// To use the real video: set SRC = require('../assets/video/14-the-wave.mp4')

import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useStage } from '../../engine/Stage.js';
import VideoScene from '../../engine/VideoScene.jsx';
import { BeachBackdrop } from '../art/Backdrops.jsx';
import Candle from '../art/Candle.jsx';
import Castle from '../art/Castle.jsx';
import Character from '../art/Character.jsx';
import Place from '../art/Place.jsx';

const SRC = null;
const LINES = [
  { text: 'Oh! Here comes a big wave!', at: 0.5 },
  { text: 'Oh no… my candle!', at: 4.5 },
];

function WaveArt() {
  const { width, height } = useStage();
  const castleSize = height * 0.55;
  const [washed, setWashed] = useState(false);
  const wave = useSharedValue(width); // left edge of the wave

  useEffect(() => {
    wave.set(withDelay(
      1500,
      withSequence(
        withTiming(-width * 0.1, { duration: 1500, easing: Easing.in(Easing.quad) }),
        withTiming(width, { duration: 1500, easing: Easing.out(Easing.quad) }),
      ),
    ));
    // swap to the washed-out castle while the wave covers it
    const t = setTimeout(() => setWashed(true), 3000);
    return () => clearTimeout(t);
  }, [wave, width]);

  const waveStyle = useAnimatedStyle(() => ({ transform: [{ translateX: wave.get() }] }));

  return (
    <>
      <BeachBackdrop />
      <Place x={0.22} bottom={0.12}>
        <Character size={height * 0.4} mood={washed ? 'worried' : 'happy'} candle={null} />
      </Place>
      <Place x={0.6} bottom={0.1}>
        <Castle size={castleSize} step={washed ? 2 : 5} />
      </Place>
      {!washed && (
        <Place x={0.6} bottom={0.1 + 0.55 * 0.8 * 0.74}>
          <Candle size={height * 0.14} />
        </Place>
      )}
      <Animated.View style={[styles.wave, { width: width * 1.2, borderTopLeftRadius: height * 0.5 }, waveStyle]} />
    </>
  );
}

export default function TheWaveScene({ onDone }) {
  return (
    <VideoScene
      src={SRC}
      lines={LINES}
      placeholder={{ Art: WaveArt, label: 'the big wave', seconds: 7 }}
      onDone={onDone}
    />
  );
}

const styles = StyleSheet.create({
  wave: {
    position: 'absolute',
    left: 0,
    top: '25%',
    bottom: 0,
    backgroundColor: 'rgba(63, 143, 168, 0.92)',
    borderTopWidth: 18,
    borderColor: '#e6f6fa',
    pointerEvents: 'none',
  },
});
