// SCENE 12c · VIDEO · The wave is approaching
// The clip plays once, then the story moves on.

import SpokenVideoScene from '../../engine/SpokenVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/wave-approuching.mp4');

export default function WaveApproachingScene({ onDone }) {
  return <SpokenVideoScene src={SRC} onDone={onDone} />;
}
