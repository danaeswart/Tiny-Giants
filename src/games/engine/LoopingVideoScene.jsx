import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useSettings } from '../../shared/hooks/useSettings.js';
import Captions from './Captions.jsx';
import NextButton from './NextButton.jsx';
import useSpokenLines from './useSpokenLines.js';

/**
 * SCENE TYPE: LOOPING VIDEO — a clip that repeats while a voice reads the lines.
 *
 *   src     require('../assets/video/00-intro.mp4'); loops until the child taps Next
 *   lines   [{ text }] read aloud one after another, shown as captions
 *   captionPosition  'bottom' or 'top-right': where the words sit, depending on the video
 *   onDone  from ScenePlayer
 *
 * The voice is the phone's built-in text-to-speech (see useSpokenLines). The Next
 * arrow appears once the last line has been read. A grown-up's profile settings
 * apply: narration off keeps it silent (the words still show, timed by estimate),
 * captions off hides the text.
 */
export default function LoopingVideoScene({ src, lines = [], captionPosition = 'bottom', onDone }) {
  const { narration, captions } = useSettings();
  const { text, finished, stop } = useSpokenLines(lines);

  const player = useVideoPlayer(src, (p) => {
    p.loop = true;
    p.play();
  });

  useEffect(() => {
    setMuted(player, !narration);
  }, [player, narration]);

  // The scene fades out for half a second after Next, so stop the voice now rather than on unmount.
  const leave = () => {
    stop();
    onDone();
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
      <Captions text={text} hidden={!captions} position={captionPosition} />
      {finished && <NextButton onPress={leave} />}
    </View>
  );
}

// Changes the native player in place; kept outside the component so the hook-value lint rule stays quiet.
function setMuted(player, muted) {
  player.muted = muted;
}
