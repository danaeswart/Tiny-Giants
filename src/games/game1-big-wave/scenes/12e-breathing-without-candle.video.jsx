// SCENE 12e · BREATHING VIDEO · Breathing without the candle
// The clip plays with its own sound. Once Cami starts to breathe (`breatheFrom`, seconds into
// the clip) the same circle as the candle scene grows as she breathes in and shrinks as she
// breathes out, so the child can follow the pace. When the clip ends, the story moves on.

import BreathingVideoScene from '../../engine/BreathingVideoScene.jsx';

const SRC = require('../../../../assets/book/games/game1/breathing-without-candle.mp4');

export default function BreathingWithoutCandleScene({ onDone }) {
  return <BreathingVideoScene src={SRC} breatheFrom={3} onDone={onDone} />;
}
