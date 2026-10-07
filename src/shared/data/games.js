// Full catalogue of every game in the app. Child screens never read this directly —
// they go through getEnabledGamesForChild() in shared/services/api.js.
//
// Each game is one two-page spread in the storybook:
//   pages.left / pages.right  art for each page (keys from data/images.js). While a page
//                             has no art, the left page shows the title and the right is plain.
//   coverImage                small thumbnail for the grid, search and parent screens.
//                             Falls back to pages.left, then to a generated placeholder.
export const games = [
  {
    id: 'big-wave',
    title: 'The Big Wave',
    coverImage: null,
    pages: { left: null, right: null },
    teaches: 'Coping with stress and big feelings',
    parentNote:
      'This story gently teaches a breathing technique for when feelings feel like too much. Your child guides a character through a calming breathing exercise during a stressful moment in the story.',
  },
  {
    id: 'kind-detective',
    title: 'The Kind Detective',
    coverImage: null,
    pages: { left: null, right: null },
    teaches: "Noticing and responding to other people's feelings",
    parentNote:
      "Your child plays a 'detective' who reads a friend's body language and facial expressions, then chooses a kind way to respond.",
  },
];
