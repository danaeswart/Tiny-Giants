// SCENE 01b · SPOKEN VIDEO · Arriving at the edge of the woods
// The clip plays once while Cami says how she feels at the edge of the woods.
// Moves on by itself when it's done; nothing to tap.

import SpokenVideoScene from '../../engine/SpokenVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/forrest-arival.mp4');

const LINES = [
  { text: 'Here we are. The woods.' },
  { text: "I don't know what's in there." },
  { text: 'My tummy feels a bit funny. My feet don’t really want to walk in.' },
];

export default function TheWoodsScene({ onDone }) {
  return <SpokenVideoScene src={SRC} lines={LINES} captionPosition="top-right" onDone={onDone} />;
}
