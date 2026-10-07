// SCENE 16 · STORY · "I never needed the candle"
// The reveal: the calm was hers all along. Names the self-efficacy arc for the child.

import StoryScene from '../../engine/StoryScene.jsx';
import { useStage } from '../../engine/Stage.js';
import { BeachBackdrop } from '../art/Backdrops.jsx';
import Castle from '../art/Castle.jsx';
import Character from '../art/Character.jsx';
import Place from '../art/Place.jsx';

const LINES = [
  { text: 'Do you know what?' },
  { text: 'I never needed the candle.' },
  { text: 'The calm was inside me all along, in my own slow breaths.' },
  { text: "And it's inside you too." },
];

function Art() {
  const { height } = useStage();
  return (
    <>
      <BeachBackdrop />
      <Place x={0.75} bottom={0.1}>
        <Castle size={height * 0.45} step={2} />
      </Place>
      <Place x={0.38} bottom={0.14}>
        <Character size={height * 0.48} mood="happy" candle={null} />
      </Place>
    </>
  );
}

export default function NeverNeededCandleScene({ onDone }) {
  return <StoryScene Art={Art} audio={null} lines={LINES} onDone={onDone} />;
}
