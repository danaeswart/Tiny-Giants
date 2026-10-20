// GAME 1 · THE BIG WAVE (working title): the running order.
//
// The game plays these scenes top to bottom. To reorder, add, or remove a scene,
// change this list. Each scene lives in its own file in scenes/, named
//   <number>-<name>.<type>.jsx      type = story | video | game
//
//   story  picture + read-aloud text, Next arrow when the narration ends
//   still  a picture with spoken text, moves on by itself (type: 'story' in the list)
//   video  a clip (or a code-drawn placeholder until the clip exists), moves on by itself
//   game   something the child does: drag, tap, blow, breathe

import Intro from './scenes/00-intro.story.jsx';
import ForestPath from './scenes/01-forest-path.game.jsx';
import TheWoods from './scenes/01b-the-woods.still.jsx';
import CandleBlow from './scenes/01c-candle-blow.video.jsx';
import ThroughTheForest from './scenes/01d-through-the-forest.video.jsx';
import PileOfWood from './scenes/01e-pile-of-wood.still.jsx';
import TextPileOfWood from './scenes/01f-text-pile-of-wood.still.jsx';
import ClearLogs from './scenes/05-clear-logs.game.jsx';
import AfterWoodRemove from './scenes/05b-after-wood-remove.video.jsx';
import JumpLogs from './scenes/08-jump-logs.game.jsx';
import TrippingLog from './scenes/08b-tripping-log.video.jsx';
import TheBeach from './scenes/11-the-beach.video.jsx';
import BuildCastle from './scenes/12-build-castle.game.jsx';
import BigWave from './scenes/12d-big-wave.video.jsx';
import BreathingWithoutCandle from './scenes/12e-breathing-without-candle.video.jsx';
import Final from './scenes/12f-final.video.jsx';

export const bigWaveScenes = [
  { id: '00', type: 'story', title: 'Intro in the woods', Scene: Intro },
  { id: '01b', type: 'story', title: 'The edge of the woods (still)', Scene: TheWoods },
  { id: '01c', type: 'video', title: 'Breathe and blow out the candle (video)', Scene: CandleBlow },
  { id: '01d', type: 'video', title: 'Through the forest (video)', Scene: ThroughTheForest },
  { id: '01', type: 'game', title: 'Forest path (drag)', Scene: ForestPath },
  { id: '01e', type: 'video', title: 'The pile of wood (zoom still)', Scene: PileOfWood },
  { id: '01g', type: 'video', title: 'Breathe and blow out the candle, again (video)', Scene: CandleBlow },
  { id: '01f', type: 'story', title: 'Cami and the pile of wood (remove the logs video)', Scene: TextPileOfWood },
  { id: '05', type: 'game', title: 'Clear the path (drag)', Scene: ClearLogs },
  { id: '05b', type: 'video', title: 'After the logs are cleared (video)', Scene: AfterWoodRemove },
  { id: '08', type: 'game', title: 'Jump the 7 logs (tap)', Scene: JumpLogs },
  { id: '08b', type: 'video', title: 'Tripping over the log (video)', Scene: TrippingLog },
  { id: '08c', type: 'video', title: 'Breathe and blow out the candle after the fall (video)', Scene: CandleBlow },
  { id: '11', type: 'video', title: 'The beach', Scene: TheBeach },
  { id: '12', type: 'game', title: 'Build the sandcastle (tap)', Scene: BuildCastle },
  { id: '12d', type: 'video', title: 'The big wave (video)', Scene: BigWave },
  { id: '12e', type: 'video', title: 'Breathing without the candle (video)', Scene: BreathingWithoutCandle },
  { id: '12f', type: 'video', title: 'Final clip (video)', Scene: Final },
];
