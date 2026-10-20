import { useEffect, useMemo, useRef, useState } from 'react';
import Captions from './Captions.jsx';
import { estimatedEnd, lineAt, timeLines } from './timing.js';

/**
 * Shows lines as captions one after another, timed by estimated reading time.
 * There is no voice: the story is read from the screen.
 *
 *   lines  [{ text, at? }] (see timing.js)
 *   onEnd  called once, when the last line's time is up.
 *
 * It starts as soon as it mounts. To show a second set of lines in the same scene,
 * render another <Narration> with a different `key`.
 */
export default function Narration({ lines, onEnd }) {
  const timed = useMemo(() => timeLines(lines), [lines]);
  const time = useTimerClock(true, estimatedEnd(timed), onEnd);

  return <Captions text={lineAt(timed, time)?.text} />;
}

// Clock that counts up to `duration` seconds, then calls `onEnd` once.
export function useTimerClock(running, duration, onEnd) {
  const [time, setTime] = useState(0);
  const onEndRef = useRef(onEnd);
  useEffect(() => {
    onEndRef.current = onEnd;
  });

  useEffect(() => {
    if (!running) return;
    const start = Date.now();
    let ended = false;
    const id = setInterval(() => {
      const t = (Date.now() - start) / 1000;
      setTime(t);
      if (!ended && t >= duration) {
        ended = true;
        onEndRef.current?.();
      }
    }, 100);
    return () => clearInterval(id);
  }, [running, duration]);

  return time;
}
