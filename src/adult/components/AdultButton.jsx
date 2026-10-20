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
  trailingIcon,
  block = false,
  variant = 'secondary',
  onPress,
  disabled = false,
  accessibilityLabel,
  style,
}) {
  const primary = variant === 'primary';
  const positive = variant === 'positive'; // the kids' neon green, for "Activate"
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
        primary ? styles.primary : positive ? styles.positive : styles.secondary,
        block && styles.block,
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
      {trailingIcon && <Icon name={trailingIcon} size={20} color={fg} strokeWidth={2.2} />}
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
  // Full-width bar: icon and label centred together.
  block: { alignSelf: 'stretch', minHeight: 56, paddingHorizontal: 20 },
  primary: { backgroundColor: adult.accent, borderColor: adult.accent },
  // Same neon green as the child side's "All games" button (shared/components/Button.jsx).
  positive: { backgroundColor: adult.lime, borderColor: '#9db815' },
  secondary: { borderColor: 'rgba(36, 20, 71, 0.3)' },
});
