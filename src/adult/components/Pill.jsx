import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import AppText from '../../shared/components/AppText.jsx';
import { adult, colors, radius } from '../../shared/theme.js';

/** 0 → 1 over a fraction of a second whenever `selected` changes, so selections fade instead of snapping. */
export function useSelection(selected) {
  const sel = useSharedValue(selected ? 1 : 0);
  useEffect(() => {
    sel.set(withTiming(selected ? 1 : 0, { duration: 220 }));
  }, [selected, sel]);
  return sel;
}

/** A label that cross-fades between its resting colour and its selected colour (driven by `sel`). */
export function FadeLabel({ label, sel, idleColor = colors.ink, activeColor = colors.white }) {
  const idle = useAnimatedStyle(() => ({ opacity: 1 - sel.get() }));
  const active = useAnimatedStyle(() => ({ opacity: sel.get() }));
  return (
    <View>
      <Animated.View style={idle}>
        <AppText size={16} weight="bold" color={idleColor}>
          {label}
        </AppText>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, active]}>
        <AppText size={16} weight="bold" color={activeColor}>
          {label}
        </AppText>
      </Animated.View>
    </View>
  );
}

/** A rounded filter chip that fills with the accent colour when selected. */
export default function Pill({ label, selected, onPress }) {
  const sel = useSelection(selected);
  const fill = useAnimatedStyle(() => ({ opacity: sel.get() }));

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }} style={styles.pill}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.fill, fill]} />
      <FadeLabel label={label} sel={sel} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    minHeight: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: adult.rule,
    overflow: 'hidden',
  },
  fill: { backgroundColor: adult.accent },
});
