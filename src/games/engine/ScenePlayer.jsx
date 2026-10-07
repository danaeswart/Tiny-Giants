import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { setAudioModeAsync } from 'expo-audio';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../shared/components/AppText.jsx';
import Button from '../../shared/components/Button.jsx';
import IconButton from '../../shared/components/IconButton.jsx';
import { colors, radius } from '../../shared/theme.js';
import { StageContext } from './Stage.js';

/**
 * Plays a game's scenes in order, one at a time, full screen.
 *
 *   scenes    the game's ordered list: [{ id, type, title, Scene }]
 *             (see src/games/game1-big-wave/scenes.js)
 *   onExit    leave the game (the close button)
 *   onFinish  the last scene is done
 *
 * Every Scene component gets one prop, `onDone`. It calls that when it's finished
 * (narration read, video ended, mini-game won) and the next scene fades in.
 */
export default function ScenePlayer({ scenes, onExit, onFinish }) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState(null);

  // Narration should play even when the phone's silent switch is on.
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  const next = useCallback(() => {
    if (index >= scenes.length - 1) onFinish();
    else setIndex(index + 1);
  }, [index, scenes.length, onFinish]);

  const current = scenes[index];
  const { Scene } = current;

  return (
    <View
      style={styles.stage}
      onLayout={(e) => setStage({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
    >
      {stage && (
        <StageContext.Provider value={stage}>
          {/* key = scene id, so each scene starts fresh and cross-fades with the last */}
          <Animated.View
            key={current.id}
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(500)}
            style={StyleSheet.absoluteFill}
          >
            <Scene onDone={next} />
          </Animated.View>
        </StageContext.Provider>
      )}

      <IconButton
        icon="close"
        label="Leave the story"
        size="md"
        onPress={onExit}
        style={{ position: 'absolute', top: Math.max(insets.top, 16), left: Math.max(insets.left, 16) }}
      />

      {/* Development only: jump between scenes while building. Never shows in a release build. */}
      {__DEV__ && (
        <View style={[styles.dev, { top: Math.max(insets.top, 16), right: Math.max(insets.right, 16) }]}>
          <Button size="md" variant="secondary" onPress={() => setIndex(Math.max(0, index - 1))}>
            ‹
          </Button>
          <View style={styles.devLabel}>
            <AppText size={16} weight="bold">
              {current.id} · {current.type.toUpperCase()}
            </AppText>
          </View>
          <Button size="md" variant="secondary" onPress={next}>
            ›
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, overflow: 'hidden', backgroundColor: colors.ink },
  dev: { position: 'absolute', flexDirection: 'row', alignItems: 'center', gap: 8, opacity: 0.85 },
  devLabel: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
  },
});
