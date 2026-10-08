import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

/**
 * Loads data for a screen, and loads it again each time the screen comes back into view
 * (so a change made on another screen shows up straight away).
 * `load` must be memoized with useCallback so it only changes when its inputs do.
 * Returns { data, loading, error }; data is null until the first load finishes.
 */
export function useLoad(load) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      load()
        .then((data) => !cancelled && setState({ data, loading: false, error: null }))
        .catch((error) => !cancelled && setState({ data: null, loading: false, error }));
      return () => {
        cancelled = true;
      };
    }, [load]),
  );

  return state;
}
