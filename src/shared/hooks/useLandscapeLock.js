import { useEffect, useSyncExternalStore } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

/**
 * Locks the device's orientation: 'landscape' for child routes, 'portrait' for adult
 * routes (the vertical layout), or null to leave it free. Works on iOS and Android,
 * including Expo Go. On web there is no real lock, so the layout is shown as is.
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

// Web only: browsers cannot lock the screen (iPhone Safari has no orientation lock at all), so the
// child view turns the whole page a quarter turn when the phone is held upright. While that is on,
// the real window is portrait but the app is drawn landscape.
let turned = false;
const turnedListeners = new Set();
function setTurned(value) {
  if (turned === value) return;
  turned = value;
  turnedListeners.forEach((listener) => listener());
}
const subscribeTurned = (listener) => {
  turnedListeners.add(listener);
  return () => turnedListeners.delete(listener);
};

/**
 * Keeps the page landscape on the web: when the window is taller than it is wide, the page is
 * turned 90 degrees to fill it. Used by the child routes, and undone when leaving them.
 */
export function useForceLandscapeOnWeb() {
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const root = document.documentElement;
    const saved = { width: root.style.width, height: root.style.height, transform: root.style.transform, transformOrigin: root.style.transformOrigin };

    const apply = () => {
      const { innerWidth: w, innerHeight: h } = window;
      if (h > w) {
        root.style.width = h + 'px';
        root.style.height = w + 'px';
        root.style.transformOrigin = 'top left';
        root.style.transform = 'translateX(' + w + 'px) rotate(90deg)';
        setTurned(true);
      } else {
        Object.assign(root.style, saved);
        setTurned(false);
      }
    };

    apply();
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);
    return () => {
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
      Object.assign(root.style, saved);
      setTurned(false);
    };
  }, []);
}

/** The size of the screen as the app sees it: width and height swap while the page is turned. */
export function useViewportSize() {
  const { width, height } = useWindowDimensions();
  const swapped = useSyncExternalStore(subscribeTurned, () => turned, () => false);
  return swapped ? { width: height, height: width } : { width, height };
}

export default useOrientationLock;
