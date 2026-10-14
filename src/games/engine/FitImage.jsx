import { Image, StyleSheet, View } from 'react-native';
import { colors } from '../../shared/theme.js';
import { useStage } from './Stage.js';

/**
 * A picture as tall as the screen, at its own proportions: never cropped, stretched or
 * blurred. If the screen is wider than the picture, the spare space at the sides is
 * plain night colour.
 *
 * The size is worked out here and given to the Image as exact pixels, rather than
 * relying on resizeMode, so it looks the same on every device.
 */
export default function FitImage({ source }) {
  const { width, height } = useStage();
  const { width: imgW, height: imgH } = Image.resolveAssetSource(source);
  const fit = Math.min(width / imgW, height / imgH); // whole picture always visible

  return (
    <View style={styles.box}>
      <Image source={source} style={{ width: imgW * fit, height: imgH * fit }} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ink },
});
