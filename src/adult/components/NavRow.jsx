import { Pressable, StyleSheet } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { adult } from '../../shared/theme.js';

/** A full-width row between two hairlines with an arrow on the right, for opening another page. */
export default function NavRow({ children, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.6 }]}
    >
      <AppText size={20} weight="semibold" style={{ flex: 1 }}>
        {children}
      </AppText>
      <Icon name="chevron-right" size={22} color={adult.accent} strokeWidth={2.6} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: adult.rule,
  },
});
