import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * A tiny app-wide value that survives restarts. Any screen can read it with
 * useStore(store) and re-renders when it changes; set() saves it to the device.
 * Used for things like "which child is playing" and the settings switches.
 */
export function createPersistedStore(storageKey, initial) {
  let state = initial;
  const listeners = new Set();
  const notify = () => listeners.forEach((listener) => listener());

  // Pick up what was saved last time (arrives a moment after launch).
  AsyncStorage.getItem(storageKey)
    .then((saved) => {
      if (!saved) return;
      state = { ...initial, ...JSON.parse(saved) };
      notify();
    })
    .catch(() => {});

  return {
    get: () => state,
    set(patch) {
      state = { ...state, ...patch };
      notify();
      AsyncStorage.setItem(storageKey, JSON.stringify(state)).catch(() => {
        // Non-fatal: the change still applies until the app closes.
      });
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    initial,
  };
}

/** The store's current value; the component re-renders whenever it changes. */
export function useStore(store) {
  return useSyncExternalStore(store.subscribe, store.get, () => store.initial);
}
