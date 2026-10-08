import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../shared/components/Icon.jsx';
import { adult, colors, fonts, radius } from '../../shared/theme.js';

// The four tabs, in order. `name` is the route file in app/adult/(tabs)/.
const TABS = [
  { name: 'index', label: 'Dashboard', icon: 'home' },
  { name: 'insights', label: 'Insights', icon: 'chart' },
  { name: 'games', label: 'Games', icon: 'grid' },
  { name: 'settings', label: 'Settings', icon: 'user' },
];

const IDLE = 'rgba(255, 255, 255, 0.6)';
const CIRCLE = 44;
// Outer gutter + bar padding always sum to 52, so the bar can grow wider without moving the links.
const WRAP_PAD_X = 16;
const BAR_PAD_X = 36;
const BAR_PAD_Y = 8;

/**
 * Floating, rounded tab bar in Night plum. Each tab is an icon with a small label under it.
 * One flame circle glides along behind the active tab's icon on a gentle spring; the active
 * icon and label turn white and bold. Plugged into the router with <Tabs tabBar={...}>.
 */
export default function BottomNav({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const itemW = (width - BAR_PAD_X * 2) / TABS.length;
  const target = BAR_PAD_X + state.index * itemW + (itemW - CIRCLE) / 2;
  const x = useSharedValue(target);
  const placed = width > 0;

  useEffect(() => {
    // A soft spring: glides in, overshoots a touch, then settles, instead of stopping dead.
    x.set(withSpring(target, { damping: 14, stiffness: 110, mass: 0.9 }));
  }, [target, x]);

  const sweep = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));

  return (
    <View style={[styles.wrap, { bottom: Math.max(insets.bottom, 12) + 8 }]}>
      <View style={styles.bar} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {placed && <Animated.View style={[styles.circle, sweep]} />}
        {state.routes.map((route, i) => {
          const tab = TABS.find((t) => t.name === route.name);
          if (!tab) return null;
          const focused = i === state.index;

          function onPress() {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: focused }}
              style={styles.item}
            >
              <View style={styles.iconWrap}>
                <Icon name={tab.icon} size={22} color={focused ? colors.white : IDLE} strokeWidth={focused ? 2.6 : 2} />
              </View>
              <Text style={[styles.label, focused && styles.labelOn]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, paddingHorizontal: WRAP_PAD_X, pointerEvents: 'box-none' },
  bar: {
    flexDirection: 'row',
    paddingVertical: BAR_PAD_Y,
    paddingHorizontal: BAR_PAD_X,
    borderRadius: radius.pill,
    backgroundColor: adult.nav,
    boxShadow: '0 12px 28px rgba(36, 20, 71, 0.28)',
  },
  item: { flex: 1, minHeight: 64, alignItems: 'center', justifyContent: 'center', gap: 2 },
  iconWrap: { width: CIRCLE, height: CIRCLE, alignItems: 'center', justifyContent: 'center' },
  circle: {
    position: 'absolute',
    top: BAR_PAD_Y,
    left: 0,
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: adult.flame,
  },
  // Deliberately below the 16px AppText floor: small captions, regular weight until active.
  label: { fontFamily: fonts.regular, fontSize: 12, color: IDLE },
  labelOn: { fontFamily: fonts.bold, color: colors.white },
});
