import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { games } from '../data/games.js';
import { auth, db } from './firebase.js';
import { hasParentPin, setParentPin } from './pin.js';

/**
 * A shared demo account for showing the app without making an account first.
 * These details are public on purpose: anyone can sign in with them. The first person to use it
 * creates it in Firebase; after that it is simply signed in to. Whatever is missing (the PIN, the
 * two children) is put back each time, so it always opens ready to play.
 */
export const DEMO_EMAIL = 'demo@tinygiants.app';
export const DEMO_PASSWORD = 'tinygiants-demo';
export const DEMO_PIN = '0000';

// The ids match the mock play history and insights in shared/data, so the dashboards are full.
const enabledGameIds = games.filter((g) => !g.comingSoon).map((g) => g.id);
const DEMO_CHILDREN = [
  { id: 'child-1', name: 'Noah', age: 6, avatar: 'avatar1', joinedDate: '2026-09-01', enabledGameIds },
  { id: 'child-2', name: 'Maya', age: 4, avatar: 'avatar2', joinedDate: '2026-09-15', enabledGameIds },
];

async function signInOrCreate() {
  try {
    return (await signInWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD)).user;
  } catch (e) {
    if (e?.code !== 'auth/invalid-credential' && e?.code !== 'auth/user-not-found') throw e;
  }
  const { user } = await createUserWithEmailAndPassword(auth, DEMO_EMAIL, DEMO_PASSWORD);
  await updateProfile(user, { displayName: 'Demo Parent' });
  return user;
}

// Signing in flips the app to the signed-in screens straight away, so those screens wait on this
// until the demo account has its PIN and children.
let filling = Promise.resolve();
export const waitForDemo = () => filling;

/** Sign in to the demo account (creating and filling it if needed). Throws a message to show. */
export function enterDemo() {
  const run = fill();
  filling = run.catch(() => {});
  return run;
}

async function fill() {
  try {
    const user = await signInOrCreate();
    const parent = doc(db, 'parents', user.uid);
    await setDoc(parent, { name: 'Demo Parent', email: user.email }, { merge: true });
    if (!(await hasParentPin())) await setParentPin(DEMO_PIN);
    const existing = await getDocs(collection(parent, 'children'));
    if (existing.empty) {
      for (const { id, ...child } of DEMO_CHILDREN) await setDoc(doc(parent, 'children', id), child);
    }
  } catch (e) {
    console.error('Demo sign-in failed:', e?.code, e?.message);
    const offline = e?.code === 'auth/network-request-failed';
    throw new Error(offline ? 'No connection. Check your internet and try again.' : 'Could not open the demo. Please try again.');
  }
}
