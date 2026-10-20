import { createPersistedStore, useStore } from '../state/persistedStore.js';

// Device settings a grown-up can change from the profile menu. Remembered between launches.
//   skip       show skip-forward / back buttons while playing a game
const settings = createPersistedStore('tiny-giants:settings', { skip: false });

/** { skip } */
export function useSettings() {
  return useStore(settings);
}

/** setSetting('skip', true) */
export function setSetting(key, value) {
  settings.set({ [key]: value });
}
