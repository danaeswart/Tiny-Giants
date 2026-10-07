import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from '../../shared/components/Button.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { useEnabledGame } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import ChildMessage from '../components/ChildMessage.jsx';

/** A short note for the grown-up nearby, shown before a game starts. */
export default function GameNotice() {
  const { gameId } = useParams();
  const childId = useCurrentChildId();
  const { game, loading } = useEnabledGame(childId, gameId);
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return null;
  if (!game) return <ChildMessage title="This story isn't here right now" />;

  // Go back to wherever the child came from (storybook, grid or search), or the storybook page for this game.
  const goBack = () =>
    location.key !== 'default' ? navigate(-1) : navigate(`/child/story?game=${game.id}`);

  return (
    <main className="flex h-full gap-4 p-4 sm:gap-6 sm:p-6">
      <section
        aria-labelledby="notice-title"
        className="flex min-w-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain rounded-3xl bg-paper p-5 ring-1 ring-ink/10 select-text sm:p-8"
      >
        <p className="flex items-center gap-2 text-lg font-bold text-sea-deep">
          <Icon name="heart" className="size-6 shrink-0" />
          A note for the grown-up nearby
        </p>
        <h1 id="notice-title" className="text-3xl leading-tight font-extrabold">
          {game.title}
        </h1>
        <p className="text-lg">
          <span className="font-bold">What it helps with: </span>
          {game.teaches}
        </p>
        <p className="text-lg leading-relaxed text-ink-soft">{game.parentNote}</p>
        <p className="text-lg leading-relaxed">
          When you're both ready, your little one can tap <strong>Start</strong>.
        </p>
      </section>

      <div className="flex w-[clamp(9rem,24vw,15rem)] shrink-0 flex-col gap-4">
        <Button variant="secondary" icon="back" onClick={goBack}>
          Back
        </Button>
        <Button
          to={`/child/games/${game.id}/play`}
          size="xl"
          icon="play"
          className="max-h-56 flex-1 flex-col text-3xl"
        >
          Start
        </Button>
      </div>
    </main>
  );
}
