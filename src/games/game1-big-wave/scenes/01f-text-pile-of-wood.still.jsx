// SCENE 01f · SPOKEN STILL · Cami and the pile of wood
// A still picture while Cami says how big the job looks and decides to use her candle.
// Moves on by itself when she's done; nothing to tap.

import SpokenStillScene from '../../engine/SpokenStillScene.jsx';

const BACKGROUND = require('../../../../assets/book/games/game1/text-pile-of-wood.png');

const LINES = [
  { text: 'There are a lot of logs. It seems like a big task.' },
  { text: 'Let’s blow out my magic candle.' },
];

export default function TextPileOfWoodScene({ onDone }) {
  return <SpokenStillScene background={BACKGROUND} lines={LINES} onDone={onDone} />;
}
