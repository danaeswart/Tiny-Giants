import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius } from '../theme.js';
import AppText from './AppText.jsx';
import Icon from './Icon.jsx';

const VARIANTS = {
  primary: { bg: '#d7f23a', fg: colors.ink, edge: '#9db815', border: 'transparent' },
  secondary: { bg: colors.white, fg: colors.ink, edge: 'rgba(36, 20, 71, 0.3)', border: 'transparent' },
};

// Every size is at least 56px tall — above the 44–48px platform minimums.
export const BUTTON_SIZES = {
  md: { height: 56, paddingX: 24, font: 18, icon: 22 },
  lg: { height: 64, paddingX: 28, font: 20, icon: 26 },
  xl: { height: 80, paddingX: 36, font: 24, icon: 32 },
};

/**
 * Chunky, pressable pill button. Pass `children` for a text label, `icon` for an
 * icon, or both. Icon-only buttons must pass `accessibilityLabel` (see IconButton).
 */
export default function Button({
  onPress,
  variant = 'primary',
  size = 'lg',
  icon,
  children,
  accessibilityLabel,
  vertical = false,
  style,
  ...rest
}) {
  const v = VARIANTS[variant];
  const s = BUTTON_SIZES[size];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: s.height,
          paddingHorizontal: children ? s.paddingX : 0,
          backgroundColor: v.bg,
          borderColor: v.border,
          flexDirection: vertical ? 'column' : 'row',
          // A solid "edge" under the button that squashes when pressed.
          borderBottomWidth: pressed ? 2 : 5,
          borderBottomColor: v.edge,
          transform: [{ translateY: pressed ? 3 : 0 }],
        },
        style,
      ]}
      {...rest}
    >
      {icon && (
        <View>
          <Icon name={icon} size={vertical ? s.icon * 1.4 : s.icon} color={v.fg} />
        </View>
      )}
      {children != null && (
        <AppText size={s.font} weight="extrabold" color={v.fg} align="center">
          {children}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: radius.pill,
    borderWidth: 2,
  },
});
