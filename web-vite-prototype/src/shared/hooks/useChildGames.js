import { useEffect, useState } from 'react';
import { getEnabledGameForChild, getEnabledGamesForChild } from '../services/api.js';

function useAsyncValue(load, deps, initialValue) {
  const [state, setState] = useState({ data: initialValue, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    load()
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((error) => !cancelled && setState({ data: initialValue, loading: false, error }));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

/** { games, loading, error } — only games this child's parent has enabled. */
export function useEnabledGames(childId) {
  const { data, ...rest } = useAsyncValue(() => getEnabledGamesForChild(childId), [childId], []);
  return { games: data, ...rest };
}

/** { game, loading, error } — game is null if it doesn't exist or isn't enabled for this child. */
export function useEnabledGame(childId, gameId) {
  const { data, ...rest } = useAsyncValue(
    () => getEnabledGameForChild(childId, gameId),
    [childId, gameId],
    null,
  );
  return { game: data, ...rest };
}
