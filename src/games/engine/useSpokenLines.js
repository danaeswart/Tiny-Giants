import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Speech from 'expo-speech';
import { useSettings } from '../../shared/hooks/useSettings.js';
import { useTimerClock } from './Narration.jsx';
import { estimatedEnd, lineAt, timeLines } from './timing.js';

const PAUSE_BETWEEN_LINES = 1200; // ms of quiet after each sentence

/**
 * Reads `lines` aloud one after another (the phone's built-in voice, with a pause
 * after each) and says which one is being spoken.
 *
 *   returns { text, finished, stop }
 *   text      the line to show as a caption right now
 *   finished  true once the last line has been read
 *   stop()    silence the voice now (scenes fade out for half a second after
 *             they're done, so call this when leaving rather than waiting for unmount)
 *
 * A grown-up's narration setting applies: with narration off nothing is spoken, and
 * a timer with estimated reading times stands in so the words still appear and
 * `finished` still happens.
 */
export default function useSpokenLines(lines) {
  const { narration } = useSettings();
  const timed = useMemo(() => timeLines(lines), [lines]);
  const [spoken, setSpoken] = useState(0);
  const [finished, setFinished] = useState(false);
  const stopped = useRef(false);
  const pause = useRef(null);

  useEffect(() => {
    if (!narration) return;
    // Set when the scene is left, so a line still being spoken can't start the next one.
    let cancelled = false;
    const speakLine = (i) => {
      if (stopped.current || cancelled) return;
      if (i >= lines.length) return setFinished(true);
      Speech.speak(lines[i].text, {
        language: 'en',
        rate: 0.9,
        pitch: 1.1,
        onStart: () => !cancelled && setSpoken(i),
        onDone: () => {
          if (cancelled) return;
          pause.current = setTimeout(() => speakLine(i + 1), PAUSE_BETWEEN_LINES);
        },
        onError: () => !cancelled && setFinished(true),
      });
    };
    speakLine(0);
    return () => {
      cancelled = true;
      clearTimeout(pause.current);
      Speech.stop();
    };
  }, [narration, lines]);

  const timerTime = useTimerClock(!narration, estimatedEnd(timed), () => setFinished(true));

  const stop = useCallback(() => {
    stopped.current = true;
    clearTimeout(pause.current);
    Speech.stop();
  }, []);

  const text = narration ? lines[spoken]?.text : lineAt(timed, timerTime)?.text;
  return { text, finished, stop };
}
