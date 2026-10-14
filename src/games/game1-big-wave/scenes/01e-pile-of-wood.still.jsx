// SCENE 01e · ZOOM STILL · The pile of wood
// Out of the trees: a still picture of the log pile that slowly zooms in for 3 seconds while
// Cami says "Oh no, a pile of logs." Then the story moves on by itself.

import ZoomStillScene from '../../engine/ZoomStillScene.jsx';

const BACKGROUND = require('../../../../assets/book/games/game1/pile-of-wood.png');

const LINES = [{ text: 'Oh no, a pile of logs.' }];

export default function PileOfWoodScene({ onDone }) {
  return <ZoomStillScene background={BACKGROUND} seconds={3} lines={LINES} onDone={onDone} />;
}
