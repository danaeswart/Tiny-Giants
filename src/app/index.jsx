import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { getCurrentChildId, setCurrentChildId } from '../shared/hooks/useCurrentChildId.js';
import { getProfiles } from '../shared/services/api.js';
import { hasParentPin } from '../shared/services/pin.js';

/**
 * Where a signed-in parent lands. A new account finishes onboarding first (step 2: PIN,
 * step 3: add a child); otherwise it's the child's home. Shows nothing while it checks.
 */
export default function Index() {
  const [href, setHref] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let next = '/child';
      try {
        const [pinned, profiles] = await Promise.all([hasParentPin(), getProfiles()]);
        if (!pinned) next = '/create-pin';
        else if (profiles.length === 0) next = '/add-child?onboarding=1';
        else if (!profiles.some((p) => p.id === getCurrentChildId())) setCurrentChildId(profiles[0].id);
      } catch {
        // Offline or a read problem: carry on to the child's home rather than getting stuck here.
      }
      if (!cancelled) setHref(next);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return href ? <Redirect href={href} /> : null;
}
