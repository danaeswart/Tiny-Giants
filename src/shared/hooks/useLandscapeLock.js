import { useEffect, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

/**
 * Locks the device to landscape while `enabled` (child routes), and releases it
 * otherwise (adult routes rotate freely). Works on iOS and Android, including Expo Go.
 * On web there's no real lock, so callers use `isPortrait` to show a rotate prompt.
 */
export function useLandscapeLock(enabled) {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const request = enabled
      ? ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
      : ScreenOrientation.unlockAsync();
    request.catch(() => {});
  }, [enabled]);
}

/**
 * True when the screen is taller than it is wide. Waits briefly before
 * reporting portrait, so the moment of rotation right after the lock kicks in
 * doesn't flash the rotate prompt.
 */
export function useIsPortrait(settleMs = 500) {
  const { width, height } = useWindowDimensions();
  const portraitNow = height > width;
  const size = `${width}x${height}`;
  // The screen size that has stayed portrait for settleMs. Any resize restarts the wait.
  const [settledSize, setSettledSize] = useState(null);

  useEffect(() => {
    if (!portraitNow) return;
    const t = setTimeout(() => setSettledSize(size), settleMs);
    return () => clearTimeout(t);
  }, [portraitNow, size, settleMs]);

  return { isPortrait: portraitNow, showRotatePrompt: portraitNow && settledSize === size };
}

export default useLandscapeLock;
