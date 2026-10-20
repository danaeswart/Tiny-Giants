# Game art drop zones

Each game has a folder. Replace the coloured placeholder PNGs with your art, **keeping the
same file names**. No code changes are needed; they are already registered in
`src/shared/data/images.js`.

| File             | Shape            | Suggested size | Where it shows                                  |
|------------------|------------------|----------------|-------------------------------------------------|
| `small-thumb.png`| portrait ~3:4    | 852 x 1144     | child grid, search, parent lists (small icon)   |
| `large-thumb.png`| landscape 4:3    | 2160 x 1620    | parent game cards and the game detail page      |
| `page-left.png`  | square 1:1       | 1457 x 1457    | left page of the storybook spread               |
| `page-right.png` | square 1:1       | 1457 x 1457    | right page of the spread (Play button on top)   |

| Folder                  | Game               | Registry keys (images.js)          |
|-------------------------|--------------------|------------------------------------|
| `game1/`                | The Big Wave       | `big-wave-*` (own file names)      |
| `game2-kind-detective/` | The Kind Detective | `kind-detective-*`                 |
| `game3-memory-garden/`  | The Memory Garden  | `memory-garden-*`                  |
| `game4-two-homes/`      | Two Homes          | `two-homes-*`                      |

After replacing files, restart Metro with `npx expo start -c` so the new images are picked up.

## Mock text

All game text (blurb, tools, words, parent note) lives in `src/shared/data/games.js`.
`coachNotes` in the same file is the extra text sent to the AI parent coach for that game;
edit it to change what the coach knows. The coach's own instructions are in `worker/src/index.js`.
