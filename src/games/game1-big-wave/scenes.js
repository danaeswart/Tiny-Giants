// GAME 1 · THE BIG WAVE (working title): the running order.
//
// The game plays these scenes top to bottom. To reorder, add, or remove a scene,
// change this list. Each scene lives in its own file in scenes/, named
//   <number>-<name>.<type>.jsx      type = story | video | game
//
//   story  picture + read-aloud text, Next arrow when the narration ends
//   video  a clip (or a code-drawn placeholder until the clip exists), moves on by itself
//   game   something the child does: drag, tap, blow, breathe

import Intro from './scenes/00-intro.story.jsx';
import ForestPath from './scenes/01-forest-path.game.jsx';
import LogPile from './scenes/02-log-pile.story.jsx';
import BlowCandle from './scenes/03-blow-candle.game.jsx';
import BabySteps from './scenes/04-baby-steps.story.jsx';
import ClearLogs from './scenes/05-clear-logs.game.jsx';
import SmallSteps from './scenes/06-small-steps.story.jsx';
import WalkingOn from './scenes/07-walking-on.video.jsx';
import JumpLogs from './scenes/08-jump-logs.game.jsx';
import TheFall from './scenes/09-the-fall.story.jsx';
import BlowCandleAgain from './scenes/10-blow-candle-again.game.jsx';
import TheBeach from './scenes/11-the-beach.video.jsx';
import BuildCastle from './scenes/12-build-castle.game.jsx';
import CandleOnCastle from './scenes/13-candle-on-castle.story.jsx';
import TheWave from './scenes/14-the-wave.video.jsx';
import BreatheTogether from './scenes/15-breathe-together.game.jsx';
import NeverNeededCandle from './scenes/16-never-needed-candle.story.jsx';
import SunsetEnding from './scenes/17-sunset-ending.story.jsx';

export const bigWaveScenes = [
  { id: '00', type: 'story', title: 'Intro in the woods', Scene: Intro },
  { id: '01', type: 'game', title: 'Forest path (drag)', Scene: ForestPath },
  { id: '02', type: 'story', title: 'The log pile', Scene: LogPile },
  { id: '03', type: 'game', title: 'Blow out the candle (mic)', Scene: BlowCandle },
  { id: '04', type: 'story', title: 'Baby steps', Scene: BabySteps },
  { id: '05', type: 'game', title: 'Clear the path (drag)', Scene: ClearLogs },
  { id: '06', type: 'story', title: 'Small steps make a difference', Scene: SmallSteps },
  { id: '07', type: 'video', title: 'Walking on', Scene: WalkingOn },
  { id: '08', type: 'game', title: 'Jump the logs (tap)', Scene: JumpLogs },
  { id: '09', type: 'story', title: 'The fall', Scene: TheFall },
  { id: '10', type: 'game', title: 'Blow out the candle, again (mic)', Scene: BlowCandleAgain },
  { id: '11', type: 'video', title: 'The beach', Scene: TheBeach },
  { id: '12', type: 'game', title: 'Build the sandcastle (tap)', Scene: BuildCastle },
  { id: '13', type: 'story', title: 'The candle on the castle', Scene: CandleOnCastle },
  { id: '14', type: 'video', title: 'The wave', Scene: TheWave },
  { id: '15', type: 'game', title: 'Breathing without the candle', Scene: BreatheTogether },
  { id: '16', type: 'story', title: 'I never needed the candle', Scene: NeverNeededCandle },
  { id: '17', type: 'story', title: 'Sunset ending', Scene: SunsetEnding },
];
