// SCENE 00 · STORY · Intro in the woods
// She introduces herself and her candle, and says she wants to get to the beach to
// build a sandcastle. Sets up why the child should care about getting her there.
//
// To use real art:  background={require('../assets/images/00-intro.png')}  (and remove Art)
// To add the voice: audio={require('../assets/audio/00-intro.m4a')}  and give each line its `at` second

import StoryScene from '../../engine/StoryScene.jsx';
import { useStage } from '../../engine/Stage.js';
import { ForestBackdrop } from '../art/Backdrops.jsx';
import Character from '../art/Character.jsx';
import Place from '../art/Place.jsx';

const LINES = [
  { text: "Hi! I'm so happy you're here." },
  { text: "I'm walking through the woods with my little candle." },
  { text: 'When I feel scared or worried, I blow out my candle. It helps me feel calm.' },
  { text: "Today I'm going to the beach to build a big sandcastle!" },
  { text: 'Will you help me get there?' },
];

function Art() {
  const { height } = useStage();
  return (
    <>
      <ForestBackdrop />
      <Place x={0.3} bottom={0.16}>
        <Character size={height * 0.45} mood="happy" candle="lit" />
      </Place>
    </>
  );
}

export default function IntroScene({ onDone }) {
  return <StoryScene Art={Art} audio={null} lines={LINES} onDone={onDone} />;
}
