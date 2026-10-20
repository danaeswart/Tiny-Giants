// SCENE 01f · SPOKEN VIDEO · Cami and the pile of wood
// The clip of the logs being removed one by one plays once while Cami says how big the job
// looks and decides to use her candle. Moves on by itself when it's done; nothing to tap.

import SpokenVideoScene from '../../engine/SpokenVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/remove-logs-one-by-one.mov');

const LINES = [
  { text: 'There are a lot of logs. It seems like a big task.' },
  { text: 'Let’s blow out my magic candle.' },
];

export default function TextPileOfWoodScene({ onDone }) {
  return <SpokenVideoScene src={SRC} lines={LINES} onDone={onDone} />;
}
