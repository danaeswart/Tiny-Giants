import { StyleSheet, View } from 'react-native';
import { adult } from '../../shared/theme.js';
import Eyebrow from './Eyebrow.jsx';

/**
 * A page section split from the one above by a thin horizontal rule. The small mono label
 * sits in a narrow column on the left with the content beside it; `stacked` puts the label
 * above instead, for wide content like charts.
 */
export default function Section({ label, stacked = false, children, style }) {
  return (
    <View style={[styles.section, stacked ? styles.stacked : styles.split, style]}>
      {label ? (
        <View style={stacked ? undefined : styles.label}>
          <Eyebrow>{label}</Eyebrow>
        </View>
      ) : null}
      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { borderTopWidth: 1.5, borderTopColor: adult.rule, paddingTop: 20 },
  split: { flexDirection: 'row', gap: 16 },
  stacked: { gap: 20 },
  label: { width: 84, paddingTop: 6 },
  body: { flex: 1, gap: 16 },
});
