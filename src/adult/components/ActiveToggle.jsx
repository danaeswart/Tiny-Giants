import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { adult, colors, radius } from '../../shared/theme.js';
import { FadeLabel, useSelection } from './Pill.jsx';

const PADDING = 4;

/**
 * Two-way switch with a lime thumb that slides between the options. Made to sit on the
 * blue hero: a thin white outline, white labels, and ink on the selected one.
 *   options  [{ key, label }, ...], e.g. Active / Add games
 */
export default function ActiveToggle({ options, value, onChange }) {
  const [width, setWidth] = useState(0);
  const segment = (width - PADDING * 2) / options.length;
  const index = Math.max(0, options.findIndex((o) => o.key === value));
  const x = useSharedValue(0);

  useEffect(() => {
    x.set(withTiming(index * segment, { duration: 260, easing: Easing.out(Easing.cubic) }));
  }, [index, segment, x]);

  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));

  return (
    <View style={styles.track} onLayout={(e) => setWidth(e.nativeEvent.layout.width)} accessibilityRole="tablist">
      {width > 0 && <Animated.View style={[styles.thumb, { width: segment }, thumbStyle]} />}
      {options.map((option) => (
        <Segment key={option.key} option={option} selected={option.key === value} onPress={() => onChange(option.key)} />
      ))}
    </View>
  );
}

function Segment({ option, selected, onPress }) {
  const sel = useSelection(selected);
  return (
    <Pressable onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected }} style={styles.segment}>
      <FadeLabel label={option.label} sel={sel} idleColor={colors.white} activeColor={colors.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: PADDING,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  thumb: {
    position: 'absolute',
    top: PADDING,
    bottom: PADDING,
    left: PADDING,
    borderRadius: radius.pill,
    backgroundColor: adult.lime,
  },
  segment: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});
