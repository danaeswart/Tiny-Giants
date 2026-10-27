// SCENE 12d · VIDEO · The big wave
// The clip plays once, then the story moves on.

import SpokenVideoScene from '../../engine/SpokenVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/big-wave.mp4');

export default function BigWaveScene({ onDone }) {
  return <SpokenVideoScene src={SRC} onDone={onDone} />;
}
