import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import AvatarImage from '../../shared/components/AvatarImage.jsx';
import { AVATARS } from '../../shared/data/avatars.js';

const COUNT = 8; // avatars falling at once (each character appears twice)
const lerp = (min, max, t) => min + t * (max - min);

/**
 * An avatar that drifts slowly down through the area like the ones on the welcome screen: it
 * enters past the top, sways as it floats, leaves past the bottom, and comes round again.
 */
function Floater({ avatar, height, width, areaHeight, x, sway, tilt, travel, swayTime, start }) {
  const progress = useSharedValue(start);
  const swayT = useSharedValue(0);

  useEffect(() => {
    // The first leg finishes the journey from the random starting point; after that it loops.
    progress.set(
      withSequence(
        withTiming(1, { duration: travel * (1 - start), easing: Easing.linear }),
        withRepeat(
          withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: travel, easing: Easing.linear })),
          -1,
        ),
      ),
    );
    swayT.set(
      withDelay(
        swayTime * 0.4,
        withRepeat(withTiming(1, { duration: swayTime, easing: Easing.inOut(Easing.sin) }), -1, true),
      ),
    );
  }, [progress, swayT, travel, start, swayTime]);

  const style = useAnimatedStyle(() => {
    const span = areaHeight + height * 2;
    return {
      transform: [
        { translateY: -height + span * progress.get() },
        { translateX: sway * (swayT.get() * 2 - 1) },
        { rotate: `${tilt * (swayT.get() * 2 - 1)}deg` },
      ],
    };
  });

  return (
    <Animated.View pointerEvents="none" style={[styles.floater, { left: x - width / 2 }, style]}>
      <AvatarImage avatar={avatar} height={height} />
    </Animated.View>
  );
}

/**
 * The characters floating down through a box (`width` x `height`), spread across lanes and
 * staggered in time so they never pile up. It clips what it draws, so they slip in and out of its edges and nothing leaks
 * over the content beside it.
 */
export default function FloatingAvatars({ width, height }) {
  // Random numbers are drawn once per visit; the layout below only turns them into sizes and places.
  const [dice] = useState(() => {
    const order = Array.from({ length: COUNT }, (_, i) => i).sort(() => Math.random() - 0.5);
    return order.map((lane) => ({
      lane,
      size: Math.random(),
      sway: Math.random(),
      tilt: Math.random(),
      travel: Math.random(),
      swayTime: Math.random(),
      start: Math.random(),
    }));
  });

  const floaters = useMemo(() => {
    if (width < 60 || height < 60) return [];
    const lane = width / COUNT;
    return dice.map((d, i) => {
      const avatar = AVATARS[i % AVATARS.length];
      const h = Math.min(lerp(80, 120, d.size), height * 0.45);
      const w = h * avatar.ratio;
      return {
        key: `${avatar.id}-${i}`,
        avatar: avatar.id,
        height: h,
        width: w,
        x: lane * (d.lane + 0.5),
        sway: lerp(8, 18, d.sway),
        tilt: lerp(3, 8, d.tilt),
        travel: lerp(14000, 24000, d.travel),
        swayTime: lerp(1800, 3200, d.swayTime),
        start: d.start,
      };
    });
  }, [dice, width, height]);

  return (
    <View style={[StyleSheet.absoluteFill, styles.clip]} pointerEvents="none" accessible={false}>
      {floaters.map(({ key, ...f }) => (
        <Floater key={key} areaHeight={height} {...f} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: 'hidden' },
  floater: { position: 'absolute', top: 0 },
});
