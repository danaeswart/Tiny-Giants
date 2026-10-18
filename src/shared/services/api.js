/**
 * The app's only data-access layer. Every screen reads and writes through these
 * functions, never the mock data files directly.
 *
 * Accounts, child profiles and game choices are stored in Firestore. Play sessions and
 * insights are still mock data from shared/data/* until they get a backend too.
 */
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { isAvatarId } from '../data/avatars.js';
import { games as catalogue } from '../data/games.js';
import { insights as insightData } from '../data/insights.js';
import { sessions as sessionData } from '../data/sessions.js';
import { daysAgo, weekdayShort } from '../utils/dates.js';
import { changeEmail, changeName, changePassword, MIN_PASSWORD_LENGTH } from './auth.js';
import { auth, db } from './firebase.js';

const copy = (value) => JSON.parse(JSON.stringify(value));

// parents/{uid} is the parent; parents/{uid}/children/{childId} is one child's profile plus
// the games the parent has switched on. firestore.rules lets a parent reach only their own branch.
function childrenRef() {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not signed in.');
  return collection(db, 'parents', uid, 'children');
}

function toChild(snapshot) {
  const { name, age, avatar = null, birthday = null, joinedDate } = snapshot.data();
  return { id: snapshot.id, name, age, avatar, birthday, joinedDate };
}

// A child with no saved choice has no games: a parent adds them from the Games tab.
async function settingsFor(childId) {
  const snapshot = await getDoc(doc(childrenRef(), childId));
  const saved = snapshot.exists() ? snapshot.data().enabledGameIds : null;
  return { childId, enabledGameIds: saved ?? [] };
}

/** The signed-in parent's child profiles: [{ id, name, age, avatar, birthday, joinedDate }]. */
export async function getProfiles() {
  const snapshot = await getDocs(query(childrenRef(), orderBy('joinedDate')));
  return snapshot.docs.map(toChild);
}

/** Choose which character (an id from data/avatars.js, e.g. 'avatar2') represents a child. */
export async function setChildAvatar(childId, avatar) {
  if (!isAvatarId(avatar)) throw new Error('Unknown character.');
  await setDoc(doc(childrenRef(), childId), { avatar }, { merge: true });
}

/**
 * Change a child's details: name, age, birthday ('YYYY-MM-DD' or null) and character.
 * Only the fields given are changed.
 */
export async function updateChild(childId, { name, age, birthday, avatar }) {
  const changes = {};
  if (name !== undefined) {
    if (!name.trim()) throw new Error('Enter a name.');
    changes.name = name.trim();
  }
  if (age !== undefined) {
    if (!Number.isInteger(age) || age < 1 || age > 17) throw new Error('Enter an age between 1 and 17.');
    changes.age = age;
  }
  if (birthday !== undefined) changes.birthday = birthday;
  if (avatar !== undefined) {
    if (avatar !== null && !isAvatarId(avatar)) throw new Error('Unknown character.');
    changes.avatar = avatar;
  }
  await setDoc(doc(childrenRef(), childId), changes, { merge: true });
}

/** Add a child to the signed-in parent's account. Returns the new profile. */
export async function addChild({ name, age, avatar = null }) {
  if (avatar !== null && !isAvatarId(avatar)) throw new Error('Unknown character.');
  const joinedDate = new Date().toISOString().slice(0, 10);
  const child = { name: name.trim(), age, avatar, joinedDate };
  const ref = await addDoc(childrenRef(), { ...child, createdAt: serverTimestamp() });
  return { id: ref.id, ...child };
}

// parents/{uid}/children/{childId}/sessions/{id}: one document each time a child plays a game.
function sessionsRef(childId) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Not signed in.');
  return collection(db, 'parents', uid, 'children', childId, 'sessions');
}

