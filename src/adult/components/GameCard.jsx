import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import CoverImage from '../../shared/components/CoverImage.jsx';
import { adult, colors, radius } from '../../shared/theme.js';
import AdultButton from './AdultButton.jsx';
import Chip from './Chip.jsx';
import Eyebrow from './Eyebrow.jsx';

/**
 * A game as an open row above a thin rule: picture, theme, big title, what it's about,
 * and the skills it teaches.
 *   active    is it switched on for this child?
 *   onToggle  if given, shows a quick Activate / Deactivate button (no need to open the game first)
 */
export default function GameCard({ game, active, onPress, onToggle }) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${game.title}. ${game.blurb}`}
        style={({ pressed }) => [{ gap: 16 }, pressed && { opacity: 0.7 }]}
      >
        <Eyebrow color={colors.inkSoft}>
          {game.category}
          {game.comingSoon ? '  ·  Coming soon' : ''}
        </Eyebrow>
        <View style={styles.imageWrap}>
          <CoverImage game={game} large style={styles.image} />
        </View>
        <AppText size={34} weight="extrabold" style={{ lineHeight: 38 }}>
          {game.title}
        </AppText>
        <AppText size={17} color={colors.inkSoft}>
          {game.blurb}
        </AppText>
        <View style={styles.tools}>
          {game.tools.map((tool) => (
            <Chip key={tool} label={tool} tone="neutral" />
          ))}
        </View>
      </Pressable>

      {onToggle && (
        <AdultButton
          variant={active ? 'secondary' : 'positive'}
          onPress={onToggle}
          disabled={game.comingSoon && !active}
          accessibilityLabel={`${active ? 'Deactivate' : 'Activate'} ${game.title}`}
          style={{ alignSelf: 'stretch' }}
        >
          {game.comingSoon && !active ? 'Not available yet' : active ? 'Deactivate' : 'Activate'}
        </AdultButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 20, paddingBottom: 32, borderBottomWidth: 1.5, borderBottomColor: adult.rule },
  imageWrap: { height: 180, borderRadius: radius.lg, overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
  tools: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
