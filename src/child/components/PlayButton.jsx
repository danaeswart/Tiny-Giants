import { Pressable, StyleSheet } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { colors, radius } from '../../shared/theme.js';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/** The big Play button on each storybook page. Scales with the book, never below 64px tall. */
export default function PlayButton({ onPress, gameTitle, bookHeight }) {
  const height = clamp(bookHeight * 0.24, 64, 96);
  const fontSize = clamp(bookHeight * 0.09, 24, 36);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Play ${gameTitle}`}
      hitSlop={10}
      style={({ pressed }) => [
        styles.button,
        {
          height,
          paddingHorizontal: height * 0.45,
          borderBottomWidth: pressed ? 2 : 6,
          transform: [{ translateY: pressed ? 4 : 0 }],
        },
      ]}
    >
      <Icon name="play" size={fontSize * 1.1} color={colors.ink} />
      <AppText size={fontSize} weight="extrabold">
        Play
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: radius.pill,
    backgroundColor: colors.sun,
    borderBottomColor: colors.sunDeep,
  },
});
