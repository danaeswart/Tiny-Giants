import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettings } from '../../shared/hooks/useSettings.js';
import Captions from './Captions.jsx';
import useSpokenLines from './useSpokenLines.js';

const HOLD_AFTER_LAST_LINE = 1500; // ms the last frame stays once the closing line is read
const CIRCLE = 200; // px, full size
const SMALL = 0.35; // empty-lungs size as a fraction of full

/**
 * SCENE TYPE: BREATHING VIDEO — plays a clip while a voice reads the lines, and once the
 * character starts breathing (`breatheFrom`) shows a circle on the left that grows while
 * she breathes in and shrinks while she breathes out, so the child can follow the pace.
 * The words disappear once they've been read. Moves on by itself when the video ends.
 *
 *   src          the video
 *   lines        [{ text }] spoken (and captioned) from the start, before the breathing begins
 *   endLines     [{ text }] spoken over the last `endSeconds` of the video (it keeps playing);
 *                the scene moves on once the video has ended and they've been read
 *   endSeconds   how far from the end of the video the closing lines start
 *   breatheFrom  seconds into the video when the breathing starts
 *   inSeconds / outSeconds  length of each breath in and out
 *   onDone       from ScenePlayer
 */
export default function BreathingVideoScene({
  src,
  lines = [],
  endLines = [],
  endSeconds = 2,
  breatheFrom = 8,
  inSeconds = 2.5,
  outSeconds = 3.5,
  onDone,
}) {
  const { narration, captions } = useSettings();
  const insets = useSafeAreaInsets();
  const { text, finished, stop } = useSpokenLines(lines);
  const [breathing, setBreathing] = useState(false);
  const [closing, setClosing] = useState(false); // the last seconds: closing lines start
  const [videoEnded, setVideoEnded] = useState(false);
  const [outroDone, setOutroDone] = useState(!endLines.length);
  const scale = useSharedValue(SMALL);

  const player = useVideoPlayer(src, (p) => p.play());

  useEffect(() => {
    setMuted(player, !narration);
  }, [player, narration]);

  useEventListener(player, 'playToEnd', () => {
    if (!closing) stop();
    setVideoEnded(true);
  });

  // Watch the video's own clock so the circle starts when the breathing does, and the
  // closing lines when the clip is nearly over.
  useEffect(() => {
    const id = setInterval(() => {
      if (player.currentTime >= breatheFrom) setBreathing(true);
      if (endLines.length && player.duration > 0 && player.currentTime >= player.duration - endSeconds) {
        setClosing(true);
      }
    }, 100);
    return () => clearInterval(id);
  }, [player, breatheFrom, endSeconds, endLines.length]);

  // Move on once the clip has ended and the closing lines (if any) have been read.
  const done = videoEnded && outroDone;
  useEffect(() => {
    if (done) onDone();
  }, [done, onDone]);

  useEffect(() => {
    if (!breathing) return;
    scale.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: inSeconds * 1000, easing: Easing.inOut(Easing.sin) }),
          withTiming(SMALL, { duration: outSeconds * 1000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
      ),
    );
    return () => cancelAnimation(scale);
  }, [breathing, inSeconds, outSeconds, scale]);

  const circleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
      {breathing && (
        <View
          pointerEvents="none"
          accessible={false}
          style={[styles.circleSlot, { left: Math.max(insets.left, 16) + 24 }]}
        >
          <Animated.View style={[styles.circle, circleStyle]} />
        </View>
      )}
      {closing ? (
        <Outro lines={endLines} onDone={() => setOutroDone(true)} />
      ) : (
        <Captions text={finished ? null : text} hidden={!captions} />
      )}
    </View>
  );
}

// The closing words after the video, left on its last frame.
function Outro({ lines, onDone }) {
  const { captions } = useSettings();
  const { text, finished } = useSpokenLines(lines);

  useEffect(() => {
    if (!finished) return;
    const t = setTimeout(onDone, HOLD_AFTER_LAST_LINE);
    return () => clearTimeout(t);
  }, [finished, onDone]);

  return <Captions text={text} hidden={!captions} />;
}

// Changes the native player in place; kept outside the component so the hook-value lint rule stays quiet.
function setMuted(player, muted) {
  player.muted = muted;
}

const styles = StyleSheet.create({
  circleSlot: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: CIRCLE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
});
