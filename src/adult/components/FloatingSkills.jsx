import { StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { adult } from '../../shared/theme.js';

/**
 * The skills a child is practising, as rounded pills side by side in a line (wrapping onto
 * the next line only if they run out of room). All pills share the one accent colour, with
 * a tinted background.
 */
export default function FloatingSkills({ skills }) {
  if (skills.length === 0) return null;
  return (
    <View style={styles.wrap} accessible accessibilityLabel={`Skills: ${skills.join(', ')}`}>
      {skills.map((skill) => {
        return (
          <View key={skill} style={styles.pill}>
            <AppText size={16} weight="semibold" color={adult.accent}>
              {skill}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: adult.accent,
    backgroundColor: `${adult.accent}1f`,
  },
});
