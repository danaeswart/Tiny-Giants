import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import AppText from '../../shared/components/AppText.jsx';
import { colors, radius } from '../../shared/theme.js';
import Captions from './Captions.jsx';
import { useTimerClock } from './Narration.jsx';
import { estimatedEnd, lineAt, timeLines } from './timing.js';

/**
 * SCENE TYPE: VIDEO — plays a clip, then moves straight on to the next scene.
 *
 *   src          require('../assets/video/14-wave.mp4'), or null while the video isn't made yet
 *   lines        optional captions shown over the video, timed with `at` (seconds into the video).
 *                Leave empty if the words are already part of the video.
 *   placeholder  { Art, label, seconds }: what plays while src is null, so the game can
 *                be played start to finish before every video exists.
 *   onDone       from ScenePlayer
 *
 * The video's own sound plays (narration can be mixed into the video file).
 */
export default function VideoScene({ src, lines = [], placeholder, onDone }) {
  return src ? (
    <RealVideo src={src} lines={lines} onDone={onDone} />
  ) : (
    <PlaceholderVideo {...placeholder} lines={lines} onDone={onDone} />
  );
}

function RealVideo({ src, lines, onDone }) {
  const timed = useMemo(() => timeLines(lines), [lines]);
  const player = useVideoPlayer(src, (p) => p.play());
  const [time, setTime] = useState(0);

  useEventListener(player, 'playToEnd', onDone);

  // Captions follow the video's own position.
  useEffect(() => {
    if (!timed.length) return;
    const id = setInterval(() => setTime(player.currentTime), 100);
    return () => clearInterval(id);
  }, [player, timed.length]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
      <Captions text={lineAt(timed, time)?.text} />
    </View>
  );
}

// Stands in for a video that hasn't been made yet: shows code-drawn art and a
// "VIDEO" tag for `seconds` (or as long as the captions need, if longer).
function PlaceholderVideo({ Art, label, seconds = 4, lines, onDone }) {
  const timed = useMemo(() => timeLines(lines), [lines]);
  const duration = Math.max(seconds, estimatedEnd(timed));
  const done = useRef(false);
  const time = useTimerClock(true, duration, () => {
    if (!done.current) {
      done.current = true;
      onDone();
    }
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      {Art && <Art />}
      <View style={styles.tag}>
        <AppText size={16} weight="extrabold" color={colors.white}>
          VIDEO PLACEHOLDER{label ? ` · ${label}` : ''}
        </AppText>
      </View>
      <Captions text={lineAt(timed, time)?.text} />
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(43, 39, 51, 0.6)',
  },
});
