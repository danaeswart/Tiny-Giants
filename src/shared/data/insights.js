import { daysAgo } from '../utils/dates.js';

// Mock AI insights: one per completed session worth noting. Written by hand for now;
// the real ones will be generated from gameplay by the backend.
//
// Each insight's date matches a session in sessions.js, which is how the detail page
// finds the session's stats. `gameTitle` is added by api.js from the games catalogue.

const DISCLAIMER =
  "This is a pattern observation generated from gameplay, not a clinical assessment. If you're concerned about your child's wellbeing, please consult a professional.";

export const insights = [
  {
    id: 'insight-001',
    childId: 'child-1',
    gameId: 'big-wave',
    date: daysAgo(0),
    summary: "Noah blew out Cami's candle three times tonight, before the log pile, after the fall, and at the wave.",
    observed:
      "He's starting to reach for the breathing tool before things go wrong, not just after a meltdown starts.",
    aiDisclaimer: DISCLAIMER,
    activitySuggestion: {
      title: "Ask what Cami's feeling",
      description:
        "Play Cami's Candle again. At each candle moment, pause and ask Noah what he thinks Cami is feeling. Putting words to it for her might help him start finding his own.",
    },
  },
  {
    id: 'insight-002',
    childId: 'child-1',
    gameId: 'kind-detective',
    date: daysAgo(1),
    summary: "Noah played detective and read three friends' faces before choosing how to help.",
    observed:
      'He used more specific feeling words than last week, "worried" and "left out" rather than just "sad".',
    aiDisclaimer: DISCLAIMER,
    activitySuggestion: {
      title: 'Feelings charades',
      description:
        'At dinner, take turns acting out a feeling without words and guess it together. Then ask: what would a kind response look like?',
    },
  },
  {
    id: 'insight-003',
    childId: 'child-1',
    gameId: 'kind-detective',
    date: daysAgo(3),
    summary: 'Noah paused for longer than usual before choosing how to respond to a sad friend.',
    observed:
      "Taking a moment to think before responding is a useful habit, even when the answer isn't obvious yet.",
    aiDisclaimer: DISCLAIMER,
    activitySuggestion: {
      title: 'Pause and wonder',
      description:
        'Next time you see someone upset together (a character in a show works well), pause and ask: "What do you think they need right now?"',
    },
  },
  {
    id: 'insight-004',
    childId: 'child-1',
    gameId: 'big-wave',
    date: daysAgo(4),
    summary: 'Noah finished the whole story and cleared the log pile one log at a time without skipping ahead.',
    observed:
      'He seems comfortable breaking a big task into small pieces, which is the idea behind "baby steps".',
    aiDisclaimer: DISCLAIMER,
    activitySuggestion: {
      title: 'Try a baby-step moment',
      description:
        'Next time something feels too big (tidying his room, a tricky puzzle), ask Noah for just the first tiny step, and cheer when he does it.',
    },
  },
  {
    id: 'insight-005',
    childId: 'child-2',
    gameId: 'big-wave',
    date: daysAgo(1),
    summary: "Maya watched the candle flicker out and copied Cami's slow breath.",
    observed: 'Copying a calm character is a natural way for younger children to practise slow breathing.',
    aiDisclaimer: DISCLAIMER,
    activitySuggestion: {
      title: 'Candle breaths',
      description:
        'Hold up one finger like a candle and take turns blowing it out slowly. See who can make their breath last the longest.',
    },
  },
];