/** Save that a child played a game. `completed` = they reached the end of the story. */
export async function recordSession(childId, { gameId, completed, durationSeconds }) {
  if (!catalogue.some((g) => g.id === gameId)) throw new Error(`Unknown game: ${gameId}`);
  await addDoc(sessionsRef(childId), {
    gameId,
    completed: Boolean(completed),
    durationSeconds: Math.min(Math.max(Math.round(durationSeconds) || 0, 0), 36000),
    playedAt: serverTimestamp(),
  });
}

/**
 * The games a child has actually played, most recently played first:
 * [{ game, plays, completedCount, totalSeconds, lastPlayedAt }]. lastPlayedAt is a Date or null.
 */
export async function getPlayedGames(childId) {
  const snapshot = await getDocs(sessionsRef(childId));
  const byGame = new Map();
  for (const entry of snapshot.docs) {
    const { gameId, completed, durationSeconds = 0, playedAt } = entry.data();
    const game = catalogue.find((g) => g.id === gameId);
    if (!game) continue;
    const row = byGame.get(gameId) ?? { game: copy(game), plays: 0, completedCount: 0, totalSeconds: 0, lastPlayedAt: null };
    const at = playedAt?.toDate?.() ?? null;
    row.plays += 1;
    row.completedCount += completed ? 1 : 0;
    row.totalSeconds += durationSeconds;
    if (at && (!row.lastPlayedAt || at > row.lastPlayedAt)) row.lastPlayedAt = at;
    byGame.set(gameId, row);
  }
  return [...byGame.values()].sort((a, b) => (b.lastPlayedAt?.getTime() ?? 0) - (a.lastPlayedAt?.getTime() ?? 0));
}

/** Every game in the catalogue. Adult side only. */
export async function getGames() {
  return copy(catalogue);
}

/** One game from the catalogue, or null. Adult side only — child screens use getEnabledGameForChild. */
export async function getGameById(gameId) {
  const game = catalogue.find((g) => g.id === gameId);
  return game ? copy(game) : null;
}

/** { childId, enabledGameIds } for one child. */
export async function getChildGameSettings(childId) {
  return copy(await settingsFor(childId));
}

/** The games this child is allowed to see, in catalogue order. */
export async function getEnabledGamesForChild(childId) {
  const enabled = new Set((await settingsFor(childId)).enabledGameIds);
  return copy(catalogue.filter((g) => enabled.has(g.id)));
}

/** One game, only if it's enabled for this child; otherwise null. */
export async function getEnabledGameForChild(childId, gameId) {
  const games = await getEnabledGamesForChild(childId);
  return games.find((g) => g.id === gameId) ?? null;
}

/** Title search, limited to this child's enabled games. An empty query returns []. */
export async function searchEnabledGamesForChild(childId, query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const games = await getEnabledGamesForChild(childId);
  return games.filter((g) => g.title.toLowerCase().includes(q));
}

/** Show or hide one game for a child. Returns the updated settings. */
export async function setGameEnabledForChild(childId, gameId, enabled) {
  if (!catalogue.some((g) => g.id === gameId)) {
    throw new Error(`Unknown game: ${gameId}`);
  }
  const entry = await settingsFor(childId);
  const ids = new Set(entry.enabledGameIds);
  if (enabled) ids.add(gameId);
  else ids.delete(gameId);
  entry.enabledGameIds = catalogue.filter((g) => ids.has(g.id)).map((g) => g.id);
  await setDoc(doc(childrenRef(), childId), { enabledGameIds: entry.enabledGameIds }, { merge: true });
  return copy(entry);
}

// ---------------------------------------------------------------------------
// Grown-up side: dashboard, insights, profile, and games management
// ---------------------------------------------------------------------------

const WEEKLY_GOAL_MINUTES = 100; // mock goal for the "time this week" ring

const gameTitleOf = (gameId) => catalogue.find((g) => g.id === gameId)?.title ?? 'A game';
const newestFirst = (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0);

function withGameTitle(insight) {
  return { ...copy(insight), gameTitle: gameTitleOf(insight.gameId) };
}

