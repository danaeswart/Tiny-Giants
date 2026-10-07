import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import AppText from '../../shared/components/AppText.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { colors } from '../../shared/theme.js';

export default function RotatePrompt() {
  const rotation = useSharedValue(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    rotation.value = withRepeat(
      withSequence(
        withDelay(500, withTiming(-90, { duration: 800 })),
        withDelay(800, withTiming(0, { duration: 600 })),
      ),
      -1,
    );
  }, [reduceMotion, rotation]);

  const phoneStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rotation.value}deg` }] }));

  return (
    <View style={styles.screen} accessibilityLiveRegion="polite">
      <Animated.View style={phoneStyle}>
        <Icon name="phone" size={112} color={colors.seaDeep} />
      </Animated.View>
      <View style={styles.text}>
        <AppText size={30} weight="extrabold" align="center">
          Turn your phone sideways
        </AppText>
        <AppText size={20} color={colors.inkSoft} align="center">
          The stories open up wide!
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    padding: 32,
    backgroundColor: colors.cream,
  },
  text: { gap: 8, alignItems: 'center' },
});
