import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';

// Blowing on a phone mic sounds like a burst of loud noise, so "blowing" just means
// "the mic got loud". Metering comes in decibels (about -160 = silence, 0 = max).
// These map that to a 0–1 `level`; tweak them after testing on real devices.
const QUIET_DB = -50; // at or below this, level is 0
const LOUD_DB = -8; // at or above this, level is 1
const POLL_MS = 80;

// expo-audio has no metering on web.
const MIC_SUPPORTED = Platform.OS !== 'web';

const RECORDING_OPTIONS = { ...RecordingPresets.LOW_QUALITY, isMeteringEnabled: true };

/**
 * Listens to the microphone while `active` is true.
 *
 * Returns { status, level }:
 *   status  'idle' | 'asking' | 'listening' | 'unavailable'
 *           'unavailable' = permission refused, web, or the mic failed. The game
 *           should carry on without it (the candle blows out by itself).
 *   level   0–1 loudness right now (0 unless listening)
 *
 * Only the loudness is read. The recording itself is never played, kept, or sent.
 */
export function useBlowDetector(active) {
  const recorder = useAudioRecorder(RECORDING_OPTIONS);
  const recorderState = useAudioRecorderState(recorder, POLL_MS);
  // What the mic setup reached: 'asking' until permission is answered and recording starts.
  const [micStatus, setMicStatus] = useState('asking');

  useEffect(() => {
    if (!active || !MIC_SUPPORTED) return;

    let cancelled = false;
    (async () => {
      try {
        const { granted } = await requestRecordingPermissionsAsync();
        if (cancelled) return;
        if (!granted) return setMicStatus('unavailable');

        await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
        await recorder.prepareToRecordAsync();
        if (cancelled) return;
        recorder.record();
        setMicStatus('listening');
      } catch {
        if (!cancelled) setMicStatus('unavailable');
      }
    })();

    return () => {
      cancelled = true;
      setMicStatus('asking');
      stopListening(recorder);
    };
  }, [active, recorder]);

  const status = !active ? 'idle' : !MIC_SUPPORTED ? 'unavailable' : micStatus;

  const db = recorderState.metering;
  const level =
    status === 'listening' && typeof db === 'number'
      ? Math.min(1, Math.max(0, (db - QUIET_DB) / (LOUD_DB - QUIET_DB)))
      : 0;

  return { status, level };
}

async function stopListening(recorder) {
  try {
    if (recorder.isRecording) await recorder.stop();
  } catch {
    // Already released (the scene unmounted first). Nothing to clean up.
  }
  // Put audio back to playback-only, so narration plays through the main speaker again.
  setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }).catch(() => {});
}
