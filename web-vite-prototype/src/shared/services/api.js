/**
 * The app's only data-access layer. Every screen reads and writes through these
 * functions, never the mock data files directly.
 *
 * For now they work against shared/data/*. When the backend exists, replace the
 * function bodies here with real requests — the signatures (all async) already
 * match a network API, so no component needs to change.
 */
import { games as catalogue } from '../data/games.js';
import { childGameSettings as seedSettings } from '../data/childGameSettings.js';

// Mock persistence: keeps a parent's choices across page reloads during development.
const STORAGE_KEY = 'tiny-giants:mock-child-game-settings';

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // Storage unavailable (private mode, blocked) — fall back to seed data.
  }
  return structuredClone(seedSettings);
}

function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Non-fatal: changes still apply for this session.
  }
}

let settings = loadSettings();

// A child with no saved settings sees every game.
function settingsFor(childId) {
  let entry = settings.find((s) => s.childId === childId);
  if (!entry) {
    entry = { childId, enabledGameIds: catalogue.map((g) => g.id) };
    settings.push(entry);
  }
  return entry;
}

const copy = (value) => structuredClone(value);

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
  return copy(settingsFor(childId));
}

/** The games this child is allowed to see, in catalogue order. */
export async function getEnabledGamesForChild(childId) {
  const enabled = new Set(settingsFor(childId).enabledGameIds);
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
  const entry = settingsFor(childId);
  const ids = new Set(entry.enabledGameIds);
  if (enabled) ids.add(gameId);
  else ids.delete(gameId);
  entry.enabledGameIds = catalogue.filter((g) => ids.has(g.id)).map((g) => g.id);
  saveSettings();
  return copy(entry);
}
