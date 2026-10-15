import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import CoverImage from '../../shared/components/CoverImage.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { adult, colors, radius } from '../../shared/theme.js';
import Eyebrow from './Eyebrow.jsx';

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** A game the child has played: how often, how many times they finished it, and when last. Opens the game. */
export default function PlayedGameRow({ entry, onPress, bare = false }) {
  const { game, plays, completedCount, lastPlayedAt } = entry;
  const last = lastPlayedAt?.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${game.title}. Played ${plural(plays, 'time')}. Open for ideas to play together.`}
      style={({ pressed }) => [styles.row, bare && styles.bare, pressed && { opacity: 0.7 }]}
    >
      <View style={styles.thumb}>
        <CoverImage game={game} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <Eyebrow>{game.category}</Eyebrow>
        <AppText size={20} weight="bold">
          {game.title}
        </AppText>
        <AppText size={16} color={colors.inkSoft}>
          Played {plural(plays, 'time')} · finished {completedCount}
          {last ? ` · last ${last}` : ''}
        </AppText>
      </View>
      <Icon name="play" size={20} color={adult.accent} strokeWidth={2.2} />
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
  // No rule of its own: the section around it draws the rule above its label instead.
  bare: { paddingTop: 0, borderTopWidth: 0 },
  thumb: { width: 72, height: 72, borderRadius: radius.md, overflow: 'hidden' },
});
