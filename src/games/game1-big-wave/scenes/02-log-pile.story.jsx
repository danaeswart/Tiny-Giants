// SCENE 02 · STORY · The log pile (overwhelmed #1)
// She stops in front of a big pile of logs blocking the path and feels overwhelmed.
// Animated: she trembles a little while she's worried.

import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import StoryScene from '../../engine/StoryScene.jsx';
import { useStage } from '../../engine/Stage.js';
import { ForestBackdrop } from '../art/Backdrops.jsx';
import Character from '../art/Character.jsx';
import { LogPile } from '../art/Logs.jsx';
import Place from '../art/Place.jsx';

const LINES = [
  { text: 'Oh no! Look at all those logs.' },
  { text: "They're blocking the whole path." },
  { text: "There are so many. I don't know what to do." },
  { text: 'My tummy feels all wobbly and my heart is going fast.' },
];

function Art() {
  const { height } = useStage();
  const shake = useSharedValue(0);

  useEffect(() => {
    shake.set(withRepeat(
      withSequence(withTiming(1, { duration: 70 }), withTiming(-1, { duration: 70 }), withTiming(0, { duration: 70 })),
      -1,
    ));
  }, [shake]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: shake.get() * 2.5 }] }));

  return (
    <>
      <ForestBackdrop />
      <Place x={0.66} bottom={0.14}>
        <LogPile logHeight={height * 0.09} />
      </Place>
      <Place x={0.24} bottom={0.14}>
        <Animated.View style={style}>
          <Character size={height * 0.42} mood="worried" candle="lit" />
        </Animated.View>
      </Place>
    </>
  );
}

export default function LogPileScene({ onDone }) {
  return <StoryScene Art={Art} audio={null} lines={LINES} onDone={onDone} />;
}
