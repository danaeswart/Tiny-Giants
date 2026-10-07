// SCENE 07 · VIDEO · Walking on
// A short transition beat: she carries on through the woods toward the beach.
//
// To use the real video: set SRC = require('../assets/video/07-walking-on.mp4')
// Until then, the placeholder below plays: she walks across the forest.

import { useEffect } from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useStage } from '../../engine/Stage.js';
import VideoScene from '../../engine/VideoScene.jsx';
import { ForestBackdrop } from '../art/Backdrops.jsx';
import Character from '../art/Character.jsx';

const SRC = null;
const LINES = [{ text: 'Come on, the beach is this way!', at: 0.5 }];

function WalkingArt() {
  const { width, height } = useStage();
  const size = height * 0.4;
  const walk = useSharedValue(0);
  const bob = useSharedValue(0);

  useEffect(() => {
    walk.set(withTiming(1, { duration: 5000, easing: Easing.linear }));
    bob.set(withRepeat(withTiming(1, { duration: 260 }), -1, true));
  }, [walk, bob]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: width * (0.05 + walk.get() * 0.75) }, { translateY: -bob.get() * 8 }],
  }));

  return (
    <>
      <ForestBackdrop />
      <Animated.View style={[{ position: 'absolute', left: 0, bottom: height * 0.14 }, style]}>
        <Character size={size} mood="happy" candle="out" />
      </Animated.View>
    </>
  );
}

export default function WalkingOnScene({ onDone }) {
  return (
    <VideoScene
      src={SRC}
      lines={LINES}
      placeholder={{ Art: WalkingArt, label: 'walking through the woods', seconds: 5 }}
      onDone={onDone}
    />
  );
}
