import { createPersistedStore, useStore } from '../state/persistedStore.js';

// Device settings a grown-up can change from the profile menu. Remembered between launches.
//   narration  read the stories aloud (turn off to read quietly)
//   captions   show the words on screen while a story is read aloud
//   skip       show skip-forward / back buttons while playing a game
const settings = createPersistedStore('tiny-giants:settings', { narration: true, captions: true, skip: false });

/** { narration, captions, skip } */
export function useSettings() {
  return useStore(settings);
}

/** setSetting('captions', false) */
export function setSetting(key, value) {
  settings.set({ [key]: value });
}
