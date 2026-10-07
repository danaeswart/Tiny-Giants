// Timing helpers for narration lines.
//
// A scene's `lines` is a list like:
//   [{ text: 'I love the forest.', at: 0 }, { text: 'But today I want the beach!', at: 2.4 }]
// `at` is the second the line starts in the narration audio (or video). While there's
// no recording yet, leave `at` out and each line gets an estimated reading time.

const SECONDS_PER_WORD = 0.42; // calm read-aloud pace for young children
const LINE_GAP = 0.8; // pause between lines
const MIN_LINE = 1.8;

function estimateDuration(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(MIN_LINE, words * SECONDS_PER_WORD) + LINE_GAP;
}

/** Fills in `at` for any line without one, and adds `end` (when the next line starts). */
export function timeLines(lines = []) {
  let clock = 0;
  const timed = lines.map((line) => {
    const at = line.at ?? clock;
    clock = at + estimateDuration(line.text);
    return { ...line, at, end: clock };
  });
  timed.forEach((line, i) => {
    if (timed[i + 1]) line.end = timed[i + 1].at;
  });
  return timed;
}

/** When the last estimated line finishes. Used when there's no audio to listen to. */
export function estimatedEnd(timedLines) {
  return timedLines.length ? timedLines[timedLines.length - 1].end : 0;
}

/** The line showing at `time` seconds (the latest one that has started), or null. */
export function lineAt(timedLines, time) {
  let current = null;
  for (const line of timedLines) {
    if (line.at <= time) current = line;
  }
  return current;
}
