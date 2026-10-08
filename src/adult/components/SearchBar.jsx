import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Icon from '../../shared/components/Icon.jsx';
import { adult, colors, fonts, radius } from '../../shared/theme.js';

/** Search field for the grown-up side: rounded, with a clear button once there's text. */
export default function SearchBar({ value, onChangeText, placeholder = 'Search games' }) {
  return (
    <View style={styles.wrap}>
      <Icon name="search" size={22} color={colors.inkSoft} strokeWidth={2.2} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkSoft}
        accessibilityLabel={placeholder}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        style={styles.input}
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={10}
          style={styles.clear}
        >
          <Icon name="close" size={18} color={colors.inkSoft} strokeWidth={2.4} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 56,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: adult.rule,
  },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 17, color: colors.ink, paddingVertical: 10, outlineStyle: 'none' },
  clear: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: adult.accentSoft },
});
