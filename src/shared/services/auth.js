import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { collection, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { auth, db } from './firebase.js';

export const MIN_PASSWORD_LENGTH = 8;

const MESSAGES = {
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/missing-password': 'Enter your password.',
  'auth/email-already-in-use': 'There is already an account with that email. Try signing in.',
  'auth/weak-password': `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
  'auth/network-request-failed': 'No connection. Check your internet and try again.',
  'auth/too-many-requests': 'Too many attempts. Wait a few minutes and try again.',
  'auth/requires-recent-login': 'Please sign in again to do that.',
  // Firebase deliberately doesn't say whether the email or the password was wrong.
  'auth/invalid-credential': 'That email or password is not right.',
  'auth/wrong-password': 'That password is not right.',
  'auth/user-not-found': 'That email or password is not right.',
};

/** Run a Firebase call and turn its error into a message that is safe to show a parent. */
async function friendly(run) {
  try {
    return await run();
  } catch (e) {
    throw new Error(MESSAGES[e?.code] ?? 'Something went wrong. Please try again.');
  }
}

/** Create a parent account and its profile record, and sign in. */
export function signUp({ name, email, password }) {
  return friendly(async () => {
    const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await updateProfile(user, { displayName: name.trim() });
    // merge, so this can never wipe a PIN the parent has already made on the next screen
    await setDoc(doc(db, 'parents', user.uid), { name: name.trim(), email: user.email }, { merge: true });
  });
}

export function signIn({ email, password }) {
  return friendly(() => signInWithEmailAndPassword(auth, email.trim(), password));
}

export function signOut() {
  return firebaseSignOut(auth);
}

/** Emails a reset link. Always looks successful so it can't be used to find out who has an account. */
export async function sendPasswordReset(email) {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (e) {
    if (e?.code === 'auth/invalid-email' || e?.code === 'auth/network-request-failed') {
      throw new Error(MESSAGES[e.code]);
    }
  }
}

// Changing sign-in details is sensitive, so the parent proves who they are first.
async function confirmPassword(currentPassword) {
  const user = auth.currentUser;
  await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword));
  return user;
}

/** Sends a confirmation link to the new address; the email only changes once it is clicked. */
export function changeEmail({ email, currentPassword }) {
  return friendly(async () => verifyBeforeUpdateEmail(await confirmPassword(currentPassword), email.trim()));
}

export function changePassword({ currentPassword, newPassword }) {
  return friendly(async () => updatePassword(await confirmPassword(currentPassword), newPassword));
}

/** Change the name shown for the parent, here and on their record. */
export function changeName(name) {
  return friendly(async () => {
    const user = auth.currentUser;
    await updateProfile(user, { displayName: name.trim() });
    await setDoc(doc(db, 'parents', user.uid), { name: name.trim() }, { merge: true });
  });
}

// Firestore batches hold 500 writes at most.
async function deleteAll(refs) {
  for (let i = 0; i < refs.length; i += 400) {
    const batch = writeBatch(db);
    refs.slice(i, i + 400).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
}

/**
 * Permanently delete the parent's account: every play session, every child, the parent's own
 * record (name, email, PIN hash), and finally the sign-in itself. This cannot be undone.
 * The password is checked first, so nothing is deleted if it is wrong. Data goes before the
 * sign-in because firestore.rules only lets a signed-in parent delete their own data.
 */
export function deleteAccount({ currentPassword }) {
  return friendly(async () => {
    const user = await confirmPassword(currentPassword);
    const parent = doc(db, 'parents', user.uid);
    const children = await getDocs(collection(parent, 'children'));
    for (const child of children.docs) {
      await deleteAll((await getDocs(collection(child.ref, 'sessions'))).docs.map((d) => d.ref));
    }
    await deleteAll([...children.docs.map((d) => d.ref), parent]);
    await deleteUser(user);
  });
}
