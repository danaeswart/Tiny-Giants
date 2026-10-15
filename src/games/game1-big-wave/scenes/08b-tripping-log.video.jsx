// SCENE 08b · VIDEO · Tripping over the log
// Right after the last jump the clip plays once, then the story moves on.

import SpokenVideoScene from '../../engine/SpokenVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/tripping-log.mp4');

export default function TrippingLogScene({ onDone }) {
  return <SpokenVideoScene src={SRC} onDone={onDone} />;
}
