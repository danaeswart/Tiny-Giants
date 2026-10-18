import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import AppText from '../../shared/components/AppText.jsx';
import AvatarImage from '../../shared/components/AvatarImage.jsx';
import { adult, colors } from '../../shared/theme.js';

// Each child drifts on its own rhythm so they never move in lockstep.
function Floater({ child, index, height, selected, onSelect }) {
  const t = useSharedValue(0);

  useEffect(() => {
    t.set(
      withDelay(
        index * 700,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 2600 + index * 450, easing: Easing.inOut(Easing.sin) }),
            withTiming(0, { duration: 2600 + index * 450, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
        ),
      ),
    );
  }, [t, index]);

  const direction = index % 2 === 0 ? 1 : -1;
  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: -14 * t.get() },
      { translateX: 8 * direction * t.get() },
      { rotate: `${3 * direction * (t.get() - 0.5)}deg` },
    ],
  }));

  return (
    <Animated.View style={[{ marginTop: index % 2 === 0 ? 0 : 28 }, style]}>
      <Pressable
        onPress={() => onSelect(child.id)}
        accessibilityRole="button"
        accessibilityState={{ selected }}
        accessibilityLabel={`${child.name}. ${selected ? 'Hide' : 'Show'} their games and info.`}
        style={({ pressed }) => [styles.floater, pressed && { opacity: 0.7 }]}
      >
        <AvatarImage avatar={child.avatar} height={height} />
        <AppText
          size={16}
          weight="bold"
          color={adult.accent}
          numberOfLines={1}
          style={[{ maxWidth: height }, selected && styles.selectedName]}
        >
          {child.name}
        </AppText>
      </Pressable>
    </Animated.View>
  );
}

/**
 * The children's characters drifting in the white space of the dashboard intro, each with
 * their name underneath, in a centred row that shrinks as more children are added.
 */
export default function FloatingChildren({ children: kids, selectedId, onSelect }) {
  if (kids.length === 0) return null;
  const height = kids.length <= 2 ? 190 : kids.length === 3 ? 150 : 120;
  return (
    <View>
      <View style={styles.wrap}>
        {kids.map((child, i) => (
          <Floater key={child.id} child={child} index={i} height={height} selected={child.id === selectedId} onSelect={onSelect} />
        ))}
      </View>
      {kids.length > 1 ? (
        <AppText size={16} color={colors.inkSoft} align="center">
          Tap a character to see their info
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-start', gap: 24, paddingTop: 44, paddingBottom: 4 },
  floater: { alignItems: 'center', gap: 4 },
  selectedName: { textDecorationLine: 'underline' },
});
