import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../shared/components/Button.jsx';
import CoverImage from '../../shared/components/CoverImage.jsx';
import { getChildGameSettings, getGames, setGameEnabledForChild } from '../../shared/services/api.js';

/** A parent chooses which games from the catalogue their child can see. */
export default function ManageChildGames() {
  const { childId } = useParams();
  const [games, setGames] = useState([]);
  const [enabledIds, setEnabledIds] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([getGames(), getChildGameSettings(childId)]).then(([all, settings]) => {
      if (cancelled) return;
      setGames(all);
      setEnabledIds(new Set(settings.enabledGameIds));
    });
    return () => {
      cancelled = true;
    };
  }, [childId]);

  async function toggle(game, enabled) {
    const previous = enabledIds;
    const optimistic = new Set(previous);
    if (enabled) optimistic.add(game.id);
    else optimistic.delete(game.id);
    setEnabledIds(optimistic);

    try {
      const settings = await setGameEnabledForChild(childId, game.id, enabled);
      setEnabledIds(new Set(settings.enabledGameIds));
      setStatus(`${game.title} is now ${enabled ? 'shown' : 'hidden'}.`);
    } catch {
      setEnabledIds(previous);
      setStatus(`Couldn't save the change to ${game.title}. Please try again.`);
    }
  }

  if (!enabledIds) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold">Choose your child's games</h1>
        <p className="text-lg text-ink-soft">
          Only games that are switched on appear on your child's device. {enabledIds.size} of {games.length}{' '}
          switched on.
        </p>
      </div>

      <ul className="divide-y divide-ink/10 overflow-hidden rounded-2xl ring-1 ring-ink/10">
        {games.map((game) => {
          const checked = enabledIds.has(game.id);
          return (
            <li key={game.id}>
              <label className="flex min-h-20 cursor-pointer items-center gap-4 p-4 hover:bg-cream/60">
                <CoverImage game={game} className="hidden h-16 w-20 shrink-0 rounded-xl sm:block" />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-lg font-bold">{game.title}</span>
                  <span className="text-base text-ink-soft">{game.teaches}</span>
                </span>
                <span className="w-9 text-right text-base font-bold text-ink-soft" aria-hidden="true">
                  {checked ? 'On' : 'Off'}
                </span>
                <input
                  type="checkbox"
                  role="switch"
                  checked={checked}
                  onChange={(e) => toggle(game, e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className="relative h-9 w-16 shrink-0 rounded-full bg-[#8a8494] transition peer-checked:bg-leaf peer-focus-visible:outline-4 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sea-deep after:absolute after:top-1 after:left-1 after:size-7 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-7"
                />
              </label>
            </li>
          );
        })}
      </ul>

      <p aria-live="polite" className="min-h-7 text-base text-ink-soft">
        {status}
      </p>

      <Button to="/child" variant="secondary" size="md" className="self-start">
        Open your child's storybook
      </Button>
    </div>
  );
}
