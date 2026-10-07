// SCENE 13 · STORY · The candle on the castle
// She puts her lit candle on top of the castle, tying the candle to the thing she built.
// Animated: the candle drops gently onto the top tower.

import { useEffect } from 'react';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import StoryScene from '../../engine/StoryScene.jsx';
import { useStage } from '../../engine/Stage.js';
import { BeachBackdrop } from '../art/Backdrops.jsx';
import Candle from '../art/Candle.jsx';
import Castle from '../art/Castle.jsx';
import Character from '../art/Character.jsx';
import Place from '../art/Place.jsx';

const LINES = [
  { text: "It's perfect!" },
  { text: "I'll light my candle and put it right on top, so it can see the sea." },
];

function Art() {
  const { height } = useStage();
  const castleSize = height * 0.55;
  const drop = useSharedValue(-height * 0.3);

  useEffect(() => {
    drop.set(withDelay(1500, withTiming(0, { duration: 900, easing: Easing.out(Easing.back(1.2)) })));
  }, [drop]);

  const candleStyle = useAnimatedStyle(() => ({ transform: [{ translateY: drop.get() }] }));

  return (
    <>
      <BeachBackdrop />
      <Place x={0.22} bottom={0.12}>
        <Character size={height * 0.4} mood="happy" candle={null} />
      </Place>
      <Place x={0.6} bottom={0.1}>
        <Castle size={castleSize} />
      </Place>
      {/* sits on the top tower */}
      <Place x={0.6} bottom={0.1 + 0.55 * 0.8 * 0.74}>
        <Animated.View style={candleStyle}>
          <Candle size={height * 0.14} />
        </Animated.View>
      </Place>
    </>
  );
}

export default function CandleOnCastleScene({ onDone }) {
  return <StoryScene Art={Art} audio={null} lines={LINES} onDone={onDone} />;
}
