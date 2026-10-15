// SCENE 06 · SPOKEN STILL · Small steps make a difference
// The logs are gone. Cami says thank you and points the way to the beach.
// Moves on by itself when she's done; nothing to tap.

import SpokenStillScene from '../../engine/SpokenStillScene.jsx';

const BACKGROUND = require('../../../../assets/book/games/game1/logs-removed.png');

const LINES = [
  { text: 'Thank you! See? Small steps make a big difference.' },
  { text: 'Come on, the beach is this way.' },
];

export default function SmallStepsScene({ onDone }) {
  return <SpokenStillScene background={BACKGROUND} lines={LINES} onDone={onDone} />;
}
