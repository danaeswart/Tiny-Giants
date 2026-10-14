// SCENE 00 · LOOPING VIDEO · Intro in the woods
// Cami introduces herself and her candle, and says she wants to get to the beach to
// build a sandcastle. The clip repeats while a voice reads the lines; Next shows after.
//
// Cami speaks with the phone's built-in voice for now; swap in a real recording later.

import LoopingVideoScene from '../../engine/LoopingVideoScene.jsx';

const SRC = require('../assets/video/00-intro.mp4');

const LINES = [
  { text: "Hi, I'm Cami!" },
  { text: 'And this is my candle. She’s a little bit magic.' },
  { text: 'When I have a big feeling, my candle helps me feel calm again.' },
  { text: "Today, I'm going on a journey, through the woods, all the way to the beach, to build a sandcastle!" },
  { text: 'Want to come with me?' },
];

export default function IntroScene({ onDone }) {
  return <LoopingVideoScene src={SRC} lines={LINES} captionPosition="top-right" onDone={onDone} />;
}
