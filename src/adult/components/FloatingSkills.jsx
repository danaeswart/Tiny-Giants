import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import AppText from '../../shared/components/AppText.jsx';
import { skillColors } from '../../shared/theme.js';

function Word({ label, index }) {
  const t = useSharedValue(0);

  // Slow drift; each word has its own pace so they never move together.
  useEffect(() => {
    const duration = 6500 + (index % 4) * 1400;
    t.set(
      withDelay(
        index * 600,
        withRepeat(
          withSequence(
            withTiming(1, { duration, easing: Easing.inOut(Easing.sin) }),
            withTiming(0, { duration, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
        ),
      ),
    );
  }, [t, index]);

  const direction = index % 2 === 0 ? 1 : -1;
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: -10 * direction * (t.get() - 0.5) },
      { translateX: 12 * direction * (t.get() - 0.5) },
    ],
  }));

  return (
    <Animated.View style={[{ marginTop: index % 2 === 0 ? 0 : 8 }, style]}>
      <AppText size={18} weight="semibold" color={skillColors[index % skillColors.length]}>
        {label}
      </AppText>
    </Animated.View>
  );
}

/** The skills a child is practising, as plain coloured words spread across the page, drifting slowly. */
export default function FloatingSkills({ skills }) {
  if (skills.length === 0) return null;
  return (
    <View style={styles.wrap} accessible accessibilityLabel={`Skills: ${skills.join(', ')}`}>
      {skills.map((skill, i) => (
        <Word key={skill} label={skill} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', columnGap: 16, rowGap: 4, paddingVertical: 12 },
});
