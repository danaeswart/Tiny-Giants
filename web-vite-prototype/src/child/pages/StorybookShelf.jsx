import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../shared/components/Button.jsx';
import Icon from '../../shared/components/Icon.jsx';
import IconButton from '../../shared/components/IconButton.jsx';
import Modal from '../../shared/components/Modal.jsx';
import { useEnabledGames } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import SearchBar from '../components/SearchBar.jsx';

/** Child home: one big book to open, plus two quiet secondary actions. */
export default function StorybookShelf() {
  const childId = useCurrentChildId();
  const { games, loading } = useEnabledGames(childId);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const hasGames = games.length > 0;

  return (
    <main className="flex h-full flex-col gap-2 p-4 sm:p-6">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold text-sea-deep sm:text-3xl">Tiny Giants</h1>
        {hasGames && (
          <div className="flex items-center gap-3">
            <IconButton icon="search" label="Search games" onClick={() => setSearchOpen(true)} />
            <Button to="/child/games" variant="secondary" icon="grid">
              All games
            </Button>
          </div>
        )}
      </header>

      <div className="flex min-h-0 flex-1 items-center justify-center">
        {!loading && (hasGames ? <OpenBookLink /> : <EmptyShelf />)}
      </div>

      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="Find a game">
        <SearchBar childId={childId} onSelect={(game) => navigate(`/child/games/${game.id}`)} />
      </Modal>
    </main>
  );
}

function OpenBookLink() {
  return (
    <Link to="/child/story" className="group flex flex-col items-center gap-3 rounded-3xl p-3">
      <span className="relative block aspect-[4/5] h-[min(56dvh,22rem)] transition-transform duration-300 group-hover:-rotate-2 group-hover:scale-[1.03] group-active:scale-95">
        {/* Page block peeking out from under the cover */}
        <span
          aria-hidden="true"
          className="absolute inset-y-[3%] right-[-5%] left-[8%] rounded-r-2xl bg-paper shadow-md ring-1 ring-ink/10"
        />
        {/* Cover */}
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-[6%] rounded-l-md rounded-r-2xl bg-sea pl-[12%] text-white shadow-[0_10px_24px_rgb(43_39_51/0.25)]">
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[12%] rounded-l-md bg-sea-deep" />
          <Icon name="heart" className="size-[28%] text-sun" />
          <span className="text-[length:clamp(1.25rem,5dvh,2rem)] leading-tight font-extrabold">Story time</span>
        </span>
      </span>
      <span className="text-xl font-bold text-ink-soft">Tap the book to open it</span>
    </Link>
  );
}

function EmptyShelf() {
  return (
    <div className="flex max-w-xl flex-col items-center gap-3 text-center">
      <p className="text-3xl font-extrabold">No stories here yet</p>
      <p className="text-xl text-ink-soft">Ask a grown-up to choose some stories for you.</p>
    </div>
  );
}
