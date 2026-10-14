import * as Crypto from 'expo-crypto';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase.js';

/**
 * The grown-up PIN: the 4 digits a parent types to get from the child side to the parent side.
 * It is stored as a salted hash on the parent's own record (never the digits themselves), and
 * firestore.rules keeps that record readable only by the parent.
 */
export const PIN_LENGTH = 4;

const MAX_WRONG_TRIES = 5;
const LOCK_MS = 30 * 1000;
let wrongTries = 0;
let lockedUntil = 0;

export const isValidPin = (pin) => new RegExp(`^\\d{${PIN_LENGTH}}$`).test(pin);

const parentRef = () => doc(db, 'parents', auth.currentUser.uid);

const hash = (pin, salt) => Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${pin}`);

async function newSalt() {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Save (or replace) the PIN. Throws an Error with a message to show. */
export async function setParentPin(pin) {
  if (!isValidPin(pin)) throw new Error(`Use exactly ${PIN_LENGTH} digits.`);
  const pinSalt = await newSalt();
  await setDoc(parentRef(), { pinSalt, pinHash: await hash(pin, pinSalt) }, { merge: true });
}

/** Whether this parent has made a PIN yet. */
export async function hasParentPin() {
  const snapshot = await getDoc(parentRef());
  return Boolean(snapshot.exists() && snapshot.data().pinHash);
}

/** True if the PIN is right. Too many wrong tries locks it for a short while; that throws a message to show. */
export async function verifyParentPin(pin) {
  const wait = Math.ceil((lockedUntil - Date.now()) / 1000);
  if (wait > 0) throw new Error(`Too many tries. Wait ${wait} seconds and try again.`);

  const snapshot = await getDoc(parentRef());
  const { pinSalt, pinHash } = snapshot.data() ?? {};
  if (!pinHash) throw new Error('No PIN has been set yet.');

  if ((await hash(pin, pinSalt)) === pinHash) {
    wrongTries = 0;
    return true;
  }
  wrongTries += 1;
  if (wrongTries >= MAX_WRONG_TRIES) {
    wrongTries = 0;
    lockedUntil = Date.now() + LOCK_MS;
  }
  return false;
}
