/**
 * The app's only data-access layer. Every screen reads and writes through these
 * functions, never the mock data files directly.
 *
 * For now they work against shared/data/*. When the backend exists, replace the
 * function bodies here with real requests — the signatures (all async) already
 * match a network API, so no screen needs to change.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { games as catalogue } from '../data/games.js';
import { childGameSettings as seedSettings } from '../data/childGameSettings.js';
import { children, MOCK_PARENT_PASSWORD, parentAccount } from '../data/children.js';
import { insights as insightData } from '../data/insights.js';
import { sessions as sessionData } from '../data/sessions.js';
import { daysAgo, weekdayShort } from '../utils/dates.js';

// Mock persistence: keeps a parent's choices across app restarts during development.
const STORAGE_KEY = 'tiny-giants:mock-child-game-settings';

const copy = (value) => JSON.parse(JSON.stringify(value));

let settingsPromise = null;

function loadSettings() {
  settingsPromise ??= AsyncStorage.getItem(STORAGE_KEY)
    .then((saved) => (saved ? JSON.parse(saved) : copy(seedSettings)))
    .catch(() => copy(seedSettings));
  return settingsPromise;
}

async function saveSettings(settings) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Non-fatal: changes still apply for this session.
  }
}

// A child with no saved settings sees every game that's ready to play.
async function settingsFor(childId) {
  const settings = await loadSettings();
  let entry = settings.find((s) => s.childId === childId);
  if (!entry) {
    entry = { childId, enabledGameIds: catalogue.filter((g) => !g.comingSoon).map((g) => g.id) };
    settings.push(entry);
  }
  return entry;
}

/** The child profiles on this device: [{ id, name, avatar }]. */
export async function getProfiles() {
  return children.map(({ id, name, avatar }) => ({ id, name, avatar }));
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
  await saveSettings(await loadSettings());
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
  const child = children.find((c) => c.id === childId);
  return child ? copy(child) : null;
}

const ACCOUNT_KEY = 'tiny-giants:mock-parent-account';

// Mock account: the email is saved on the device so a change survives restarts. The mock
// password only lives in memory (a real one belongs on the server, never in local storage).
let mockPassword = MOCK_PARENT_PASSWORD;

/** The signed-in parent: { name, email }. (No real login yet.) */
export async function getParentAccount() {
  try {
    const saved = JSON.parse((await AsyncStorage.getItem(ACCOUNT_KEY)) ?? 'null');
    if (saved?.email) return { ...copy(parentAccount), email: saved.email };
  } catch {
    // fall through to the seed account
  }
  return copy(parentAccount);
}

/** Change the parent's email. Needs the current password. Throws an Error with a message to show. */
export async function updateParentEmail({ email, currentPassword }) {
  if (currentPassword !== mockPassword) throw new Error('That password is not right.');
  const next = email.trim();
  if (!/^S+@S+.S+$/.test(next)) throw new Error('Enter a valid email address.');
  await AsyncStorage.setItem(ACCOUNT_KEY, JSON.stringify({ email: next }));
  return { email: next };
}

/** Change the parent's password. Needs the current one. Throws an Error with a message to show. */
export async function updateParentPassword({ currentPassword, newPassword }) {
  if (currentPassword !== mockPassword) throw new Error('Your current password is not right.');
  if (newPassword.length < 8) throw new Error('Use at least 8 characters.');
  mockPassword = newPassword;
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
