// SCENE 01c · BREATHING VIDEO · Cami blows out her candle
// The clip plays with its own sound. About 8 seconds in she starts to breathe, and a circle on
// the left grows as she breathes in and shrinks as she breathes out, so the child can follow
// the pace. When the clip ends, the story moves on by itself.

import BreathingVideoScene from '../../engine/BreathingVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/candle-blow.mov');

export default function CandleBlowScene({ onDone }) {
  return <BreathingVideoScene src={SRC} breatheFrom={8} onDone={onDone} />;
}
