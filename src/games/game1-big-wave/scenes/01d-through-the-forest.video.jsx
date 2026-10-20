// SCENE 01d · SPOKEN VIDEO · Through the forest
// Cami heads into the woods. The clip plays once with her words over it, then the story moves on.

import SpokenVideoScene from '../../engine/SpokenVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/walking-though-forrest.mov');

const LINES = [{ text: 'Now let’s get through this forest.' }];

export default function ThroughTheForestScene({ onDone }) {
  return <SpokenVideoScene src={SRC} lines={LINES} onDone={onDone} />;
}
