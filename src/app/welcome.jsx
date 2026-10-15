import { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import AvatarImage from '../shared/components/AvatarImage.jsx';
import AppText from '../shared/components/AppText.jsx';
import AdultButton from '../adult/components/AdultButton.jsx';
import { AVATARS } from '../shared/data/avatars.js';
import { colors } from '../shared/theme.js';

const PER_ZONE = 4; // avatars travelling above the text, and the same number below it
const GAP = 16; // clear space kept between the text block and any avatar's path

const rand = (min, max) => min + Math.random() * (max - min);

/**
 * An avatar that drifts slowly across the screen like a slow shooting star: it enters past one
 * edge, bobs and sways as it floats, leaves past the other edge, and comes round again.
 */
function Floater({ avatar, height, width, screenWidth, y, slope, bob, tilt, direction, travel, bobTime, start }) {
  const progress = useSharedValue(start);
  const bobT = useSharedValue(0);

  useEffect(() => {
    // The first leg finishes the journey from the random starting point; after that it loops.
    progress.value = withSequence(
      withTiming(1, { duration: travel * (1 - start), easing: Easing.linear }),
      withRepeat(
        withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: travel, easing: Easing.linear })),
        -1,
      ),
    );
    bobT.value = withDelay(
      rand(0, 1000),
      withRepeat(withTiming(1, { duration: bobTime, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
  }, [progress, bobT, travel, start, bobTime]);

  const style = useAnimatedStyle(() => {
    const span = screenWidth + width * 2;
    const x = direction > 0 ? -width + span * progress.value : screenWidth + width - span * progress.value;
    return {
      transform: [
        { translateX: x },
        { translateY: slope * progress.value - bob * bobT.value },
        { rotate: `${tilt * (bobT.value * 2 - 1)}deg` },
      ],
    };
  });

  return (
    <Animated.View pointerEvents="none" style={[styles.floater, { top: y }, style]}>
      <AvatarImage avatar={avatar} height={height} />
    </Animated.View>
  );
}

/**
 * Lay out the floaters in lanes above and below the text block (`top`..`bottom`), so none of
 * them ever crosses the text.
 */
function makeFloaters(screenHeight, top, bottom) {
  const zones = [
    { from: 0, to: top - GAP },
    { from: bottom + GAP, to: screenHeight },
  ];
  const floaters = [];
  zones.forEach(({ from, to }, z) => {
    const zoneH = to - from;
    if (zoneH < 60) return;
    const laneH = zoneH / PER_ZONE;
    const lanes = Array.from({ length: PER_ZONE }, (_, i) => i).sort(() => Math.random() - 0.5);
    lanes.forEach((lane, i) => {
      const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
      const height = Math.min(rand(80, 140), laneH * 1.3);
      const bob = rand(6, 14);
      const slope = rand(-laneH * 0.3, laneH * 0.3);
      // Keep the whole path (slope and bob included) inside this zone.
      const lo = from + bob + Math.max(0, -slope);
      const hi = to - height - Math.max(0, slope);
      const centre = from + laneH * (lane + 0.5) - height / 2;
      floaters.push({
        key: `${z}-${i}`,
        avatar: avatar.id,
        height,
        width: height * avatar.ratio,
        y: Math.max(lo, Math.min(hi, centre + rand(-laneH * 0.15, laneH * 0.15))),
        slope,
        bob,
        tilt: rand(3, 8),
        direction: Math.random() < 0.5 ? 1 : -1,
        travel: rand(16000, 28000),
        bobTime: rand(1800, 3200),
        start: rand(0, 1),
      });
    });
  });
  return floaters;
}

/** First screen a signed-out visitor sees. */
export default function Welcome() {
  const { width, height } = useWindowDimensions();
  const [floaters, setFloaters] = useState([]);

  // Once the text block has been measured, send avatars around it (chosen once per visit).
  const placeFloaters = ({ nativeEvent: { layout } }) =>
    setFloaters((current) =>
      current.length ? current : makeFloaters(height, layout.y, layout.y + layout.height),
    );

  return (
    <View style={styles.screen}>
      {floaters.map(({ key, ...f }) => (
        <Floater key={key} screenWidth={width} {...f} />
      ))}

      <View style={styles.card} onLayout={placeFloaters}>
        <AppText size={22} weight="semibold" color={colors.inkSoft} align="center">
          Welcome to
        </AppText>
        <AppText size={48} weight="extrabold" color={colors.ink} align="center" accessibilityRole="header">
          Tiny Giants
        </AppText>
        <AdultButton variant="primary" onPress={() => router.push('/signup')} style={styles.cta}>
          Get started
        </AdultButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  floater: { position: 'absolute', left: 0 },
  card: { alignItems: 'center', gap: 16, paddingHorizontal: 32 },
  cta: { alignSelf: 'stretch', minHeight: 56, marginTop: 8 },
});
