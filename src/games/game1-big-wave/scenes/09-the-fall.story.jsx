// SCENE 09 · STORY · The fall
// She tripped on the last log. An unplanned setback, not a puzzle this time.

import StoryScene from '../../engine/StoryScene.jsx';
import { useStage } from '../../engine/Stage.js';
import { ForestBackdrop } from '../art/Backdrops.jsx';
import Character from '../art/Character.jsx';
import { Log } from '../art/Logs.jsx';
import Place from '../art/Place.jsx';

const LINES = [
  { text: 'Ouch! I tripped on that last log.' },
  { text: 'My knee hurts, and I feel like crying.' },
];

function Art() {
  const { height } = useStage();
  return (
    <>
      <ForestBackdrop />
      <Place x={0.62} bottom={0.14}>
        <Log width={height * 0.22} height={height * 0.09} />
      </Place>
      {/* lying on the ground */}
      <Place x={0.4} bottom={0.08} style={{ transform: [{ translateX: '-50%' }, { rotate: '80deg' }] }}>
        <Character size={height * 0.4} mood="ouch" candle={null} />
      </Place>
    </>
  );
}

export default function TheFallScene({ onDone }) {
  return <StoryScene Art={Art} audio={null} lines={LINES} onDone={onDone} />;
}
