import { DEFAULT_CHILD_ID } from '../data/childGameSettings.js';

// The child using this device. Will come from auth / a profile picker once those exist.
export function useCurrentChildId() {
  return DEFAULT_CHILD_ID;
}
