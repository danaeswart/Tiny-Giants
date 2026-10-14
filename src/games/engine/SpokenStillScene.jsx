import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSettings } from '../../shared/hooks/useSettings.js';
import Captions from './Captions.jsx';
import FitImage from './FitImage.jsx';
import useSpokenLines from './useSpokenLines.js';

const HOLD_AFTER_LAST_LINE = 1500; // ms the picture stays once the last line is read

/**
 * SCENE TYPE: SPOKEN STILL — one picture while a voice reads the lines, then it
 * moves straight on to the next scene (no button to tap).
 *
 *   background  the picture, e.g. require('../assets/images/01b-the-woods.png')
 *   lines       [{ text }] read aloud one after another, shown as captions
 *   captionPosition  'bottom', 'top' or 'top-right'
 *   onDone      from ScenePlayer
 */
export default function SpokenStillScene({ background, lines, captionPosition = 'bottom', onDone }) {
  const { captions } = useSettings();
  const { text, finished } = useSpokenLines(lines);

  useEffect(() => {
    if (!finished) return;
    const t = setTimeout(onDone, HOLD_AFTER_LAST_LINE);
    return () => clearTimeout(t);
  }, [finished, onDone]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <FitImage source={background} />
      <Captions text={text} hidden={!captions} position={captionPosition} />
    </View>
  );
}
