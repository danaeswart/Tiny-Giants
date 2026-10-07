import { useEffect, useMemo, useRef, useState } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import Captions from './Captions.jsx';
import { estimatedEnd, lineAt, timeLines } from './timing.js';

/**
 * Reads lines aloud and shows them as captions at the same time.
 *
 *   audio  require('../assets/audio/00-intro.m4a'), or null while there's no recording.
 *          With audio, captions follow the audio's own clock, so they can't drift.
 *          Without it, a timer stands in using estimated reading times.
 *   lines  [{ text, at? }] (see timing.js)
 *   onEnd  called once, when the audio (or estimated reading time) finishes.
 *
 * It starts as soon as it mounts. To play a second set of lines in the same scene,
 * render another <Narration> with a different `key`.
 */
export default function Narration({ audio = null, lines, onEnd }) {
  const timed = useMemo(() => timeLines(lines), [lines]);
  const audioTime = useAudioClock(audio, onEnd);
  const timerTime = useTimerClock(!audio, estimatedEnd(timed), onEnd);
  const time = audio ? audioTime : timerTime;

  return <Captions text={lineAt(timed, time)?.text} />;
}

// Plays the audio once and reports its position in seconds.
function useAudioClock(audio, onEnd) {
  const player = useAudioPlayer(audio, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);
  const ended = useRef(false);

  useEffect(() => {
    if (audio) player.play();
  }, [audio, player]);

  useEffect(() => {
    if (audio && status.didJustFinish && !ended.current) {
      ended.current = true;
      onEnd?.();
    }
  }, [audio, status.didJustFinish, onEnd]);

  return status.currentTime ?? 0;
}

// Stand-in clock for scenes with no recording yet: counts up to `duration` seconds.
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
