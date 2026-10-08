// Small date helpers. Dates are plain 'YYYY-MM-DD' strings throughout the app.

export function isoDate(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${d}`;
}

/** The date `n` days before today, e.g. daysAgo(0) = today. */
export function daysAgo(n) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return isoDate(date);
}

export function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** "Tue 7 Oct" */
export function formatDay(iso) {
  return parseISO(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

/** "September 2026" */
export function formatMonthYear(iso) {
  return parseISO(iso).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

/** "Mon", "Tue"... */
export function weekdayShort(iso) {
  return parseISO(iso).toLocaleDateString('en-GB', { weekday: 'short' });
}
