import { Asset } from 'expo-asset';
import { Image } from 'react-native';

/**
 * { width, height } of a bundled image (a require() result), or null if unknown.
 * Image.resolveAssetSource doesn't exist in React Native Web, so go through expo-asset there.
 */
export function imageSize(source) {
  if (!source) return null;
  try {
    const info = typeof source === 'number' ? Asset.fromModule(source) : Image.resolveAssetSource?.(source);
    return info?.width && info?.height ? { width: info.width, height: info.height } : null;
  } catch {
    return null;
  }
}
