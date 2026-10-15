import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import CoverImage from '../../shared/components/CoverImage.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { adult, colors, radius } from '../../shared/theme.js';
import Eyebrow from './Eyebrow.jsx';

/** A game as a compact row: thumbnail, theme, title and a one-line blurb. Opens the game. */
export default function GameSummaryRow({ game, onPress, bare = false }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${game.title}. ${game.blurb}`}
      style={({ pressed }) => [styles.row, bare && styles.bare, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.thumb}>
        <CoverImage game={game} style={{ width: '100%', height: '100%' }} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Eyebrow>{game.category}</Eyebrow>
        <AppText size={20} weight="bold">
          {game.title}
        </AppText>
        <AppText size={16} color={colors.inkSoft} numberOfLines={2}>
          {game.blurb}
        </AppText>
      </View>
      <Icon name="chevron-right" size={20} color={adult.accent} strokeWidth={2.2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 20,
    borderTopWidth: 1.5,
    borderTopColor: adult.rule,
  },
  bare: { paddingTop: 0, borderTopWidth: 0 },
  thumb: { width: 72, height: 72, borderRadius: radius.md, overflow: 'hidden' },
});
