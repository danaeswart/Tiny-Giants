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
    coverImage: 'kind-detective-small-thumb',
    image: 'kind-detective-large-thumb',
    pages: { left: 'kind-detective-left', right: 'kind-detective-right' },
    blurb: "Read faces and body language, then choose a kind way to respond.",
    tools: ['Reading body language', 'Naming feelings', 'Kind responses'],
    words: ['Storytelling', 'Detective', 'Kindness', 'Feelings'],
    teaches: "Noticing and responding to other people's feelings",
    coachNotes:
      "Practise reading feelings away from the game: at the park or on a screen, point at a face and ask \"what clues do you see?\" (eyes, mouth, shoulders). Use feeling words like worried, left out, proud and cross, not just happy or sad. After naming the feeling, ask \"what would help?\" and let your child choose a kind action, such as sharing, asking \"do you want to play?\" or sitting beside them. If your child guesses wrong, say \"good looking, maybe they feel a bit different\" instead of correcting. Keep it playful: 2 or 3 faces at a time.",
    parentNote:
      "Your child plays a 'detective' who reads a friend's body language and facial expressions, then chooses a kind way to respond.",
  },
  {
    id: 'memory-garden',
    title: 'The Memory Garden',
    category: 'Grief',
    comingSoon: true,
    coverImage: 'memory-garden-small-thumb',
    image: 'memory-garden-large-thumb',
    pages: { left: 'memory-garden-left', right: 'memory-garden-right' },
    blurb: 'Plant a garden to remember someone special.',
    tools: ['Remembering together', 'Naming sadness', 'Gentle goodbyes'],
    words: ['Storytelling', 'Garden', 'Remembering', 'Gentle'],
    teaches: 'Understanding sadness and remembering people we miss',
    coachNotes:
      "Go gently and follow your child's lead. Say plainly that missing someone is okay and that sad and happy feelings can sit together. Invite one memory at a time (\"what did you love doing with them?\") and accept silence. Real plants help: plant a seed or draw a garden together and name each flower after a memory. Avoid euphemisms like \"gone to sleep\"; use simple honest words. If your child is very upset or the loss is recent, keep sessions short and suggest speaking to a GP, school counsellor or child psychologist.",
    parentNote:
      'A gentle story about missing someone. Your child tends a garden and finds that sad feelings and happy memories can sit side by side.',
  },
  {
    id: 'two-homes',
    title: 'Two Homes',
    category: 'Family Change',
    comingSoon: true,
    coverImage: 'two-homes-small-thumb',
    image: 'two-homes-large-thumb',
    pages: { left: 'two-homes-left', right: 'two-homes-right' },
    blurb: 'A story about moving between two places that are both home.',
    tools: ['Feeling words', 'Routine anchors', 'Asking for help'],
    words: ['Storytelling', 'Home', 'Feelings', 'Routines'],
    teaches: 'Coping with changes in the family',
    coachNotes:
      "Children like predictable routines, so make a small \"going between homes\" ritual: a favourite toy or blanket that travels with them, a goodbye phrase, and a picture of each home. Name feelings out loud (\"it can feel strange to switch homes\") and tell your child it is not their fault. Practise asking for what they need with short sentences (\"I miss my dinosaur\", \"can we call Dad?\"). Never ask a child to choose between parents. Keep talk about the other home positive or neutral.",
    parentNote:
      'Your child follows a character who spends time in two homes, and learns ways to feel settled and to ask for what they need.',
  },
];
