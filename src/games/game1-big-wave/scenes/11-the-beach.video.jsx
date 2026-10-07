// SCENE 11 · VIDEO · The beach
// She arrives at the beach. The tone shifts calmer.
//
// To use the real video: set SRC = require('../assets/video/11-the-beach.mp4')

import { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useStage } from '../../engine/Stage.js';
import VideoScene from '../../engine/VideoScene.jsx';
import { BeachBackdrop } from '../art/Backdrops.jsx';
import Character from '../art/Character.jsx';

const SRC = null;
const LINES = [
  { text: 'We made it to the beach!', at: 0.5 },
  { text: 'Listen to the waves. Shhh… so calm.', at: 3 },
];

function ArrivingArt() {
  const { width, height } = useStage();
  const walk = useSharedValue(0);

  useEffect(() => {
    walk.set(withTiming(1, { duration: 3000, easing: Easing.out(Easing.quad) }));
  }, [walk]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: width * (-0.1 + walk.get() * 0.4) }] }));

  return (
    <>
      <BeachBackdrop />
      <Animated.View style={[{ position: 'absolute', left: 0, bottom: height * 0.12 }, style]}>
        <Character size={height * 0.42} mood="happy" candle="out" />
      </Animated.View>
    </>
  );
}

export default function TheBeachScene({ onDone }) {
  return (
    <VideoScene
      src={SRC}
      lines={LINES}
      placeholder={{ Art: ArrivingArt, label: 'arriving at the beach', seconds: 6 }}
      onDone={onDone}
    />
  );
}
