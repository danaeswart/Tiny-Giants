import { Link, Outlet } from 'react-router-dom';

/** Adult routes: ordinary portrait-friendly, responsive layout. */
export default function AdultLayout() {
  return (
    <div className="min-h-dvh bg-white text-ink">
      <header className="border-b border-ink/10 bg-cream">
        <div className="mx-auto flex max-w-3xl items-center px-4 py-2">
          <Link to="/adult" className="inline-flex min-h-12 items-center text-xl font-extrabold text-sea-deep">
            Tiny Giants · Grown-ups
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}
