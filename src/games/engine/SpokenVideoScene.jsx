import { StyleSheet, View } from 'react-native';
import { useEventListener } from 'expo';
import { useVideoPlayer } from 'expo-video';
import FillVideo from './FillVideo.jsx';
import Captions from './Captions.jsx';
import { useStage } from './Stage.js';
import useSpokenLines from './useSpokenLines.js';

/**
 * SCENE TYPE: SPOKEN VIDEO — plays a clip once while the lines show as captions, then
 * moves straight on to the next scene (no button to tap).
 *
 *   src     the video
 *   lines   [{ text }] shown as captions from the start
 *   captionPosition  'bottom' or 'top-right'
 *   shiftUp          0 to 0.3: slides the picture up by this fraction of the screen height, so more of
 *                    the bottom of the clip shows (and a little less of the top)
 *   onDone  from ScenePlayer
 *
 * The clip plays with its own sound.
 */
export default function SpokenVideoScene({ src, lines = [], captionPosition = 'bottom', shiftUp = 0, onDone }) {
  const { height } = useStage();
  const lift = height * shiftUp;
  const { text, stop } = useSpokenLines(lines);
  const player = useVideoPlayer(src, (p) => {
    p.muted = false;
    p.play();
  });

  useEventListener(player, 'playToEnd', () => {
    stop();
    onDone();
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
        <FillVideo
          player={player}
          style={[StyleSheet.absoluteFill, { top: -lift, bottom: 0, height: height + lift || undefined }]}
          contentFit="cover"
          nativeControls={false}
        />
      </View>
      <Captions text={text} position={captionPosition} />
    </View>
  );
}
