import { DEFAULT_CHILD_ID } from '../data/childGameSettings.js';
import { createPersistedStore, useStore } from '../state/persistedStore.js';

// The child using this device. Remembered between launches. Will come from real
// auth once that exists; "Switch account" in the profile menu changes it.
const currentChild = createPersistedStore('tiny-giants:current-child', { childId: DEFAULT_CHILD_ID });

export function useCurrentChildId() {
  return useStore(currentChild).childId;
}

/** Make another child the one playing. Every child screen updates straight away. */
export function setCurrentChildId(childId) {
  currentChild.set({ childId });
}
