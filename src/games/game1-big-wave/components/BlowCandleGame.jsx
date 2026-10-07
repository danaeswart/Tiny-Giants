import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import Captions from '../../engine/Captions.jsx';
import Narration from '../../engine/Narration.jsx';
import NextButton from '../../engine/NextButton.jsx';
import { useStage } from '../../engine/Stage.js';
import { useBlowDetector } from '../../engine/useBlowDetector.js';
import Candle from '../art/Candle.jsx';
import Character from '../art/Character.jsx';

// How it decides the child blew: loudness above BLOW_LEVEL for BLOW_SAMPLES
// readings in a row (each reading is ~80ms, so 3 ≈ a quarter-second puff).
const BLOW_LEVEL = 0.7;
const BLOW_SAMPLES = 3;
// If the mic isn't available, she blows the candle out herself after this long.
const NO_MIC_DELAY_MS = 1500;
// If the mic works but the child doesn't blow (or can't blow hard enough), she
// blows it out herself after this long. The story always carries on.
const WAIT_FOR_BLOW_MS = 9000;

/**
 * MINI-GAME: blow out the candle (shared by scene 03 and scene 10).
 *
 * The flow:
 *   1. intro   she's overwhelmed; narration asks the child to help blow out the candle
 *   2. listen  the mic turns on. The flame leans and shrinks as the child blows, and a
 *              strong enough puff blows it out. No mic (refused, or web)? She blows it
 *              out herself, like a little animation, and the story still goes on.
 *   3. out     the flame goes out, smoke rises, she calms down
 *   4. outro   narration for what she says next, then the Next arrow
 *
 *   Backdrop     background component (placeholder art) behind everything
 *   intro/outro  { audio, lines } for the narration before and after the blow
 */
export default function BlowCandleGame({ Backdrop, intro, outro, onDone }) {
  const { width, height } = useStage();
  const [phase, setPhase] = useState('intro');
  const blow = useSharedValue(0);
  const { status, level } = useBlowDetector(phase === 'listen');
  const strongReadings = useRef(0);

  const blowOut = useCallback(() => {
    setPhase((p) => (p === 'listen' ? 'out' : p));
  }, []);

  // She blows it out herself: the flame wobbles, then goes out.
  const pretendBlow = useCallback(() => {
    blow.set(withSequence(
      withTiming(0.4, { duration: 400 }),
      withTiming(0.2, { duration: 250 }),
      withTiming(1, { duration: 500 }),
    ));
    setTimeout(blowOut, 1150);
  }, [blow, blowOut]);

  // The flame follows the child's breath, and a strong puff blows it out.
  useEffect(() => {
    if (phase !== 'listen' || status !== 'listening') return;
    blow.set(withTiming(level, { duration: 90 }));
    strongReadings.current = level >= BLOW_LEVEL ? strongReadings.current + 1 : 0;
    if (strongReadings.current >= BLOW_SAMPLES) blowOut();
  }, [level, phase, status, blow, blowOut]);

  // Fallbacks so no child gets stuck here.
  useEffect(() => {
    if (phase !== 'listen') return;
    if (status === 'unavailable') {
      const t = setTimeout(pretendBlow, NO_MIC_DELAY_MS);
      return () => clearTimeout(t);
    }
    if (status === 'listening') {
      const t = setTimeout(pretendBlow, WAIT_FOR_BLOW_MS);
      return () => clearTimeout(t);
    }
  }, [phase, status, pretendBlow]);

  // Once it's out: let the smoke drift for a moment, then she speaks again.
  useEffect(() => {
    if (phase !== 'out') return;
    blow.set(withTiming(0, { duration: 300 }));
    const t = setTimeout(() => setPhase('outro'), 1600);
    return () => clearTimeout(t);
  }, [phase, blow]);

  const lit = phase === 'intro' || phase === 'listen';
  const mood = phase === 'intro' ? 'worried' : phase === 'listen' ? 'blowing' : 'calm';

  return (
    <View style={StyleSheet.absoluteFill}>
      {Backdrop && <Backdrop />}

      <View style={[styles.character, { left: width * 0.14, bottom: height * 0.12 }]}>
        <Character size={height * 0.5} mood={mood} candle={null} />
      </View>
      <View style={[styles.candle, { left: width * 0.5, bottom: height * 0.14 }]}>
        <Candle size={height * 0.6} blow={blow} lit={lit} />
      </View>

      {phase === 'intro' && <Narration {...intro} onEnd={() => setPhase('listen')} />}
      {phase === 'listen' && (
        <Captions text={status === 'listening' ? 'Blow on the screen! Big breath… and blow!' : 'Watch me blow it out…'} />
      )}
      {(phase === 'outro' || phase === 'done') && (
        <Narration key="outro" {...outro} onEnd={() => setPhase('done')} />
      )}
      {phase === 'done' && <NextButton onPress={onDone} />}
    </View>
  );
}

const styles = StyleSheet.create({
  character: { position: 'absolute' },
  candle: { position: 'absolute' },
});
