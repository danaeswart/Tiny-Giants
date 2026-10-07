import Icon from '../../shared/components/Icon.jsx';

export default function RotatePrompt() {
  return (
    <div
      role="status"
      className="fixed inset-0 flex h-dvh w-dvw flex-col items-center justify-center gap-8 bg-cream p-8 text-center"
    >
      <div className="animate-tilt text-sea-deep motion-reduce:animate-none">
        <Icon name="phone" className="size-28" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-3xl font-extrabold">Turn your phone sideways</p>
        <p className="text-xl text-ink-soft">The stories open up wide!</p>
      </div>
    </div>
  );
}
