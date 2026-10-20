// SCENE 01e · SPOKEN VIDEO · The pile of wood
// Out of the trees: the clip of the log pile plays once while Cami says "Oh no, a pile of logs."
// Then the story moves on by itself.

import SpokenVideoScene from '../../engine/SpokenVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/pile-of-wood.mov');

const LINES = [{ text: 'Oh no, a pile of logs.' }];

export default function PileOfWoodScene({ onDone }) {
  return <SpokenVideoScene src={SRC} lines={LINES} onDone={onDone} />;
}
