// SCENE 12f · VIDEO · The final clip
// Plays once with its own sound, after the breathing without the candle, then the game ends. It sits a little higher on screen so more of the bottom of the clip shows (shiftUp).

import SpokenVideoScene from '../../engine/SpokenVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/final.mp4');

export default function FinalScene({ onDone }) {
  return <SpokenVideoScene src={SRC} shiftUp={0.12} onDone={onDone} />;
}
