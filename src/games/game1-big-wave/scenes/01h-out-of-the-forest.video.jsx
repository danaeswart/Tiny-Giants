// SCENE 01h · SPOKEN VIDEO · Out of the forest
// Cami has made it through the trees. The clip plays once with her words over it,
// then the story moves on.

import SpokenVideoScene from '../../engine/SpokenVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/out-of-the-forrest.mp4');

const LINES = [{ text: 'Come on, the beach is this way.' }];

export default function OutOfTheForestScene({ onDone }) {
  return <SpokenVideoScene src={SRC} lines={LINES} onDone={onDone} />;
}
