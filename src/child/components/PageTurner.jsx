import { useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { colors } from '../../shared/theme.js';

const TURN_MS = 700;
const OPEN_MS = 1000;
const TURN_EASING = Easing.bezier(0.645, 0.045, 0.355, 1);
// A swipe turns the page if it drags this fraction of a turn, or is flicked fast enough.
const SWIPE_FRACTION = 0.2;
const SWIPE_VELOCITY = 500;
// ...but a flick still has to travel a little, so a small wobble never turns a page.
const MIN_FLICK = 0.08;
// Past the first/last spread the gesture only gives a little.
const EDGE_RESISTANCE = 0.15;

const clamp01 = (v) => {
  'worklet';
  return Math.min(Math.max(v, 0), 1);
};

/*
 * An open book showing one spread (two pages) at a time, with the spine in the middle.
 *
 * `position` is a shared value: 2 means spread 2 lies open; 2.5 means the page
 * between spreads 2 and 3 is standing straight up on the spine. That page is a
 * "leaf": its front is spread 2's right page, its back is spread 3's left page.
 * It hinges on the spine, so turning forward carries spread 3's left page over
 * to the left and reveals spread 3's right page underneath, like real paper.
 *
 * Dragging moves `position` directly (the page follows the finger); arrow taps animate it.
 * If `renderCover` is given, the book starts closed and the cover swings open on mount.
 */
export default function PageTurner({
  ref,
  index,
  count,
  pageWidth,
  pageHeight,
  onIndexChange,
  renderPage,
  renderCover,
}) {
  const reduceMotion = useReducedMotion();
  const position = useSharedValue(index);
  const target = useSharedValue(index);
  const dragStart = useSharedValue(index);
  // Which turning leaf is drawn on top: 1 = the next page, -1 = the previous page.
  const turningWay = useSharedValue(1);
  const [onTop, setOnTop] = useState(1);
  const [opened, setOpened] = useState(!renderCover || reduceMotion);
  const opening = useSharedValue(opened ? 1 : 0); // 0 = closed, 1 = open

  // Follow index changes made from outside (e.g. the list of games shrinking).
  useEffect(() => {
    position.set(index);
    target.set(index);
  }, [index, position, target]);

  // Swing the cover open once, when the book first appears.
  useEffect(() => {
    if (opened) return;
    opening.set(
      withDelay(
        300,
        withTiming(1, { duration: OPEN_MS, easing: TURN_EASING }, (finished) => {
          if (finished) scheduleOnRN(setOpened, true);
        }),
      ),
    );
    // Only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const turnTo = useMemo(
    () => (to) => {
      'worklet';
      target.set(to);
      position.set(
        withTiming(to, { duration: reduceMotion ? 0 : TURN_MS, easing: TURN_EASING }, (finished) => {
          if (finished) scheduleOnRN(onIndexChange, to);
        }),
      );
    },
    [reduceMotion, onIndexChange, position, target],
  );

  // Lets the arrow buttons turn pages with the same animation as a swipe.
  useImperativeHandle(ref, () => ({
    turn(direction) {
      if (!opened) return;
      const to = target.get() + direction;
      if (to < 0 || to >= count) return;
      turningWay.set(direction);
      setOnTop(direction);
      turnTo(to);
    },
  }));

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(opened)
        // Small movements stay taps, so the Play button still works.
        .activeOffsetX([-12, 12])
        .failOffsetY([-24, 24])
        .onStart(() => {
          dragStart.set(Math.round(position.get()));
        })
        .onUpdate((e) => {
          const start = dragStart.get();
          const min = Math.max(0, start - 1);
          const max = Math.min(count - 1, start + 1);
          // Dragging from the page edge to the far edge (two page widths) is one full turn.
          let p = start - e.translationX / (2 * pageWidth);
          if (p < min) p = min - (min - p) * EDGE_RESISTANCE;
          if (p > max) p = max + (p - max) * EDGE_RESISTANCE;
          position.set(p);

          const way = p >= start ? 1 : -1;
          if (way !== turningWay.get()) {
            turningWay.set(way);
            scheduleOnRN(setOnTop, way);
          }
        })
        .onEnd((e) => {
          const start = dragStart.get();
          const moved = position.get() - start;
          let to = start;
          if (start < count - 1 && moved > MIN_FLICK && (moved > SWIPE_FRACTION || e.velocityX < -SWIPE_VELOCITY)) {
            to = start + 1;
          } else if (start > 0 && moved < -MIN_FLICK && (moved < -SWIPE_FRACTION || e.velocityX > SWIPE_VELOCITY)) {
            to = start - 1;
          }
          turnTo(to);
        }),
    [opened, count, pageWidth, dragStart, position, turningWay, turnTo],
  );

  // Closed, only the cover (right half) shows, so slide the book to keep it centred.
  const bookStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (opening.get() - 1) * (pageWidth / 2) }],
  }));
  // Nothing on the left until the cover has swung over.
  const leftStackStyle = useAnimatedStyle(() => ({ opacity: opening.get() >= 1 ? 1 : 0 }));

  const hasPrev = index > 0;
  const hasNext = index < count - 1;
  const leaf = { pageWidth, pageHeight };

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[{ width: pageWidth * 2, height: pageHeight }, bookStyle]}>
        {/* Bottom of each stack: what's revealed when a leaf turns away. */}
        <Face active={!hasPrev} style={[styles.left, leftStackStyle]} {...leaf}>
          {renderPage(hasPrev ? index - 1 : index, 'left')}
        </Face>
        <Face active={!hasNext} style={[styles.right]} {...leaf}>
          {renderPage(hasNext ? index + 1 : index, 'right')}
        </Face>

        {hasPrev && (
          <Leaf
            {...leaf}
            progress={position}
            offset={index - 1}
            gate={opening}
            zIndex={onTop === -1 ? 3 : 2}
            front={renderPage(index - 1, 'right')}
            back={renderPage(index, 'left')}
            backActive
          />
        )}
        {hasNext && (
          <Leaf
            {...leaf}
            progress={position}
            offset={index}
            zIndex={onTop === 1 ? 3 : 2}
            front={renderPage(index, 'right')}
            back={renderPage(index + 1, 'left')}
            frontActive
          />
        )}
        {!opened && (
          <Leaf
            {...leaf}
            progress={opening}
            offset={0}
            zIndex={4}
            front={renderCover()}
            back={renderPage(index, 'left')}
          />
        )}

        <View style={[styles.spine, { left: pageWidth - 1 }]} />
      </Animated.View>
    </GestureDetector>
  );
}

