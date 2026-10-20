import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconButton from '../../shared/components/IconButton.jsx';

const PLAY_AFTER_SECONDS = 5; // how far into the clip the Play button pops up

/**
 * SCENE TYPE: LOOPING VIDEO — a clip that repeats (with its own sound) until the child taps Play.
 *
 *   src     the video, e.g. require('../../../../assets/book/games/game1/into.mov')
 *   onDone  from ScenePlayer: moves to the next scene
 *
 * The Play button pops up a few seconds into the clip.
 */
export default function LoopingVideoScene({ src, onDone }) {
  const insets = useSafeAreaInsets();
  const [showPlay, setShowPlay] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowPlay(true), PLAY_AFTER_SECONDS * 1000);
    return () => clearTimeout(t);
  }, []);

  const player = useVideoPlayer(src, (p) => {
    p.loop = true;
    p.muted = false;
    p.play();
  });

  const leave = () => {
    player.pause();
    onDone();
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />
      {showPlay && (
        <Animated.View
          entering={ZoomIn.springify()}
          style={[styles.corner, { right: Math.max(insets.right, 20), bottom: Math.max(insets.bottom, 20) }]}
        >
          <IconButton icon="play" label="Play" size="xl" variant="primary" onPress={leave} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  corner: { position: 'absolute' },
});
