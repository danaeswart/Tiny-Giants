// Small helpers shared by the tests, so each test only spells out what it is checking.

/**
 * A valid sign-up form. Pass only the fields a test wants to break:
 *   makeSignUpForm({ password: 'short' })  // everything else stays valid
 */
export function makeSignUpForm(overrides = {}) {
  return {
    name: 'Alex Morgan',
    email: 'alex@example.com',
    password: 'correct-horse',
    confirm: 'correct-horse',
    ...overrides,
  };
}

/** A valid child profile, with the same override pattern as makeSignUpForm. */
export function makeChild(overrides = {}) {
  return { name: 'Noah', age: 6, ...overrides };
}

/**
 * An in-memory stand-in for AsyncStorage (the phone's saved data). Use it with jest.mock
 * so tests never touch real storage and always start empty.
 */
export function createFakeStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: jest.fn(async (key) => (data.has(key) ? data.get(key) : null)),
    setItem: jest.fn(async (key, value) => void data.set(key, value)),
    removeItem: jest.fn(async (key) => void data.delete(key)),
  };
}

/** Wait for pending promises (like a store loading its saved value) to finish. */
export function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve));
}
