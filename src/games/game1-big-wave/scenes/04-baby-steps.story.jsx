// SCENE 04 · SPOKEN STILL · Baby steps
// Calm again, Cami looks at the logs and decides to move them one at a time.
// Moves on by itself when she's done; nothing to tap.

import SpokenStillScene from '../../engine/SpokenStillScene.jsx';

const BACKGROUND = require('../../../../assets/book/games/game1/text-pile-of-wood.png');

const LINES = [{ text: 'When a task seems very large, we need to take baby steps. Let’s remove the logs one by one.' }];

export default function BabyStepsScene({ onDone }) {
  return <SpokenStillScene background={BACKGROUND} lines={LINES} onDone={onDone} />;
}
