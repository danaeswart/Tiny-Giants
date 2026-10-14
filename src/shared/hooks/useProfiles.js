import { useEffect, useState, useSyncExternalStore } from 'react';
import { getProfiles } from '../services/api.js';
import { useCurrentChildId } from './useCurrentChildId.js';

const NO_PROFILES = [];

// Bumped by refreshProfiles() so every screen showing the list reloads it (e.g. after adding a child).
let version = 0;
const listeners = new Set();
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function refreshProfiles() {
  version += 1;
  listeners.forEach((listener) => listener());
}

/** { profiles, current }: every child on the signed-in account, and the one playing now (null until loaded). */
export function useProfiles() {
  const childId = useCurrentChildId();
  const refreshed = useSyncExternalStore(subscribe, () => version, () => 0);
  const [profiles, setProfiles] = useState(NO_PROFILES);

  useEffect(() => {
    let cancelled = false;
    getProfiles()
      .then((list) => !cancelled && setProfiles(list))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [refreshed]);

  return { profiles, current: profiles.find((p) => p.id === childId) ?? null };
}
