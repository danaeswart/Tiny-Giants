import { createFakeStorage, flushPromises } from './helpers/testHelpers.js';

// Swap the phone's storage for an in-memory fake before the store module loads.
// (Variables used inside jest.mock must start with "mock".)
let mockStorage;
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: (...args) => mockStorage.getItem(...args),
    setItem: (...args) => mockStorage.setItem(...args),
  },
}));

const { createPersistedStore } = require('../shared/state/persistedStore.js');

beforeEach(() => {
  mockStorage = createFakeStorage();
});

describe('createPersistedStore', () => {
  test('starts with the initial value when nothing was saved', async () => {
    const store = createPersistedStore('k', { childId: 'child-1' });
    await flushPromises();
    expect(store.get()).toEqual({ childId: 'child-1' });
  });

  test('restores what was saved last time, keeping defaults for missing keys', async () => {
    mockStorage = createFakeStorage({ k: JSON.stringify({ childId: 'child-2' }) });
    const store = createPersistedStore('k', { childId: 'child-1', sound: true });
    await flushPromises();
    expect(store.get()).toEqual({ childId: 'child-2', sound: true });
  });

  test('set() updates the value, tells listeners, and saves it', () => {
    const store = createPersistedStore('k', { childId: 'child-1' });
    const listener = jest.fn();
    store.subscribe(listener);

    store.set({ childId: 'child-2' });

    expect(store.get().childId).toBe('child-2');
    expect(listener).toHaveBeenCalledTimes(1);
    expect(mockStorage.setItem).toHaveBeenCalledWith('k', JSON.stringify({ childId: 'child-2' }));
  });

  test('an unsubscribed listener is no longer told about changes', () => {
    const store = createPersistedStore('k', { n: 0 });
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();

    store.set({ n: 1 });

    expect(listener).not.toHaveBeenCalled();
  });

  test('a failing save does not break the app', async () => {
    mockStorage.setItem.mockRejectedValueOnce(new Error('disk full'));
    const store = createPersistedStore('k', { n: 0 });

    expect(() => store.set({ n: 1 })).not.toThrow();
    await flushPromises();
    expect(store.get().n).toBe(1); // the change still applies until the app closes
  });
});
