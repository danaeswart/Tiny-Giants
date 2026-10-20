import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Captions from './Captions.jsx';
import FitImage from './FitImage.jsx';
import useSpokenLines from './useSpokenLines.js';

/**
 * SCENE TYPE: ZOOM STILL — one picture that slowly zooms in while a voice reads the
 * lines, then it moves straight on to the next scene (no button to tap).
 *
 *   background  the picture
 *   lines       [{ text }] shown as captions during the zoom
 *   seconds     how long the zoom lasts; the scene waits for the lines if they take longer
 *   zoom        how far it ends up zoomed, 1.15 = 15% closer
 *   onDone      from ScenePlayer
 */
export default function ZoomStillScene({ background, lines = [], seconds = 3, zoom = 1.15, onDone }) {
  const { text, finished } = useSpokenLines(lines);
  const [zoomed, setZoomed] = useState(false);
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.set(withTiming(zoom, { duration: seconds * 1000, easing: Easing.linear }));
    const t = setTimeout(() => setZoomed(true), seconds * 1000);
    return () => clearTimeout(t);
  }, [scale, zoom, seconds]);

  const done = zoomed && finished;
  useEffect(() => {
    if (done) onDone();
  }, [done, onDone]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, style]}>
        <FitImage source={background} />
      </Animated.View>
      <Captions text={finished ? null : text} />
    </View>
  );
}
