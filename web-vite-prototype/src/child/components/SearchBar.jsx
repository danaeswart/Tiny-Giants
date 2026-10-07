import { useEffect, useId, useState } from 'react';
import CoverImage from '../../shared/components/CoverImage.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { searchEnabledGamesForChild } from '../../shared/services/api.js';

/** Title search over this child's enabled games only. */
export default function SearchBar({ childId, onSelect }) {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    let cancelled = false;
    searchEnabledGamesForChild(childId, query).then((games) => !cancelled && setResults(games));
    return () => {
      cancelled = true;
    };
  }, [childId, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      <label htmlFor={inputId} className="sr-only">
        Search for a game
      </label>
      <div className="relative">
        <Icon
          name="search"
          className="pointer-events-none absolute top-1/2 left-5 size-7 -translate-y-1/2 text-ink-soft"
        />
        <input
          id={inputId}
          data-autofocus
          // Plain text, not type="search": that one eats the first Escape (clears instead of
          // closing the dialog) and adds a tiny native clear button that's hard to tap.
          type="text"
          inputMode="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find a game…"
          autoComplete="off"
          enterKeyHint="search"
          className="h-16 w-full rounded-full border-4 border-sun bg-white pr-6 pl-16 text-2xl text-ink placeholder:text-ink-soft"
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {hasQuery ? `${results.length} ${results.length === 1 ? 'game' : 'games'} found` : ''}
      </p>

      {hasQuery &&
        (results.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {results.map((game) => (
              <li key={game.id}>
                <button
                  type="button"
                  onClick={() => onSelect(game)}
                  className="flex min-h-20 w-full items-center gap-4 rounded-2xl bg-white p-2 pr-6 text-left text-xl font-extrabold shadow-sm ring-1 ring-ink/10 transition hover:bg-paper active:scale-[0.98]"
                >
                  <CoverImage game={game} className="h-16 w-24 shrink-0 rounded-xl" />
                  <span>{game.title}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-2 text-xl text-ink-soft">No games with that name. Try another word!</p>
        ))}
    </div>
  );
}
