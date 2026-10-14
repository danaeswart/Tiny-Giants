/**
 * The parent coach: an AI model suggests how a grown-up can play a game with their child.
 * The call goes to the coach Worker (worker/src/index.js), which holds the API key and the
 * coach's instructions. The app only sends the game, the child and the chat, plus the parent's
 * Firebase sign-in token so the Worker can tell it's a signed-in parent.
 */
import { auth } from './firebase.js';

const COACH_URL = process.env.EXPO_PUBLIC_COACH_URL;

class CoachError extends Error {}

/**
 * Ask the coach for its next reply.
 * `messages` is the chat so far as [{ role: 'user' | 'assistant', content }]. Pass [] to get the
 * opening recommendation for the game. Returns the reply text; throws an Error with a message to show.
 */
export async function askCoach({ game, child, plays, messages }) {
  if (!COACH_URL) throw new CoachError('The coach is not set up yet.');
  try {
    const token = await auth.currentUser?.getIdToken();
    const response = await fetch(COACH_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({
        game: {
          title: game.title,
          category: game.category,
          teaches: game.teaches,
          parentNote: game.parentNote,
          tools: game.tools,
          coachNotes: game.coachNotes,
        },
        child: child ? { name: child.name, age: child.age } : {},
        plays: plays ? { count: plays.plays, completed: plays.completedCount } : null,
        messages,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.status === 401 || response.status === 429) throw new CoachError(data.error);
    if (!response.ok || !data.reply) throw new Error(`Worker answered ${response.status}: ${data.error ?? 'no reply'}`);
    return data.reply;
  } catch (error) {
    if (error instanceof CoachError) throw error;
    console.warn('Coach request failed:', error.message, COACH_URL);
    const why = __DEV__ ? ` [${error.message}]` : '';
    throw new Error(`The coach could not answer right now. Check your connection and try again.${why}`);
  }
}
