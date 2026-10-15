// Full catalogue of every game in the app. Child screens never read this directly —
// they go through getEnabledGamesForChild() in shared/services/api.js.
//
// Each game is one two-page spread in the storybook:
//   pages.left / pages.right  art for each page (keys from data/images.js). While a page
//                             has no art, the left page shows the title and the right is plain.
//   coverImage                small thumbnail for the grid, search and parent screens.
//                             Falls back to image, then pages.left, then a generated placeholder.
//
// Shown on the grown-up Games pages:
//   category   the theme, used for the filter pills ("Stress", "Grief", ...)
//   image      larger art for cards and the game's detail page (key from data/images.js, or null)
//   blurb      one line on what the game is about
//   tools      the short skills the child practises
//   words      a few short descriptive words shown to the child before they play
//   comingSoon not playable yet: listed, but a parent can't switch it on
export const games = [
  {
    id: 'big-wave',
    title: 'The Big Wave',
    category: 'Stress',
    coverImage: 'big-wave-small-thumb',
    image: 'big-wave-large-thumb',
    // Short clip for the left side of the intro screen, e.g. require('../../../assets/book/games/game1/intro-clip.mp4')
    introVideo: null,
    pages: { left: 'big-wave-left', right: 'big-wave-right' },
    blurb: 'Help a little hero stay calm when big feelings roll in.',
    tools: ['Paced breathing', 'Small-steps thinking', 'Calming candle'],
    words: ['Storytelling', 'Ocean', 'Adventure', 'Breathing'],
    teaches: 'Coping with stress and big feelings',
    // Extra material for the parent coach (see worker/src/index.js). Add what you want it to know.
    coachNotes:
      'Practise the paced breathing away from the game too: breathe in for 4, out for 6, like blowing out a candle. Try it at calm times first so it is familiar when feelings are big. Name the feeling out loud ("that wave feels big") before fixing it.',
    parentNote:
      'This story gently teaches a breathing technique for when feelings feel like too much. Your child guides a character through a calming breathing exercise during a stressful moment in the story.',
  },
  {
    id: 'kind-detective',
    title: 'The Kind Detective',
    category: 'Social Awareness',
    coverImage: null,
    image: null,
    pages: { left: null, right: null },
    blurb: "Read faces and body language, then choose a kind way to respond.",
    tools: ['Reading body language', 'Naming feelings', 'Kind responses'],
    words: ['Storytelling', 'Detective', 'Kindness', 'Feelings'],
    teaches: "Noticing and responding to other people's feelings",
    parentNote:
      "Your child plays a 'detective' who reads a friend's body language and facial expressions, then chooses a kind way to respond.",
  },
  {
    id: 'memory-garden',
    title: 'The Memory Garden',
    category: 'Grief',
    comingSoon: true,
    coverImage: null,
    image: null,
    pages: { left: null, right: null },
    blurb: 'Plant a garden to remember someone special.',
    tools: ['Remembering together', 'Naming sadness', 'Gentle goodbyes'],
    words: ['Storytelling', 'Garden', 'Remembering', 'Gentle'],
    teaches: 'Understanding sadness and remembering people we miss',
    parentNote:
      'A gentle story about missing someone. Your child tends a garden and finds that sad feelings and happy memories can sit side by side.',
  },
  {
    id: 'two-homes',
    title: 'Two Homes',
    category: 'Family Change',
    comingSoon: true,
    coverImage: null,
    image: null,
    pages: { left: null, right: null },
    blurb: 'A story about moving between two places that are both home.',
    tools: ['Feeling words', 'Routine anchors', 'Asking for help'],
    words: ['Storytelling', 'Home', 'Feelings', 'Routines'],
    teaches: 'Coping with changes in the family',
    parentNote:
      'Your child follows a character who spends time in two homes, and learns ways to feel settled and to ask for what they need.',
  },
];
