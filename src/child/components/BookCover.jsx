import { Image, StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { book } from '../../shared/data/book.js';
import { resolveImage } from '../../shared/data/images.js';
import { colors } from '../../shared/theme.js';

/** The storybook's front cover: your cover art if set in data/book.js, otherwise an image placeholder. */
export default function BookCover({ width, height }) {
  const art = resolveImage(book.frontCover);

  if (art) {
    return <Image source={art} resizeMode="cover" accessible={false} style={{ width, height }} />;
  }

  return (
    <View style={[styles.cover, { width, height, paddingLeft: width * 0.12 }]}>
      <View style={[styles.spine, { width: width * 0.12 }]} />
      <Icon name="image" size={width * 0.34} color={colors.white} strokeWidth={2} />
      <AppText size={Math.max(14, height * 0.05)} weight="bold" color={colors.white} align="center">
        Cover image
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingRight: 8,
    backgroundColor: colors.sea,
  },
  spine: { position: 'absolute', top: 0, bottom: 0, left: 0, backgroundColor: colors.seaDeep },
});
