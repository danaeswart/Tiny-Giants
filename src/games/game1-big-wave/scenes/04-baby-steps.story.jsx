// SCENE 04 · STORY · "Baby steps"
// Calm again, she looks at the logs and decides to move them slowly, one at a time.

import StoryScene from '../../engine/StoryScene.jsx';
import { useStage } from '../../engine/Stage.js';
import { ForestBackdrop } from '../art/Backdrops.jsx';
import Character from '../art/Character.jsx';
import { LogPile } from '../art/Logs.jsx';
import Place from '../art/Place.jsx';

const LINES = [
  { text: 'Those logs are too big to move all at once.' },
  { text: "So let's start small." },
  { text: "We'll take baby steps, and move them one at a time." },
];

function Art() {
  const { height } = useStage();
  return (
    <>
      <ForestBackdrop />
      <Place x={0.66} bottom={0.14}>
        <LogPile logHeight={height * 0.09} />
      </Place>
      <Place x={0.24} bottom={0.14}>
        <Character size={height * 0.42} mood="calm" candle="out" />
      </Place>
    </>
  );
}

export default function BabyStepsScene({ onDone }) {
  return <StoryScene Art={Art} audio={null} lines={LINES} onDone={onDone} />;
}
