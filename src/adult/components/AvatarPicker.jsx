import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import AvatarImage from '../../shared/components/AvatarImage.jsx';
import { AVATARS } from '../../shared/data/avatars.js';
import { adult } from '../../shared/theme.js';

/** A row of characters to choose from. `value` is the chosen avatar id (or null). */
export default function AvatarPicker({ value, onChange, disabled = false }) {
  return (
    <View style={styles.row} accessibilityRole="radiogroup">
      {AVATARS.map((a, i) => {
        const selected = a.id === value;
        return (
          <Pressable
            key={a.id}
            disabled={disabled}
            onPress={() => onChange(a.id)}
            accessibilityRole="radio"
            accessibilityState={{ selected, disabled }}
            accessibilityLabel={`Character ${i + 1}`}
            style={({ pressed }) => [styles.option, selected && styles.selected, pressed && { opacity: 0.7 }]}
          >
            <AvatarImage avatar={a.id} height={120} />
            {selected ? (
              <AppText size={14} weight="bold" color={adult.accent}>
                Chosen
              </AppText>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  option: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: { borderColor: adult.accent, backgroundColor: adult.accentSoft },
});
