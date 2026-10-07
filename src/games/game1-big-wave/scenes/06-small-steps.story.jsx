// SCENE 06 · STORY · "Small steps make a difference"
// Short, warm reinforcement after clearing the logs.

import StoryScene from '../../engine/StoryScene.jsx';
import { useStage } from '../../engine/Stage.js';
import { ForestBackdrop } from '../art/Backdrops.jsx';
import Character from '../art/Character.jsx';
import Place from '../art/Place.jsx';

const LINES = [
  { text: 'Thank you!' },
  { text: 'See? Small steps make a big difference.' },
];

function Art() {
  const { height } = useStage();
  return (
    <>
      <ForestBackdrop />
      <Place x={0.42} bottom={0.14}>
        <Character size={height * 0.45} mood="happy" candle="out" />
      </Place>
    </>
  );
}

export default function SmallStepsScene({ onDone }) {
  return <StoryScene Art={Art} audio={null} lines={LINES} onDone={onDone} />;
}
