// SCENE 00 · LOOPING VIDEO · Intro in the woods
// The intro clip repeats (with its own sound) until the child taps the Play button, which pops up a few seconds in and moves on.

import LoopingVideoScene from '../../engine/LoopingVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/into.mp4');

export default function IntroScene({ onDone }) {
  return <LoopingVideoScene src={SRC} onDone={onDone} />;
}
