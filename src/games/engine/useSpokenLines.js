import { useMemo, useState } from 'react';
import { useTimerClock } from './Narration.jsx';
import { estimatedEnd, lineAt, timeLines } from './timing.js';

/**
 * Steps through `lines` as captions, timed by estimated reading time, and says which
 * one to show. There is no voice.
 *
 *   returns { text, finished, stop }
 *   text      the line to show as a caption right now
 *   finished  true once the last line's time is up
 *   stop()    kept so scenes can call it when leaving; there is nothing to silence now
 */
export default function useSpokenLines(lines) {
  const timed = useMemo(() => timeLines(lines), [lines]);
  const [finished, setFinished] = useState(false);
  const time = useTimerClock(true, estimatedEnd(timed), () => setFinished(true));

  return { text: lineAt(timed, time)?.text, finished, stop };
}

function stop() {}
