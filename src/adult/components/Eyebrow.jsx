import { Text } from 'react-native';
import { colors, fonts } from '../../shared/theme.js';

/** Tiny monospace caps label ("THE GAP", "AGE"). Deliberately small: it is a signpost, not content. */
export default function Eyebrow({ children, color = colors.inkSoft, style }) {
  return (
    <Text
      maxFontSizeMultiplier={1.3}
      style={[{ fontFamily: fonts.mono, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', color }, style]}
    >
      {children}
    </Text>
  );
}
