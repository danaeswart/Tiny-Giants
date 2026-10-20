import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { setAudioModeAsync } from 'expo-audio';
import * as Speech from 'expo-speech';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconButton from '../../shared/components/IconButton.jsx';
import Popup from '../../shared/components/Popup.jsx';
import { useSettings } from '../../shared/hooks/useSettings.js';
import { colors } from '../../shared/theme.js';
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
  const [asking, setAsking] = useState(false);
  const leaving = useRef(false);
  const { skip } = useSettings();

  // Narration should play even when the phone's silent switch is on.
  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  // The scene on screen right now. A scene that has been skipped away from (or finished)
  // can't move the story on: only a call from the current scene counts.
  const currentId = useRef(scenes[0].id);
  const current = scenes[index];
  useEffect(() => {
    currentId.current = current.id;
  }, [current.id]);

  const goTo = useCallback((i) => {
    Speech.stop();
    setIndex(i);
  }, []);

  const next = useCallback(
    (fromId) => {
      if (fromId !== undefined && fromId !== currentId.current) return;
      if (index >= scenes.length - 1) {
        Speech.stop();
        onFinish();
      } else goTo(index + 1);
    },
    [index, scenes.length, onFinish, goTo],
  );

  const { Scene } = current;

  return (
    <View
      style={styles.stage}
      onLayout={(e) => setStage({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height })}
    >
      {stage && (
        <StageContext.Provider value={stage}>
          {/* key = scene id, so each scene starts fresh and fades in. The old scene goes at once (no fade-out), so its voice, video and timers stop the moment you leave. */}
          <Animated.View
            key={current.id}
            entering={FadeIn.duration(500)}
            style={StyleSheet.absoluteFill}
          >
            <Scene onDone={() => next(current.id)} />
          </Animated.View>
        </StageContext.Provider>
      )}

      {/* Leave the story: bottom-left corner */}
      <IconButton
        icon="close"
        label="Leave the story"
        size="md"
        variant="blue"
        onPress={() => setAsking(true)}
        style={{ position: 'absolute', bottom: Math.max(insets.bottom, 16), left: Math.max(insets.left, 16) }}
      />

      {/* A little ask first, so a stray tap doesn't end the story. */}
      <Popup
        audience="child"
        open={asking}
        tone="confirm"
        icon="back"
        title="Leave?"
        choice
        confirmLabel="Yes, leave the story"
        cancelLabel="No, keep playing"
        onConfirm={() => {
          leaving.current = true;
          setAsking(false);
        }}
        onCancel={() => setAsking(false)}
        onDismiss={() => setAsking(false)}
        onClosed={() => {
          if (!leaving.current) return;
          Speech.stop();
          onExit();
        }}
      />

      {/* Skip buttons only show when a grown-up turns them on (profile menu). Back only after the first scene. */}
      {skip && (
        <IconButton
          icon="chevron-right"
          label="Skip to the next scene"
          size="md"
          onPress={() => next()}
          style={{ position: 'absolute', top: Math.max(insets.top, 16), right: Math.max(insets.right, 16) }}
        />
      )}
      {skip && index > 0 && (
        <IconButton
          icon="chevron-left"
          label="Back to the last scene"
          size="md"
          onPress={() => goTo(index - 1)}
          style={{ position: 'absolute', top: Math.max(insets.top, 16), left: Math.max(insets.left, 16) }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1, overflow: 'hidden', backgroundColor: colors.ink },
});
