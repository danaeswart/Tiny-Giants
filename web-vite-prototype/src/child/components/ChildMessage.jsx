import Button from '../../shared/components/Button.jsx';

/** Full-screen friendly message with one way out — used for empty and unavailable states. */
export default function ChildMessage({ title, children }) {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-6 p-6 text-center">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      {children && <p className="max-w-xl text-xl text-ink-soft">{children}</p>}
      <Button to="/child" icon="home" size="lg">
        Home
      </Button>
    </main>
  );
}
