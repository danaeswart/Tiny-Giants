import { Image, View } from 'react-native';
import { getAvatar } from '../data/avatars.js';
import Icon from './Icon.jsx';
import { colors } from '../theme.js';

/**
 * A child's character drawn as itself (no circle), fitted into a `height`-tall box.
 * Falls back to a person icon when no character has been picked. Decorative: whatever
 * wraps it carries the accessible label.
 */
export default function AvatarImage({ avatar, height = 120 }) {
  const found = getAvatar(avatar);
  if (!found) {
    return (
      <View style={{ height, width: height * 0.7, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="user" size={height * 0.5} color={colors.ink} strokeWidth={2.2} />
      </View>
    );
  }
  return <Image source={found.source} resizeMode="contain" style={{ height, width: height * found.ratio }} />;
}
