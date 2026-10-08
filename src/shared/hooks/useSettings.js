import { createPersistedStore, useStore } from '../state/persistedStore.js';

// Device settings a grown-up can change from the profile menu. Remembered between launches.
//   narration  read the stories aloud (turn off to read quietly)
//   captions   show the words on screen while a story is read aloud
const settings = createPersistedStore('tiny-giants:settings', { narration: true, captions: true });

/** { narration, captions } */
export function useSettings() {
  return useStore(settings);
}

/** setSetting('captions', false) */
export function setSetting(key, value) {
  settings.set({ [key]: value });
}
