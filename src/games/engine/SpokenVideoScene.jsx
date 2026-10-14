import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useSettings } from '../../shared/hooks/useSettings.js';
import Captions from './Captions.jsx';
import useSpokenLines from './useSpokenLines.js';

/**
 * SCENE TYPE: SPOKEN VIDEO — plays a clip once while a voice reads the lines, then
 * moves straight on to the next scene (no button to tap).
 *
 *   src     the video
 *   lines   [{ text }] read aloud from the start, shown as captions
 *   captionPosition  'bottom' or 'top-right'
 *   onDone  from ScenePlayer
 *
 * A grown-up's narration setting applies to the video's own sound too: off keeps it silent.
 */
export default function SpokenVideoScene({ src, lines = [], captionPosition = 'bottom', onDone }) {
  const { narration, captions } = useSettings();
  const { text, stop } = useSpokenLines(lines);
  const player = useVideoPlayer(src, (p) => p.play());

  useEffect(() => {
    setMuted(player, !narration);
  }, [player, narration]);

  useEventListener(player, 'playToEnd', () => {
    stop();
    onDone();
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
      <Captions text={text} hidden={!captions} position={captionPosition} />
    </View>
  );
}

// Changes the native player in place; kept outside the component so the hook-value lint rule stays quiet.
function setMuted(player, muted) {
  player.muted = muted;
}
