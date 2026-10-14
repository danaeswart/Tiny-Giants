import { StyleSheet, TextInput, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { adult, colors, fonts, radius } from '../../shared/theme.js';

/** A labelled text box in the grown-up style. Passes the usual TextInput props through. */
export default function TextField({ label, ...inputProps }) {
  return (
    <View style={{ gap: 6 }}>
      <AppText size={16} weight="semibold" color={colors.inkSoft}>
        {label}
      </AppText>
      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor={colors.switchOff}
        accessibilityLabel={label}
        style={styles.input}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 52,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: adult.rule,
    fontFamily: fonts.regular,
    fontSize: 17,
    color: colors.ink,
    outlineStyle: 'none',
  },
});
