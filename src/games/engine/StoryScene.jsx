import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Narration from './Narration.jsx';
import NextButton from './NextButton.jsx';

/**
 * SCENE TYPE: STORY — a picture with text read aloud.
 *
 *   background  a finished image, e.g. require('../assets/images/00-intro.png')
 *   Art         OR a component that draws the scene in code (placeholder art, or a
 *               scene with simple animation). Ignored when `background` is set.
 *   audio       narration recording, or null (captions then use estimated timing)
 *   lines       [{ text, at? }] read-along captions (see engine/timing.js)
 *   onDone      from ScenePlayer: moves to the next scene
 *
 * When the narration finishes, the Next arrow appears. The child taps it to move
 * on, so nobody is rushed off a page.
 */
export default function StoryScene({ background, Art, audio = null, lines, onDone, nextLabel }) {
  const [finished, setFinished] = useState(false);

  return (
    <View style={StyleSheet.absoluteFill}>
      {background ? (
        <Image source={background} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        Art && <Art />
      )}
      <Narration audio={audio} lines={lines} onEnd={() => setFinished(true)} />
      {finished && <NextButton onPress={onDone} label={nextLabel} />}
    </View>
  );
}
