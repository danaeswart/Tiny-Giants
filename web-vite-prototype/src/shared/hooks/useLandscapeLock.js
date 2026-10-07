import { useEffect, useSyncExternalStore } from 'react';

const PORTRAIT_QUERY = '(orientation: portrait)';

function subscribe(onChange) {
  const mql = window.matchMedia(PORTRAIT_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(PORTRAIT_QUERY).matches;

/**
 * Child screens are designed for a phone held sideways.
 *
 * - Where the browser allows it (Android Chrome in fullscreen or an installed PWA),
 *   requests a real landscape lock while mounted.
 * - Everywhere else (notably iOS Safari) the lock is refused, so callers use
 *   `isPortrait` to show a "turn your phone sideways" prompt instead of a broken layout.
 */
export function useLandscapeLock() {
  const isPortrait = useSyncExternalStore(subscribe, getSnapshot, () => false);

  useEffect(() => {
    const orientation = window.screen?.orientation;
    orientation?.lock?.('landscape').catch(() => {});
    return () => {
      try {
        orientation?.unlock?.();
      } catch {
        // Nothing was locked.
      }
    };
  }, []);

  return { isPortrait };
}

export default useLandscapeLock;
