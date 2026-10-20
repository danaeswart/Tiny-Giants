// SCENE 05b · VIDEO · After the logs are cleared
// The clip plays once with its own sound, then the story moves on.

import SpokenVideoScene from '../../engine/SpokenVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/after-wood-remove.mov');

export default function AfterWoodRemoveScene({ onDone }) {
  return <SpokenVideoScene src={SRC} onDone={onDone} />;
}
