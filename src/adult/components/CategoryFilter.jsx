import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import AppText from '../../shared/components/AppText.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { adult, radius } from '../../shared/theme.js';
import Pill from './Pill.jsx';

export const ALL = 'All';

const GAP = 12;
const DURATION = 300;
const EASING = Easing.bezier(0.4, 0, 0.2, 1);

/**
 * Theme filter: a "View categories" button that opens the theme pills ("All", then one per
 * category) beneath it, pushing the page down to make room. "All" is selected to begin with.
 * The pills wrap onto as many lines as they need; the choice is shown on the button when closed.
 */
export default function CategoryFilter({ categories, value, onChange }) {
  const [open, setOpen] = useState(false);
  const progress = useSharedValue(0);
  const panelHeight = useSharedValue(0);

  useEffect(() => {
    progress.set(withTiming(open ? 1 : 0, { duration: DURATION, easing: EASING }));
  }, [open, progress]);

  const chevronStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${progress.get() * 180}deg` }] }));
  const dropStyle = useAnimatedStyle(() => ({
    height: progress.get() * panelHeight.get(),
    marginTop: progress.get() * GAP,
    opacity: progress.get(),
  }));

  return (
    <View>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`View categories. Showing ${value}.`}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}
      >
        <AppText size={16} weight="bold">
          View categories
        </AppText>
        <View style={styles.right}>
          {value !== ALL ? (
            <AppText size={16} weight="bold" color={adult.accent}>
              {value}
            </AppText>
          ) : null}
          <Animated.View style={chevronStyle}>
            <Icon name="chevron-down" size={20} color={adult.accent} strokeWidth={2.4} />
          </Animated.View>
        </View>
      </Pressable>

      {/* Always laid out (so its height is known) but clipped to nothing while closed. */}
      <Animated.View
        style={[styles.drop, dropStyle]}
        pointerEvents={open ? 'auto' : 'none'}
        importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}
        accessibilityElementsHidden={!open}
      >
        <View style={styles.panel} onLayout={(e) => panelHeight.set(e.nativeEvent.layout.height)}>
          {[ALL, ...categories].map((category) => (
            <Pill key={category} label={category} selected={value === category} onPress={() => onChange(category)} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: 'rgba(36, 20, 71, 0.3)',
  },
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  // Clips the panel to the animated height; the panel keeps its natural size, pinned to the top.
  drop: { overflow: 'hidden' },
  panel: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
