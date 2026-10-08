import { useEffect, useState } from 'react';
import { getProfiles } from '../services/api.js';
import { useCurrentChildId } from './useCurrentChildId.js';

const NO_PROFILES = [];

/** { profiles, current }: every profile on this device, and the one playing now (null until loaded). */
export function useProfiles() {
  const childId = useCurrentChildId();
  const [profiles, setProfiles] = useState(NO_PROFILES);

  useEffect(() => {
    let cancelled = false;
    getProfiles().then((list) => !cancelled && setProfiles(list));
    return () => {
      cancelled = true;
    };
  }, []);

  return { profiles, current: profiles.find((p) => p.id === childId) ?? null };
}
