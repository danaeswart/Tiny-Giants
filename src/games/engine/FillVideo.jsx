import { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useEventListener } from 'expo';
import { VideoView } from 'expo-video';
import Icon from '../../shared/components/Icon.jsx';
import { colors } from '../../shared/theme.js';

const BLOCKED_CHECK_MS = 800;

function playWithSound(player) {
  player.muted = false;
  player.play();
}

/**
 * A clip that fills its box. On the web a video is a plain <video> tag, which ignores
 * top/bottom/left/right and shows at its own size, so it is given an explicit width and height
 * here. It also plays inline instead of opening the phone's own full screen video player.
 *
 * Browsers can refuse to autoplay a clip that has sound. When that happens a big play button
 * covers the clip; one tap starts it with sound (the sound is never switched off for the child).
 */
export default function FillVideo({ player, style, ...rest }) {
  const [blocked, setBlocked] = useState(false);

  useEventListener(player, 'playingChange', ({ isPlaying }) => {
    if (isPlaying) setBlocked(false);
  });

  useEffect(() => {
    if (Platform.OS !== 'web' || player.muted) return;
    const t = setTimeout(() => {
      try {
        if (!player.playing && player.currentTime === 0) setBlocked(true);
      } catch {
        // the player was released while leaving the scene
      }
    }, BLOCKED_CHECK_MS);
    return () => clearTimeout(t);
  }, [player]);

  const start = () => {
    playWithSound(player);
    setBlocked(false);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <VideoView player={player} style={[{ width: '100%', height: '100%' }, style]} playsInline nativeControls={false} {...rest} />
      {blocked && (
        <Pressable accessibilityRole="button" accessibilityLabel="Play the video" onPress={start} style={styles.cover}>
          <View style={styles.button}>
            <Icon name="play" size={48} color={colors.white} />
          </View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  button: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(36, 20, 71, 0.8)',
  },
});
