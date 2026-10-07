// SCENE 10 · GAME · Blow out the candle, again
// Same game as scene 03, now after a fall instead of an obstacle (repeating the
// skill in a new situation). She gets back up and says her candle calms her down.
// All the logic lives in components/BlowCandleGame.jsx.

import { ForestBackdrop } from '../art/Backdrops.jsx';
import BlowCandleGame from '../components/BlowCandleGame.jsx';

const INTRO = {
  audio: null, // require('../assets/audio/10-blow-intro.m4a')
  lines: [
    { text: "I'll light my candle again." },
    { text: 'Will you help me? Big breath in… and blow!' },
  ],
};

const OUTRO = {
  audio: null, // require('../assets/audio/10-blow-outro.m4a')
  lines: [
    { text: 'There. I feel calm again.' },
    { text: 'I can get back up!' },
    { text: 'My candle always helps me calm down.' },
  ],
};

export default function BlowCandleAgainScene({ onDone }) {
  return <BlowCandleGame Backdrop={ForestBackdrop} intro={INTRO} outro={OUTRO} onDone={onDone} />;
}