/** One page that hinges on the spine: front on the right, back lands on the left. */
function Leaf({ pageWidth, pageHeight, progress, offset, gate, zIndex, front, back, frontActive, backActive }) {
  const leafStyle = useAnimatedStyle(() => {
    const t = clamp01(progress.get() - offset); // 0 = lying on the right, 1 = turned onto the left
    return {
      transform: [
        { perspective: 2400 },
        // Rotate around the leaf's left edge (the spine) instead of its centre.
        { translateX: -pageWidth / 2 },
        { rotateY: `${-180 * t}deg` },
        { translateX: pageWidth / 2 },
      ],
    };
  });
  const frontStyle = useAnimatedStyle(() => ({ opacity: clamp01(progress.get() - offset) < 0.5 ? 1 : 0 }));
  const backStyle = useAnimatedStyle(() => {
    const showing = clamp01(progress.get() - offset) >= 0.5 && (!gate || gate.get() >= 1);
    return { opacity: showing ? 1 : 0 };
  });
  // The page darkens slightly while it's lifted, like it's catching less light.
  const shadeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(clamp01(progress.get() - offset), [0, 0.5, 1], [0, 0.25, 0]),
  }));

  return (
    <Animated.View pointerEvents="box-none" style={[styles.right, { width: pageWidth, height: pageHeight, zIndex }, leafStyle]}>
      <Face active={frontActive} style={[StyleSheet.absoluteFill, frontStyle]}>
        {front}
      </Face>
      {/* Pre-mirrored, so it reads the right way round once the leaf has flipped over. */}
      <Face active={backActive} style={[StyleSheet.absoluteFill, styles.mirrored, backStyle]}>
        {back}
      </Face>
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.shade, shadeStyle]} />
    </Animated.View>
  );
}

/**
 * A page face. Only the faces you can currently see are tappable and read by screen readers.
 * The outer (animated) layer never takes touches itself; the inner plain View switches
 * between touchable and not.
 *
 * Note: on animated views, pointerEvents must be the prop, not a style. On web,
 * Reanimated writes animated views' styles inline and drops style.pointerEvents, so an
 * invisible (opacity 0) face would otherwise sit on top of Play and swallow taps.
 */
function Face({ active, style, pageWidth, pageHeight, children }) {
  return (
    <Animated.View pointerEvents="box-none" style={[pageWidth && { width: pageWidth, height: pageHeight }, style]}>
      <View
        accessibilityElementsHidden={!active}
        importantForAccessibility={active ? 'auto' : 'no-hide-descendants'}
        aria-hidden={!active}
        // 'auto'/'none' rather than 'box-none': react-native-web applies 'none' inline but
        // 'box-none' as a class, so switching none -> box-none left the stale inline 'none'.
        style={[StyleSheet.absoluteFill, { pointerEvents: active ? 'auto' : 'none' }]}
      >
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  left: { position: 'absolute', top: 0, left: 0 },
  right: { position: 'absolute', top: 0, right: 0 },
  mirrored: { transform: [{ scaleX: -1 }] },
  shade: { backgroundColor: colors.ink },
  spine: { position: 'absolute', top: 0, bottom: 0, width: 2, backgroundColor: colors.spine, zIndex: 10, pointerEvents: 'none' },
});