/** One child's profile: { id, name, age, avatar, joinedDate }, or null. */
export async function getChild(childId) {
  const snapshot = await getDoc(doc(childrenRef(), childId));
  return snapshot.exists() ? toChild(snapshot) : null;
}

/** The signed-in parent: { name, email }. */
export async function getParentAccount() {
  const { displayName, email } = auth.currentUser;
  return { name: displayName ?? '', email };
}

/** Change the parent's display name. */
export async function updateParentName({ name }) {
  if (!name.trim()) throw new Error('Enter a name.');
  await changeName(name);
}

/** Ask to change the parent's email. Needs the current password; the new address must be confirmed by link. */
export async function updateParentEmail({ email, currentPassword }) {
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) throw new Error('Enter a valid email address.');
  await changeEmail({ email, currentPassword });
}

/** Change the parent's password. Needs the current one. Throws an Error with a message to show. */
export async function updateParentPassword({ currentPassword, newPassword }) {
  if (newPassword.length < MIN_PASSWORD_LENGTH) throw new Error(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
  await changePassword({ currentPassword, newPassword });
}

/** A child's play history, newest first, each with its game's title. */
export async function getSessions(childId) {
  return sessionData
    .filter((s) => s.childId === childId)
    .sort(newestFirst)
    .map((s) => ({ ...s, gameTitle: gameTitleOf(s.gameId) }));
}

/** Everything the dashboard shows: this week's totals, a bar per day, and the latest insights. */
export async function getDashboardSummary(childId) {
  const child = await getChild(childId);
  const mine = sessionData.filter((s) => s.childId === childId);

  // the last 7 days, oldest first, ending today
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = daysAgo(6 - i);
    const onThatDay = mine.filter((s) => s.date === date);
    return {
      date,
      label: weekdayShort(date),
      minutes: onThatDay.reduce((sum, s) => sum + s.durationMinutes, 0),
      sessions: onThatDay.length,
      isToday: i === 6,
    };
  });
  const dates = new Set(days.map((d) => d.date));
  const week = mine.filter((s) => dates.has(s.date));

  return {
    child,
    goalMinutes: WEEKLY_GOAL_MINUTES,
    weekMinutes: week.reduce((sum, s) => sum + s.durationMinutes, 0),
    sessionsThisWeek: week.length,
    completedThisWeek: week.filter((s) => s.completed).length,
    days,
    highlights: (await getInsights(childId)).slice(0, 3),
  };
}

/** A child's insights, newest first. */
export async function getInsights(childId) {
  return insightData.filter((i) => i.childId === childId).sort(newestFirst).map(withGameTitle);
}

/** One child's insights for a single game, newest first. */
export async function getInsightsForGame(childId, gameId) {
  return (await getInsights(childId)).filter((i) => i.gameId === gameId);
}

/** One insight, plus the child, the game, and that session's stats. Null if it doesn't exist. */
export async function getInsightById(insightId) {
  const insight = insightData.find((i) => i.id === insightId);
  if (!insight) return null;
  const session = sessionData.find(
    (s) => s.childId === insight.childId && s.gameId === insight.gameId && s.date === insight.date,
  );
  return {
    ...withGameTitle(insight),
    child: await getChild(insight.childId),
    session: session ? copy(session) : null,
  };
}

/** The distinct themes across the catalogue, in catalogue order: ["Stress", "Social Awareness", ...]. */
export async function getGameCategories() {
  return [...new Set(catalogue.map((g) => g.category))];
}

/**
 * Switch a game on or off for a child (what a parent does on the Games page).
 * Returns { gameId, active }. Games that aren't ready yet can't be switched on.
 */
export async function toggleGameActive(childId, gameId) {
  const game = catalogue.find((g) => g.id === gameId);
  if (!game) throw new Error(`Unknown game: ${gameId}`);
  const entry = await settingsFor(childId);
  const active = !entry.enabledGameIds.includes(gameId);
  if (active && game.comingSoon) throw new Error(`${game.title} isn't ready to play yet`);
  await setGameEnabledForChild(childId, gameId, active);
  return { gameId, active };
}
