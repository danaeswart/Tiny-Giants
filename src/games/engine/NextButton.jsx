import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconButton from '../../shared/components/IconButton.jsx';

/** Big pulsing "next" arrow in the bottom-right corner. Shown once a scene is ready to move on. */
export default function NextButton({ onPress, label = 'Next' }) {
  const insets = useSafeAreaInsets();
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.set(withRepeat(
      withSequence(withTiming(1.12, { duration: 600 }), withTiming(1, { duration: 600 })),
      -1,
    ));
  }, [pulse]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: pulse.get() }] }));

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.corner,
        { right: Math.max(insets.right, 20), bottom: Math.max(insets.bottom, 20) },
        style,
      ]}
    >
      <IconButton icon="chevron-right" label={label} size="xl" variant="primary" onPress={onPress} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  corner: { position: 'absolute' },
});
