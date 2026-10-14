// SCENE 01c · BREATHING VIDEO · Cami blows out her candle
// Cami asks the child to breathe with her, then the clip plays. About 8 seconds in she
// starts to breathe, and a circle on the left grows as she breathes in and shrinks as
// she breathes out, so the child can follow the pace. Her words disappear once they've been read. She says she feels better over the last
// couple of seconds of the clip (it never pauses for it), then it moves on.

import BreathingVideoScene from '../../engine/BreathingVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/candle_blow_scene.mp4');

const LINES = [
  { text: 'Blow my candle out with me!' },
  { text: 'Take a deep breath when the circle gets big, and blow out all your air when the circle gets small.' },
];

const END_LINES = [{ text: 'Yay! I feel so much better.' }];

export default function CandleBlowScene({ onDone }) {
  return <BreathingVideoScene src={SRC} lines={LINES} endLines={END_LINES} breatheFrom={8} onDone={onDone} />;
}
