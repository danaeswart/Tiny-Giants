import { useParams } from 'react-router-dom';
import IconButton from '../../shared/components/IconButton.jsx';
import { useEnabledGame } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import ChildMessage from '../components/ChildMessage.jsx';

/** Stub: each game's real implementation will load here. */
export default function GamePlaceholder() {
  const { gameId } = useParams();
  const childId = useCurrentChildId();
  const { game, loading } = useEnabledGame(childId, gameId);

  if (loading) return null;
  if (!game) return <ChildMessage title="This story isn't here right now" />;

  return (
    <main className="flex h-full flex-col gap-4 p-4 sm:p-6">
      <header className="flex items-center gap-4">
        <IconButton icon="back" label="Back to the storybook" to={`/child/story?game=${game.id}`} />
        <h1 className="text-2xl font-extrabold sm:text-3xl">{game.title}</h1>
      </header>
      <div className="grid min-h-0 flex-1 place-items-center rounded-3xl border-4 border-dashed border-ink/20 bg-paper p-6 text-center">
        <p className="text-2xl font-bold text-ink-soft">The game goes here</p>
      </div>
    </main>
  );
}
