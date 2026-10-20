// React Native can only bundle images through static require() calls, so every
// bundled PNG is registered here under a short key. Data files (games.js, book.js)
// refer to images by these keys.
//
// To add art:
//   1. Put the PNG in assets/book/
//   2. Add a line below, e.g.
//        'big-wave-left.png': require('../../../assets/book/big-wave-left.png'),
//   3. Use the key in games.js (pages.left / pages.right) or book.js (frontCover).
const images = {
  'big-wave-large-thumb': require('../../../assets/book/games/game1/large-thumb.png'),
  'big-wave-small-thumb': require('../../../assets/book/games/game1/small-thumb.png'),
  'book-cover': require('../../../assets/book/games/game1/book-cover.png'),
  'big-wave-left': require('../../../assets/book/games/game1/book-cover1.png'),
  'big-wave-right': require('../../../assets/book/games/game1/book-cover2.png'),

  // Games 2-4: each folder holds the same four files, currently coloured placeholders.
  // Drop your art over them with the SAME file names and nothing else needs changing.
  //   small-thumb.png  portrait ~3:4  (e.g. 852 x 1144)  grid, search, parent lists
  //   large-thumb.png  landscape 4:3  (e.g. 2160 x 1620) parent cards + game detail page
  //   page-left.png    square 1:1     (e.g. 1457 x 1457) left storybook page
  //   page-right.png   square 1:1     (e.g. 1457 x 1457) right storybook page
  'kind-detective-small-thumb': require('../../../assets/book/games/game2-kind-detective/small-thumb.png'),
  'kind-detective-large-thumb': require('../../../assets/book/games/game2-kind-detective/large-thumb.png'),
  'kind-detective-left': require('../../../assets/book/games/game2-kind-detective/page-left.png'),
  'kind-detective-right': require('../../../assets/book/games/game2-kind-detective/page-right.png'),

  'memory-garden-small-thumb': require('../../../assets/book/games/game3-memory-garden/small-thumb.png'),
  'memory-garden-large-thumb': require('../../../assets/book/games/game3-memory-garden/large-thumb.png'),
  'memory-garden-left': require('../../../assets/book/games/game3-memory-garden/page-left.png'),
  'memory-garden-right': require('../../../assets/book/games/game3-memory-garden/page-right.png'),

  'two-homes-small-thumb': require('../../../assets/book/games/game4-two-homes/small-thumb.png'),
  'two-homes-large-thumb': require('../../../assets/book/games/game4-two-homes/large-thumb.png'),
  'two-homes-left': require('../../../assets/book/games/game4-two-homes/page-left.png'),
  'two-homes-right': require('../../../assets/book/games/game4-two-homes/page-right.png'),
};

/** Image source for a key from this registry, or a URL (backend art later). null if unknown. */
export function resolveImage(key) {
  if (!key) return null;
  if (/^https?:\/\//.test(key)) return { uri: key };
  return images[key] ?? null;
}
