import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { adult, colors } from '../../shared/theme.js';
import { FadeLabel, useSelection } from './Pill.jsx';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const LINE_H = 14;
const WAVELENGTH = 28;
const TRAVEL_AMP = 1.6;
const STEP_PX = 4;
const SLIDE_MS = 380;

// A sine wave across `width`, sampled into a polyline. `phase` slides the crests along the
// line; `amp` is how tall they get (0 is a straight line).
function wavePath(width, phase, amp) {
  'worklet';
  const steps = Math.max(2, Math.round(width / STEP_PX));
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const px = (i / steps) * width;
    const py = LINE_H / 2 + Math.sin((px / WAVELENGTH) * Math.PI * 2 + phase) * amp;
    d += `${i === 0 ? 'M' : 'L'}${px.toFixed(1)} ${py.toFixed(1)} `;
  }
  return d;
}

/**
 * Minimal two-way tab switch: plain labels on a hairline, with an accent underline that
 * slides to the selected one. While it travels the line ripples, like the bottom nav's line,
 * then settles flat.
 *   options  [{ key, label }, ...], e.g. Active / Add games
 */
export default function ActiveToggle({ options, value, onChange }) {
  const [width, setWidth] = useState(0);
  const segment = width / options.length;
  const index = Math.max(0, options.findIndex((o) => o.key === value));
  // One 0 → 1 progress value drives both the slide and the wiggle, so the wiggle swells
  // mid-journey and is back to a straight line exactly when the line reaches the new link.
  const progress = useSharedValue(1);
  const from = useSharedValue(0);
  const to = useSharedValue(0);
  const x = useDerivedValue(() => from.get() + (to.get() - from.get()) * progress.get());

  useEffect(() => {
    from.set(x.get());
    to.set(index * segment);
    progress.set(0);
    progress.set(withTiming(1, { duration: SLIDE_MS, easing: Easing.inOut(Easing.cubic) }));
  }, [index, segment, from, to, x, progress]);

  // The wave's phase is tied to x so the crests visibly roll along while the line travels.
  const lineProps = useAnimatedProps(() => ({
    d: wavePath(segment, -x.get() * 0.06, TRAVEL_AMP * Math.sin(Math.PI * progress.get())),
  }));
  const underline = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));

  return (
    <View style={styles.track} onLayout={(e) => setWidth(e.nativeEvent.layout.width)} accessibilityRole="tablist">
      {options.map((option) => (
        <Segment key={option.key} option={option} selected={option.key === value} onPress={() => onChange(option.key)} />
      ))}
      {width > 0 && (
        <Animated.View pointerEvents="none" style={[styles.underline, { width: segment }, underline]}>
          <Svg width={segment} height={LINE_H}>
            <AnimatedPath
              animatedProps={lineProps}
              stroke={adult.accent}
              strokeWidth={3}
              strokeLinecap="butt"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </Animated.View>
      )}
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
  // Centred on the hairline: half the line's height sits below the track's bottom edge.
  underline: { position: 'absolute', left: 0, bottom: -LINE_H / 2 - 1.5 + 0.75, height: LINE_H },
  segment: { flex: 1, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
});
