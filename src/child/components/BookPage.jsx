import { Image, StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { resolveImage } from '../../shared/data/images.js';
import { colors } from '../../shared/theme.js';
import PlayButton from './PlayButton.jsx';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/**
 * One page of a game's spread. The page art (if any) fills the page; a placeholder shows until it has art, and the right page carries the Play button on top.
 */
export default function BookPage({ game, side, width, height, onPlay }) {
  const art = resolveImage(game.pages?.[side]);

  return (
    <View style={[styles.page, { width, height }]}>
      {art ? (
        <Image source={art} resizeMode="cover" accessible={false} style={StyleSheet.absoluteFill} />
      ) : (
        <View style={styles.placeholder}>
          <Icon name="image" size={width * 0.3} color={colors.inkSoft} strokeWidth={2} />
          <AppText size={clamp(height * 0.04, 14, 22)} weight="bold" color={colors.inkSoft}>
            Page image
          </AppText>
        </View>
      )}

      {side === 'left' && (
        <AppText
          size={clamp(height * 0.085, 20, 40)}
          weight="semibold"
          accessibilityRole="header"
          style={[
            styles.title,
            { top: height * 0.11, left: width * 0.14, right: width * 0.08 },
            // The page image carries the title, so keep it for screen readers only.
            styles.visuallyHidden,
          ]}
        >
          {game.title}
        </AppText>
      )}

      {side === 'right' && (
        <View style={[styles.playArea, { bottom: height * 0.1 }]}>
          <PlayButton onPress={onPlay} gameTitle={game.title} bookHeight={height} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { overflow: 'hidden', backgroundColor: colors.page },
  // Uppercase via style (not the string) so screen readers read words, not letters.
  title: { position: 'absolute', textTransform: 'uppercase', letterSpacing: 0.5 },
  visuallyHidden: { opacity: 0 },
  playArea: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  placeholder: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.glowSoft },
});
