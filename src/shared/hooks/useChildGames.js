import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { getEnabledGameForChild, getEnabledGamesForChild } from '../services/api.js';

// Refetches every time the screen comes into focus, so a change a parent makes
// on the adult side shows up as soon as the child's screen is visible again
// (stack screens stay mounted underneath, so a plain mount effect would miss it).
// `load` must be memoized (useCallback) so it only changes when its inputs do.
function useFocusedValue(load, initialValue) {
  const [state, setState] = useState({ data: initialValue, loading: true, error: null });

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      load()
        .then((data) => !cancelled && setState({ data, loading: false, error: null }))
        .catch((error) => !cancelled && setState({ data: initialValue, loading: false, error }));
      return () => {
        cancelled = true;
      };
    }, [load, initialValue]),
  );

  return state;
}

const NO_GAMES = [];

/** { games, loading, error }: only games this child's parent has enabled. */
export function useEnabledGames(childId) {
  const load = useCallback(() => getEnabledGamesForChild(childId), [childId]);
  const { data, ...rest } = useFocusedValue(load, NO_GAMES);
  return { games: data, ...rest };
}

/** { game, loading, error }: game is null if it doesn't exist or isn't enabled for this child. */
export function useEnabledGame(childId, gameId) {
  const load = useCallback(() => getEnabledGameForChild(childId, gameId), [childId, gameId]);
  const { data, ...rest } = useFocusedValue(load, null);
  return { game: data, ...rest };
}
