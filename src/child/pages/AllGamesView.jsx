import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import CoverImage from '../../shared/components/CoverImage.jsx';
import IconButton from '../../shared/components/IconButton.jsx';
import { useEnabledGames } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { colors, radius } from '../../shared/theme.js';
import ChildMessage from '../components/ChildMessage.jsx';
import ChildScreen from '../components/ChildScreen.jsx';

// Fixed-size cards (not a share of the screen), so one game never balloons to fill the row.
const CARD_WIDTH = 240;
const COVER_HEIGHT = 180; // 4:3, the shape of the cover art
const GAP = 28;

/** Every enabled game at a glance: just the cover and its name, no boxes. */
export default function AllGamesView() {
  const childId = useCurrentChildId();
  const { games, loading } = useEnabledGames(childId);

  if (loading) return <ChildScreen />;
  if (games.length === 0) {
    return <ChildMessage title="No stories here yet">Ask a grown-up to choose some stories for you.</ChildMessage>;
  }

  return (
    <ChildScreen style={{ gap: 28 }}>
      <View style={styles.header}>
        <IconButton icon="home" label="Back to the shelf" onPress={() => router.dismissTo('/child')} />
        <AppText
          size={48}
          weight="extrabold"
          color={colors.white}
          accessibilityRole="header"
          style={{ lineHeight: 52 }}
        >
          All games
        </AppText>
      </View>

      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {games.map((game) => (
          <Pressable
            key={game.id}
            onPress={() => router.push(`/child/games/${game.id}/play`)}
            accessibilityRole="button"
            accessibilityLabel={game.title}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          >
            <View style={styles.coverFrame}>
              <CoverImage game={game} large style={styles.cover} />
            </View>
            <AppText size={24} weight="extrabold" color={colors.white} style={{ lineHeight: 28 }}>
              {game.title}
            </AppText>
          </Pressable>
        ))}
      </ScrollView>
    </ChildScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, paddingBottom: 8 },
  card: { width: CARD_WIDTH, gap: 14 },
  cardPressed: { transform: [{ scale: 0.96 }] },
  coverFrame: {
    width: CARD_WIDTH,
    height: COVER_HEIGHT,
    borderRadius: radius.lg,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
    overflow: 'hidden',
  },
  cover: { width: CARD_WIDTH - 6, height: COVER_HEIGHT - 6 },
});
