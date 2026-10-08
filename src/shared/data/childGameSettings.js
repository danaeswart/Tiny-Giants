import { games } from './games.js';

// Stand-in until there are real accounts: the child whose device this is.
export const DEFAULT_CHILD_ID = 'child-1';

// Per-child game visibility, chosen by a parent. Defaults to every game enabled.
export const childGameSettings = [
  {
    childId: DEFAULT_CHILD_ID,
    enabledGameIds: games.filter((game) => !game.comingSoon).map((game) => game.id),
  },
];
