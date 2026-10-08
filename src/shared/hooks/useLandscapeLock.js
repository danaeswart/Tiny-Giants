import { useEffect, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

/**
 * Locks the device's orientation: 'landscape' for child routes, 'portrait' for adult
 * routes (the vertical layout), or null to leave it free. Works on iOS and Android,
 * including Expo Go. On web there's no real lock, so callers use `isPortrait` to show a
 * rotate prompt.
 */
export function useOrientationLock(mode) {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const lock = ScreenOrientation.OrientationLock;
    const request =
      mode === 'landscape'
        ? ScreenOrientation.lockAsync(lock.LANDSCAPE)
        : mode === 'portrait'
          ? ScreenOrientation.lockAsync(lock.PORTRAIT_UP)
          : ScreenOrientation.unlockAsync();
    request.catch(() => {});
  }, [mode]);
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

export default useOrientationLock;
