import { StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { adult, radius } from '../../shared/theme.js';

// Outline-only tags: a coloured border and text, no fill.
const TONES = {
  accent: { border: adult.accent, fg: adult.accent },
  leaf: { border: adult.leaf, fg: adult.leaf },
  warm: { border: adult.flame, fg: adult.warm },
  neutral: { border: adult.rule, fg: '#4a4553' },
};

/** A small outlined tag: a category, a status, or a skill a game teaches. */
export default function Chip({ label, tone = 'accent' }) {
  const { border, fg } = TONES[tone];
  return (
    <View style={[styles.chip, { borderColor: border }]}>
      <AppText size={16} weight="semibold" color={fg}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: { alignSelf: 'flex-start', paddingVertical: 2, paddingHorizontal: 12, borderRadius: radius.pill, borderWidth: 1.5 },
});
