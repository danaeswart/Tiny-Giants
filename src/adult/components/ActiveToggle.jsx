import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { adult, colors } from '../../shared/theme.js';
import { FadeLabel, useSelection } from './Pill.jsx';

/**
 * Minimal two-way tab switch: plain labels on a hairline, with an accent underline that
 * slides to the selected one.
 *   options  [{ key, label }, ...], e.g. Active / Add games
 */
export default function ActiveToggle({ options, value, onChange }) {
  const [width, setWidth] = useState(0);
  const segment = width / options.length;
  const index = Math.max(0, options.findIndex((o) => o.key === value));
  const x = useSharedValue(0);

  useEffect(() => {
    x.set(withTiming(index * segment, { duration: 260, easing: Easing.out(Easing.cubic) }));
  }, [index, segment, x]);

  const underline = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));

  return (
    <View style={styles.track} onLayout={(e) => setWidth(e.nativeEvent.layout.width)} accessibilityRole="tablist">
      {options.map((option) => (
        <Segment key={option.key} option={option} selected={option.key === value} onPress={() => onChange(option.key)} />
      ))}
      {width > 0 && <Animated.View style={[styles.underline, { width: segment }, underline]} />}
    </View>
  );
}

function Segment({ option, selected, onPress }) {
  const sel = useSelection(selected);
  return (
    <Pressable onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected }} style={styles.segment}>
      <FadeLabel label={option.label} sel={sel} idleColor={colors.inkSoft} activeColor={adult.accent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderBottomWidth: 1.5, borderBottomColor: adult.rule },
  underline: { position: 'absolute', left: 0, bottom: -1.5, height: 3, backgroundColor: adult.accent },
  segment: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
});
