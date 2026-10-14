// The characters a grown-up can pick for their child. A child's profile stores only the short
// `id` ('avatar1', 'avatar2', ...) in Firestore; the picture is looked up here.
//
// To add a character:
//   1. Put the PNG in assets/book/avatars/
//   2. Add a line below with the next id.
export const AVATARS = [
  { id: 'avatar1', source: require('../../../assets/book/avatars/avatar1.png'), ratio: 559 / 1003 },
  { id: 'avatar2', source: require('../../../assets/book/avatars/avatar2.png'), ratio: 437 / 563 },
];

/** The character for a stored id, or null (no choice yet, or an id this version doesn't know). */
export function getAvatar(id) {
  return AVATARS.find((a) => a.id === id) ?? null;
}

export const isAvatarId = (id) => AVATARS.some((a) => a.id === id);
