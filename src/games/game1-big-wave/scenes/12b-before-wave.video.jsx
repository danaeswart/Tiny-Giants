// SCENE 12b · VIDEO · Before the wave
// Right after the castle is built the clip plays once, then the story moves on.

import SpokenVideoScene from '../../engine/SpokenVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/before-wave.mp4');

export default function BeforeWaveScene({ onDone }) {
  return <SpokenVideoScene src={SRC} onDone={onDone} />;
}
