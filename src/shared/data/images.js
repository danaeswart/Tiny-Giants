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
};

/** Image source for a key from this registry, or a URL (backend art later). null if unknown. */
export function resolveImage(key) {
  if (!key) return null;
  if (/^https?:\/\//.test(key)) return { uri: key };
  return images[key] ?? null;
}
