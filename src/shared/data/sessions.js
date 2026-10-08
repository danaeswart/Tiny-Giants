import { daysAgo } from '../utils/dates.js';

// Mock play history, so the charts have something real to draw. Dates are relative to
// today (0 = today), so the "this week" charts always look populated.
//
//   { childId, gameId, date, durationMinutes, completed }
//   completed = the child reached the end of the story
const rows = [
  // Noah
  ['child-1', 0, 'big-wave', 14, true],
  ['child-1', 1, 'kind-detective', 9, true],
  ['child-1', 2, 'big-wave', 11, false],
  ['child-1', 3, 'kind-detective', 12, true],
  ['child-1', 4, 'big-wave', 16, true],
  ['child-1', 6, 'kind-detective', 8, false],
  ['child-1', 6, 'big-wave', 10, true],
  ['child-1', 7, 'big-wave', 13, true],
  ['child-1', 8, 'kind-detective', 10, true],
  ['child-1', 9, 'big-wave', 12, true],
  ['child-1', 10, 'kind-detective', 7, false],
  ['child-1', 11, 'big-wave', 15, true],
  ['child-1', 12, 'kind-detective', 11, true],
  ['child-1', 13, 'big-wave', 9, false],
  // Maya
  ['child-2', 1, 'big-wave', 8, true],
  ['child-2', 3, 'kind-detective', 6, false],
  ['child-2', 5, 'big-wave', 10, true],
  ['child-2', 9, 'big-wave', 7, true],
];

export const sessions = rows.map(([childId, ago, gameId, durationMinutes, completed]) => ({
  childId,
  gameId,
  date: daysAgo(ago),
  durationMinutes,
  completed,
}));
