// SCENE 03 · GAME · Blow out the candle (first time)
// The child blows on the screen (microphone) to help her blow out her candle and
// calm down. No mic? She blows it out herself and the story carries on.
// All the logic lives in components/BlowCandleGame.jsx (shared with scene 10).

import { ForestBackdrop } from '../art/Backdrops.jsx';
import BlowCandleGame from '../components/BlowCandleGame.jsx';

const INTRO = {
  audio: null, // require('../assets/audio/03-blow-intro.m4a')
  lines: [
    { text: "When I feel like this, my candle helps me." },
    { text: 'Can you help me blow it out?' },
    { text: 'Take a big breath in… and blow on the screen!' },
  ],
};

const OUTRO = {
  audio: null, // require('../assets/audio/03-blow-outro.m4a')
  lines: [
    { text: 'Phew. That feels better.' },
    { text: "My tummy isn't wobbly anymore. Thank you!" },
  ],
};

export default function BlowCandleScene({ onDone }) {
  return <BlowCandleGame Backdrop={ForestBackdrop} intro={INTRO} outro={OUTRO} onDone={onDone} />;
}
