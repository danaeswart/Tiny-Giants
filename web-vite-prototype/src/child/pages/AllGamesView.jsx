import { Link } from 'react-router-dom';
import CoverImage from '../../shared/components/CoverImage.jsx';
import IconButton from '../../shared/components/IconButton.jsx';
import { useEnabledGames } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import ChildMessage from '../components/ChildMessage.jsx';

/** Every enabled game at a glance. */
export default function AllGamesView() {
  const childId = useCurrentChildId();
  const { games, loading } = useEnabledGames(childId);

  if (loading) return null;
  if (games.length === 0) {
    return <ChildMessage title="No stories here yet">Ask a grown-up to choose some stories for you.</ChildMessage>;
  }

  return (
    <main className="flex h-full flex-col gap-4 p-4 sm:p-6">
      <header className="flex items-center gap-4">
        <IconButton icon="home" label="Back to the shelf" to="/child" />
        <h1 className="text-2xl font-extrabold sm:text-3xl">All games</h1>
      </header>

      <ul className="grid min-h-0 flex-1 auto-rows-max grid-cols-[repeat(auto-fill,minmax(min(100%,15rem),1fr))] gap-5 overflow-y-auto overscroll-contain p-1">
        {games.map((game) => (
          <li key={game.id}>
            <Link
              to={`/child/games/${game.id}`}
              className="flex h-full flex-col gap-3 rounded-3xl bg-white p-3 shadow-sm ring-1 ring-ink/10 transition hover:-translate-y-1 active:scale-[0.98]"
            >
              <CoverImage game={game} className="aspect-[4/3] w-full rounded-2xl" />
              <span className="px-2 pb-1 text-xl font-extrabold">{game.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
