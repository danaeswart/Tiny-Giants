import { StyleSheet, Text } from 'react-native';
import { colors, fonts, MIN_FONT_SIZE } from '../theme.js';

// The Talina demo font only has letters, so everything else in a display string
// (digits, punctuation) is drawn in the fallback face.
const LETTERS = /([A-Za-z ]+)/;

function displayRuns(text) {
  return text.split(LETTERS).map((run, i) =>
    i % 2 === 1 || run === '' ? (
      run
    ) : (
      <Text key={i} style={{ fontFamily: fonts.fallback }}>
        {run}
      </Text>
    ),
  );
}

/**
 * All text in the app goes through this. It enforces the 16px minimum even if a
 * caller passes a smaller fontSize, and respects the user's system text size
 * (capped so landscape child screens can't overflow).
 */
export default function AppText({ size = 18, weight = 'regular', color = colors.ink, align, style, children, ...rest }) {
  const flat = StyleSheet.flatten(style) ?? {};
  const fontSize = Math.max(flat.fontSize ?? size, MIN_FONT_SIZE);
  const display = weight === 'extrabold';

  return (
    <Text
      maxFontSizeMultiplier={1.4}
      {...rest}
      style={[
        { fontFamily: fonts[weight], color, lineHeight: Math.round(fontSize * 1.3), textAlign: align },
        style,
        { fontSize },
      ]}
    >
      {display && typeof children === 'string' ? displayRuns(children) : children}
    </Text>
  );
}
