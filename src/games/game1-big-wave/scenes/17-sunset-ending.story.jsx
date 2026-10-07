// SCENE 17 · STORY · Sunset ending
// Calm closing scene on the beach. The Next arrow here finishes the game and
// goes back to the storybook.
// (Could also be a video: copy the pattern from 14-the-wave.video.jsx.)

import { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import StoryScene from '../../engine/StoryScene.jsx';
import { useStage } from '../../engine/Stage.js';
import { SunsetBackdrop } from '../art/Backdrops.jsx';
import Character from '../art/Character.jsx';
import Place from '../art/Place.jsx';

const LINES = [
  { text: 'What a beautiful day.' },
  { text: 'When a big wave of feelings comes, remember:' },
  { text: 'Take a big breath in… and blow it out slowly.' },
  { text: 'The End.' },
];

function Art() {
  const { height } = useStage();
  const glow = useSharedValue(0);

  // the whole scene slowly warms up, like the sun setting
  useEffect(() => {
    glow.set(withTiming(1, { duration: 8000, easing: Easing.out(Easing.quad) }));
  }, [glow]);

  const fadeIn = useAnimatedStyle(() => ({ opacity: 0.6 + glow.get() * 0.4 }));

  return (
    <Animated.View style={[{ flex: 1 }, fadeIn]}>
      <SunsetBackdrop />
      <Place x={0.3} bottom={0.14}>
        <Character size={height * 0.4} mood="calm" candle={null} />
      </Place>
    </Animated.View>
  );
}

export default function SunsetEndingScene({ onDone }) {
  return <StoryScene Art={Art} audio={null} lines={LINES} onDone={onDone} nextLabel="Finish the story" />;
}
