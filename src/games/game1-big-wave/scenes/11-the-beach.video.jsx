// SCENE 11 · VIDEO · The beach
// She arrives at the beach. The clip plays once, then the story moves on.

import SpokenVideoScene from '../../engine/SpokenVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/beach-arive.mov');

export default function TheBeachScene({ onDone }) {
  return <SpokenVideoScene src={SRC} onDone={onDone} />;
}
