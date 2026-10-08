import { useState } from 'react';
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

const MIN_CARD_WIDTH = 220;
const GAP = 28;

/** Every enabled game at a glance: just the cover and its name, no boxes. */
export default function AllGamesView() {
  const childId = useCurrentChildId();
  const { games, loading } = useEnabledGames(childId);
  const [width, setWidth] = useState(0);

  if (loading) return <ChildScreen />;
  if (games.length === 0) {
    return <ChildMessage title="No stories here yet">Ask a grown-up to choose some stories for you.</ChildMessage>;
  }

  const columns = Math.max(1, Math.floor((width + GAP) / (MIN_CARD_WIDTH + GAP)));
  const cardWidth = width ? (width - GAP * (columns - 1)) / columns : 0;

  return (
    <ChildScreen style={{ gap: 28 }}>
      <View style={styles.header}>
        <IconButton icon="home" label="Back to the shelf" onPress={() => router.dismissTo('/child')} />
        <AppText size={48} weight="extrabold" color={colors.white} accessibilityRole="header" style={{ lineHeight: 52 }}>
          All games
        </AppText>
      </View>

      <ScrollView
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {cardWidth > 0 &&
          games.map((game) => (
            <Pressable
              key={game.id}
              onPress={() => router.push(`/child/games/${game.id}`)}
              accessibilityRole="button"
              accessibilityLabel={game.title}
              style={({ pressed }) => [styles.card, { width: cardWidth }, pressed && styles.cardPressed]}
            >
              <CoverImage game={game} style={styles.cover} />
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
  card: { gap: 14 },
  cardPressed: { transform: [{ scale: 0.96 }] },
  cover: { width: '100%', aspectRatio: 4 / 3, borderRadius: radius.lg, borderWidth: 3, borderColor: 'rgba(255,255,255,0.9)' },
});
