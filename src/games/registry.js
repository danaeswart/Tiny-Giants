// Which games are playable, by the game id used in src/shared/data/games.js.
// A game without an entry here shows the "game goes here" placeholder.

import { bigWaveScenes } from './game1-big-wave/scenes.js';

const playableGames = {
  'big-wave': bigWaveScenes,
};

/** The ordered scene list for a game, or null if it isn't built yet. */
export function getScenes(gameId) {
  return playableGames[gameId] ?? null;
}
