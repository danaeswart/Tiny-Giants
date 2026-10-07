import { router, useLocalSearchParams } from 'expo-router';
import ScenePlayer from '../../games/engine/ScenePlayer.jsx';
import { getScenes } from '../../games/registry.js';
import { useEnabledGame } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import ChildMessage from '../components/ChildMessage.jsx';
import ChildScreen from '../components/ChildScreen.jsx';
import GamePlaceholder from './GamePlaceholder.jsx';

/** Plays a game full screen. Games that aren't built yet fall back to the placeholder. */
export default function PlayGame() {
  const { gameId } = useLocalSearchParams();
  const childId = useCurrentChildId();
  const { game, loading } = useEnabledGame(childId, gameId);
  const scenes = getScenes(gameId);

  if (!scenes) return <GamePlaceholder />;
  if (loading) return <ChildScreen />;
  if (!game) return <ChildMessage title="This story isn't here right now" />;

  const backToBook = () => router.dismissTo(`/child/story?game=${game.id}`);
  return <ScenePlayer scenes={scenes} onExit={backToBook} onFinish={backToBook} />;
}
