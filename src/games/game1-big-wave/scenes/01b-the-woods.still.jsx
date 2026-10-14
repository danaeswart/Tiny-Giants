// SCENE 01b · SPOKEN STILL · The edge of the woods
// A still picture while Cami says how she feels at the edge of the woods.
// Moves on by itself when she's done; nothing to tap.

import SpokenStillScene from '../../engine/SpokenStillScene.jsx';

const BACKGROUND = require('../assets/images/01b-the-woods.png');

const LINES = [
  { text: 'Here we are. The woods.' },
  { text: "I don't know what's in there." },
  { text: 'My tummy feels a bit funny. My feet don’t really want to walk in.' },
];

export default function TheWoodsScene({ onDone }) {
  return <SpokenStillScene background={BACKGROUND} lines={LINES} captionPosition="top-right" onDone={onDone} />;
}
