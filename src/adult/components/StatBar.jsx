import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import AppText from '../../shared/components/AppText.jsx';
import { colors } from '../../shared/theme.js';

const STUB = 4; // an empty day still shows a small stub, so the row reads as a chart

/**
 * A simple bar chart whose bars grow up one after another when it appears.
 *   data    [{ label, value, highlight? }]: the highlighted bar (e.g. today) is the strong colour
 *   unit    spoken before the values for screen readers (e.g. "Minutes played each day")
 */
export default function StatBar({ data, height = 200, unit = '' }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const summary = data.map((d) => `${d.label} ${d.value}`).join(', ');

  return (
    <View style={styles.row} accessible accessibilityLabel={`${unit}: ${summary}`}>
      {data.map((d, i) => (
        <Bar key={d.label + i} item={d} fraction={d.value / max} height={height} delay={i * 70} />
      ))}
    </View>
  );
}

function Bar({ item, fraction, height, delay }) {
  const grow = useSharedValue(0);

  useEffect(() => {
    grow.set(withDelay(delay, withTiming(fraction, { duration: 700, easing: Easing.out(Easing.cubic) })));
  }, [fraction, delay, grow]);

  const barStyle = useAnimatedStyle(() => ({ height: STUB + grow.get() * (height - STUB) }));

  return (
    <View style={styles.column}>
      <View style={{ height: height + 24, justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>
        {item.value > 0 && (
          <AppText size={16} weight="semibold" color={colors.inkSoft}>
            {item.value}
          </AppText>
        )}
        <Animated.View style={[styles.bar, { backgroundColor: item.highlight ? colors.flame : '#ffd3bd' }, barStyle]} />
      </View>
      <AppText
        size={16}
        weight={item.highlight ? 'bold' : 'regular'}
        color={item.highlight ? colors.ink : colors.inkSoft}
      >
        {item.label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  column: { flex: 1, alignItems: 'center', gap: 6 },
  bar: { width: '80%', maxWidth: 40, borderRadius: 20 },
});
