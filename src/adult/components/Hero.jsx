import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../shared/components/AppText.jsx';
import { adult, colors, fonts } from '../../shared/theme.js';
import Eyebrow from './Eyebrow.jsx';

/**
 * The electric-blue band at the top of every grown-up page: a mono eyebrow, a huge title,
 * a short line, and an optional lime sticker note. A big flame circle drifts in the corner.
 *   note      { label, text } for the lime sticker
 *   top       something above the eyebrow, e.g. a BackBar
 *   children  extra controls shown inside the band (e.g. the Active / Add games switch)
 */
export default function Hero({ top, eyebrow, title, subtitle, note, children }) {
  const insets = useSafeAreaInsets();
  const breathe = useSharedValue(0);

  useEffect(() => {
    breathe.set(
      withRepeat(
        withSequence(
          withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
      ),
    );
  }, [breathe]);

  const circle = useAnimatedStyle(() => ({
    transform: [{ translateY: -8 * breathe.get() }, { scale: 1 + 0.05 * breathe.get() }],
  }));
  const ring = useAnimatedStyle(() => ({ transform: [{ scale: 1.04 - 0.06 * breathe.get() }] }));

  return (
    <View style={[styles.hero, { paddingTop: Math.max(insets.top, 16) + 20 }]}>
      <Animated.View style={[styles.ring, ring]} />
      <Animated.View style={[styles.circle, circle]} />

      {top}
      {eyebrow ? <Eyebrow color="rgba(255,255,255,0.75)">{eyebrow}</Eyebrow> : null}
      <AppText size={56} weight="extrabold" color={colors.white} accessibilityRole="header" style={{ lineHeight: 60 }}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText size={17} color={colors.white} style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
      {note ? (
        <View style={styles.note}>
          <Eyebrow color={colors.ink}>{note.label}</Eyebrow>
          <Text style={styles.noteText}>{note.text}</Text>
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: adult.hero, paddingHorizontal: 24, paddingBottom: 36, gap: 16, overflow: 'hidden' },
  circle: {
    position: 'absolute',
    top: 24,
    right: -70,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: adult.flame,
    pointerEvents: 'none',
  },
  ring: {
    position: 'absolute',
    top: -10,
    right: -110,
    width: 330,
    height: 330,
    borderRadius: 165,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
    pointerEvents: 'none',
  },
  subtitle: { maxWidth: '78%', opacity: 0.95 },
  note: { alignSelf: 'flex-end', maxWidth: 220, gap: 6, padding: 14, borderRadius: 10, backgroundColor: adult.lime },
  noteText: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 20, color: colors.ink },
});
