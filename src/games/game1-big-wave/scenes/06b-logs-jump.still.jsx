// SCENE 06b · SPOKEN STILL · Logs to jump over
// Further along the path, Cami spots more logs and decides to jump them. The words sit
// at the top of the screen. Moves on by itself when she's done; nothing to tap.

import SpokenStillScene from '../../engine/SpokenStillScene.jsx';

const BACKGROUND = require('../../../../assets/book/games/game1/logs-jump.png');

const LINES = [{ text: 'Let’s jump over these logs.' }];

export default function LogsJumpScene({ onDone }) {
  return <SpokenStillScene background={BACKGROUND} lines={LINES} captionPosition="top" onDone={onDone} />;
}
