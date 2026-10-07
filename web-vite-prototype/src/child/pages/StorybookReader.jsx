import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import IconButton from '../../shared/components/IconButton.jsx';
import { useEnabledGames } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import BookPage from '../components/BookPage.jsx';
import ChildMessage from '../components/ChildMessage.jsx';
import PageTurner from '../components/PageTurner.jsx';

/**
 * The storybook: one enabled game per page. Swipe, tap the arrows, or use the
 * arrow keys to turn. The open page lives in the URL (?game=id) so coming back
 * from a game lands on the same page.
 */
export default function StorybookReader() {
  const childId = useCurrentChildId();
  const { games, loading } = useEnabledGames(childId);
  const [searchParams, setSearchParams] = useSearchParams();
  const [direction, setDirection] = useState(0);
  const navigate = useNavigate();

  const requested = games.findIndex((g) => g.id === searchParams.get('game'));
  const current = Math.max(requested, 0);
  const canPrev = current > 0;
  const canNext = current < games.length - 1;

  function turn(dir) {
    const target = games[current + dir];
    if (!target) return;
    setDirection(dir);
    setSearchParams({ game: target.id }, { replace: true });
  }

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight') turn(1);
      if (e.key === 'ArrowLeft') turn(-1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (loading) return null;
  if (games.length === 0) {
    return <ChildMessage title="No stories here yet">Ask a grown-up to choose some stories for you.</ChildMessage>;
  }

  const game = games[current];

  return (
    <main className="flex h-full items-stretch gap-2 p-3 sm:gap-4 sm:p-4">
      <p className="sr-only" aria-live="polite">
        Page {current + 1} of {games.length}: {game.title}
      </p>

      <div className="flex w-20 shrink-0 flex-col items-center">
        <IconButton icon="home" label="Back to the shelf" to="/child" />
        <div className="flex flex-1 items-center">
          <TurnButton show={canPrev} icon="chevron-left" label="Previous page" onClick={() => turn(-1)} />
        </div>
        <div className="size-16" aria-hidden="true" />
      </div>

      {/* Book: 3:2, as large as fits. Container query units size everything inside. */}
      <div className="grid h-full min-w-0 flex-1 place-items-center [container-type:size]">
        <div className="relative" style={{ width: 'min(100cqw, 150cqh)', height: 'min(100cqh, 66.667cqw)' }}>
          <div aria-hidden="true" className="absolute -inset-y-2 -right-3 -left-2 rounded-2xl bg-sea-deep shadow-xl" />
          <div aria-hidden="true" className="absolute inset-y-1 -right-1.5 left-1 rounded-r-2xl bg-paper ring-1 ring-ink/10" />
          <div className="absolute inset-0 [container-type:size]">
            <PageTurner
              index={current}
              count={games.length}
              direction={direction}
              onPrev={() => turn(-1)}
              onNext={() => turn(1)}
              renderPage={(i) => (
                <BookPage
                  game={games[i]}
                  pageNumber={i + 1}
                  onPlay={() => navigate(`/child/games/${games[i].id}`)}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="flex w-20 shrink-0 items-center justify-center">
        <TurnButton show={canNext} icon="chevron-right" label="Next page" onClick={() => turn(1)} />
      </div>
    </main>
  );
}

// Keeps its space when hidden so the book doesn't jump around at the first/last page.
function TurnButton({ show, ...props }) {
  if (!show) return <div className="size-20" aria-hidden="true" />;
  return <IconButton size="xl" {...props} />;
}
