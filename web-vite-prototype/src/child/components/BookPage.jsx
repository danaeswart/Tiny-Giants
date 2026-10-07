import CoverImage from '../../shared/components/CoverImage.jsx';
import PlayButton from './PlayButton.jsx';

/**
 * One page of the storybook = one game. Only three things on it: the picture,
 * the title and Play. Sized with container query units so it scales with the book.
 */
export default function BookPage({ game, pageNumber, onPlay }) {
  return (
    <article
      aria-label={game.title}
      className="relative flex h-full w-full items-stretch gap-[4cqw] overflow-hidden rounded-l-md rounded-r-2xl bg-paper py-[6cqh] pr-[5cqw] pl-[7cqw]"
    >
      {/* Shadow where the page meets the spine */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-[7cqw] bg-linear-to-r from-ink/15 to-transparent"
      />

      <CoverImage game={game} className="h-full w-1/2 shrink-0 rounded-2xl" />

      <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-[7cqh] text-center">
        <h2 className="text-[length:clamp(1.5rem,11cqh,3rem)] leading-tight font-extrabold text-balance">
          {game.title}
        </h2>
        <PlayButton onClick={onPlay} gameTitle={game.title} />
      </div>

      <span aria-hidden="true" className="absolute right-[3cqw] bottom-[2.5cqh] text-lg font-bold text-ink-soft">
        {pageNumber}
      </span>
    </article>
  );
}
