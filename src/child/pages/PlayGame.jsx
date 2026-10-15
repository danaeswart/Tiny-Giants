import { useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import ScenePlayer from '../../games/engine/ScenePlayer.jsx';
import { getScenes } from '../../games/registry.js';
import { useEnabledGame } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { recordSession } from '../../shared/services/api.js';
import ChildMessage from '../components/ChildMessage.jsx';
import ChildScreen from '../components/ChildScreen.jsx';
import GamePlaceholder from './GamePlaceholder.jsx';

const MIN_SECONDS = 5; // leaving sooner than this isn't counted as a play

/** Plays a game full screen. Games that aren't built yet fall back to the placeholder. */
export default function PlayGame() {
  const { gameId } = useLocalSearchParams();
  const childId = useCurrentChildId();
  const { game, loading } = useEnabledGame(childId, gameId);
  const scenes = getScenes(gameId);
  const [startedAt] = useState(Date.now);
  const saved = useRef(false);

  if (!scenes) return <GamePlaceholder />;
  if (loading) return <ChildScreen />;
  if (!game) return <ChildMessage title="This story isn't here right now" />;

  // Save the play once, whether the child finished the story or left early. A failed save
  // must never get in the child's way, so it is only logged.
  function save(completed) {
    if (saved.current) return;
    const durationSeconds = (Date.now() - startedAt) / 1000;
    if (!completed && durationSeconds < MIN_SECONDS) return;
    saved.current = true;
    recordSession(childId, { gameId: game.id, completed, durationSeconds }).catch((error) =>
      console.warn('Could not save play session:', error.message),
    );
  }

  const backToBook = () => router.dismissTo(`/child/games/${game.id}`);
  return (
    <ScenePlayer
      scenes={scenes}
      onExit={() => {
        save(false);
        backToBook();
      }}
      onFinish={() => {
        save(true);
        backToBook();
      }}
    />
  );
}
