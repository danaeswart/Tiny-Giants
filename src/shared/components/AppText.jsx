import { StyleSheet, Text } from 'react-native';
import { colors, fonts, MIN_FONT_SIZE } from '../theme.js';

/**
 * All text in the app goes through this. It enforces the 16px minimum even if a
 * caller passes a smaller fontSize, and respects the user's system text size
 * (capped so landscape child screens can't overflow).
 */
export default function AppText({ size = 18, weight = 'regular', color = colors.ink, align, style, ...rest }) {
  const flat = StyleSheet.flatten(style) ?? {};
  const fontSize = Math.max(flat.fontSize ?? size, MIN_FONT_SIZE);

  return (
    <Text
      maxFontSizeMultiplier={1.4}
      {...rest}
      style={[
        { fontFamily: fonts[weight], color, lineHeight: Math.round(fontSize * 1.3), textAlign: align },
        style,
        { fontSize },
      ]}
    />
  );
}
