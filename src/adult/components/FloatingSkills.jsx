import { StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { skillColors } from '../../shared/theme.js';

/**
 * The skills a child is practising, as rounded pills side by side in a line (wrapping onto
 * the next line only if they run out of room). Each takes the next colour in `skillColors`;
 * the pill's background is that colour at low opacity.
 */
export default function FloatingSkills({ skills }) {
  if (skills.length === 0) return null;
  return (
    <View style={styles.wrap} accessible accessibilityLabel={`Skills: ${skills.join(', ')}`}>
      {skills.map((skill, i) => {
        const color = skillColors[i % skillColors.length];
        return (
          <View key={skill} style={[styles.pill, { borderColor: color, backgroundColor: `${color}1f` }]}>
            <AppText size={16} weight="semibold" color={color}>
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
  pill: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1.5 },
});
