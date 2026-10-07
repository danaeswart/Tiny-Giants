import Icon from '../../shared/components/Icon.jsx';

/**
 * The big, friendly Play button on each storybook page. Sizes scale with the
 * surrounding book (container query units) but never drop below a 64px target.
 */
export default function PlayButton({ onClick, gameTitle }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Play ${gameTitle}`}
      className="inline-flex h-[clamp(4rem,24cqh,6rem)] items-center justify-center gap-3 rounded-full bg-sun px-[clamp(1.75rem,7cqw,3rem)] text-[length:clamp(1.5rem,9cqh,2.25rem)] font-extrabold text-ink shadow-[0_6px_0_var(--color-sun-deep)] transition hover:brightness-105 active:translate-y-1 active:shadow-[0_2px_0_var(--color-sun-deep)]"
    >
      <Icon name="play" className="size-[1.1em]" />
      <span>Play</span>
    </button>
  );
}
