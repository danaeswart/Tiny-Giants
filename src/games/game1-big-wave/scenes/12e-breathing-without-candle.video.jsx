// SCENE 12e · VIDEO · Breathing without the candle
// The clip plays once, then the story moves on.

import SpokenVideoScene from '../../engine/SpokenVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/breathing-without-candle.mp4');

export default function BreathingWithoutCandleScene({ onDone }) {
  return <SpokenVideoScene src={SRC} onDone={onDone} />;
}
