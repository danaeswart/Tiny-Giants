import { Image, StyleSheet, View } from 'react-native';
import { resolveImage } from '../data/images.js';
import { colors } from '../theme.js';
import Icon from './Icon.jsx';

/**
 * A round profile picture. Shows the profile's picture if it has one (profile.avatar is a
 * key from data/images.js), otherwise a friendly person icon. Decorative: whatever
 * wraps it carries the accessible label.
 */
export default function Avatar({ profile, size = 56 }) {
  const source = resolveImage(profile?.avatar);
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      {source ? (
        <Image source={source} style={StyleSheet.absoluteFill} resizeMode="cover" />
      ) : (
        <Icon name="user" size={size * 0.55} color={colors.ink} strokeWidth={2.2} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#d7f23a',
    borderWidth: 3,
    borderColor: colors.white,
    boxShadow: '0 2px 4px rgba(36, 20, 71, 0.25)',
  },
});
