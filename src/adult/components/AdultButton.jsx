import { Pressable, StyleSheet } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { adult, colors, radius } from '../../shared/theme.js';

/**
 * Standard-size button for grown-up screens: 44px tall, rounded rectangle, 16px text.
 * (Child screens use the chunky pill Button instead.)
 */
export default function AdultButton({
  children,
  icon,
  variant = 'secondary',
  onPress,
  disabled = false,
  accessibilityLabel,
  style,
}) {
  const primary = variant === 'primary';
  const fg = primary ? colors.white : colors.ink;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        primary ? styles.primary : styles.secondary,
        pressed && { opacity: 0.75 },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {icon && <Icon name={icon} size={20} color={fg} strokeWidth={2.2} />}
      {children != null && (
        <AppText size={16} weight="bold" color={fg}>
          {children}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  primary: { backgroundColor: adult.accent, borderColor: adult.accent },
  secondary: { borderColor: 'rgba(36, 20, 71, 0.3)' },
});
