import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import Icon from '../../shared/components/Icon.jsx';
import { adult, colors, fonts } from '../../shared/theme.js';

// The four tabs, in order. `name` is the route file in app/adult/(tabs)/.
const TABS = [
  { name: 'index', label: 'Overview', icon: 'home' },
  { name: 'insights', label: 'Play together', icon: 'sparkle' },
  { name: 'games', label: 'Games', icon: 'grid' },
  { name: 'settings', label: 'Profile', icon: 'user' },
];

const AnimatedPath = Animated.createAnimatedComponent(Path);

const BAR_PAD_X = 12;
const LINE_W = 56;
const LINE_H = 14;
const STEPS = 28;
const REST_AMP = 0;
const TRAVEL_AMP = 5.5;

// A sine wave across the line's width, sampled into a polyline. `phase` slides the crests along
// the line; `amp` is how tall they get.
function wavePath(phase, amp) {
  'worklet';
  let d = '';
  for (let i = 0; i <= STEPS; i++) {
    const px = (i / STEPS) * LINE_W;
    const py = LINE_H / 2 + Math.sin((i / STEPS) * Math.PI * 4 + phase) * amp;
    d += `${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  return d;
}

/**
 * Solid tab bar attached to the bottom edge, on the same cream paper as the pages.
 * A flame-coloured wavy line sits under the active link. When the tab changes the line
 * springs across to the new link while its ripples swell and flow, then flattens back to a straight line.
 * Plugged into the router with <Tabs tabBar={...}>.
 */
export default function BottomNav({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const itemW = (width - BAR_PAD_X * 2) / TABS.length;
  const target = BAR_PAD_X + state.index * itemW + (itemW - LINE_W) / 2;
  const x = useSharedValue(target);
  const amp = useSharedValue(REST_AMP);
  const placed = width > 0;

  useEffect(() => {
    x.set(withSpring(target, { damping: 12, stiffness: 90, mass: 1 }));
    amp.set(withSequence(withTiming(TRAVEL_AMP, { duration: 160 }), withTiming(REST_AMP, { duration: 700 })));
  }, [target, x, amp]);

  // The wave's phase is tied to x too, so the crests visibly roll along while the line travels.
  const lineProps = useAnimatedProps(() => ({ d: wavePath(-x.get() * 0.12, amp.get()) }));
  const lineStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
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
            <Icon name={tab.icon} size={22} color={focused ? adult.flame : colors.inkSoft} strokeWidth={focused ? 2.6 : 2} />
            <Text style={[styles.label, focused && styles.labelOn]}>{tab.label}</Text>
          </Pressable>
        );
      })}
      {placed && (
        <Animated.View pointerEvents="none" style={[styles.line, { bottom: Math.max(insets.bottom, 8) - 4 }, lineStyle]}>
          <Svg width={LINE_W} height={LINE_H}>
            <AnimatedPath
              animatedProps={lineProps}
              stroke={adult.flame}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: BAR_PAD_X,
    backgroundColor: adult.bg,
    borderTopWidth: 1,
    borderTopColor: colors.inkFaint,
  },
  item: { flex: 1, minHeight: 64, alignItems: 'center', justifyContent: 'center', gap: 4, paddingBottom: 8 },
  line: { position: 'absolute', left: 0, width: LINE_W, height: LINE_H },
  // Deliberately below the 16px AppText floor: small captions, regular weight until active.
  label: { fontFamily: fonts.regular, fontSize: 12, color: colors.inkSoft },
  labelOn: { fontFamily: fonts.bold, color: colors.ink },
});
