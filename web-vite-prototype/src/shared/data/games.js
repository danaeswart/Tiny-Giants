// Full catalogue of every game in the app. Child screens never read this directly —
// they go through getEnabledGamesForChild() in shared/services/api.js.
//
// coverImage is a filename inside public/covers/. Until real art exists, CoverImage
// falls back to a generated placeholder.
export const games = [
  {
    id: 'big-wave',
    title: 'The Big Wave',
    coverImage: 'placeholder-big-wave.png',
    teaches: 'Coping with stress and big feelings',
    parentNote:
      'This story gently teaches a breathing technique for when feelings feel like too much. Your child guides a character through a calming breathing exercise during a stressful moment in the story.',
  },
  {
    id: 'kind-detective',
    title: 'The Kind Detective',
    coverImage: 'placeholder-kind-detective.png',
    teaches: "Noticing and responding to other people's feelings",
    parentNote:
      "Your child plays a 'detective' who reads a friend's body language and facial expressions, then chooses a kind way to respond.",
  },
];
