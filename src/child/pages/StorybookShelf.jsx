import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Button from '../../shared/components/Button.jsx';
import { book, PAGE_RATIO } from '../../shared/data/book.js';
import IconButton from '../../shared/components/IconButton.jsx';
import Modal from '../../shared/components/Modal.jsx';
import { useEnabledGames } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { colors } from '../../shared/theme.js';
import ChildScreen from '../components/ChildScreen.jsx';
import BookCover from '../components/BookCover.jsx';
import SearchBar from '../components/SearchBar.jsx';

/** Child home: one big book to open, plus two quiet secondary actions. */
export default function StorybookShelf() {
  const childId = useCurrentChildId();
  const { games, loading } = useEnabledGames(childId);
  const [searchOpen, setSearchOpen] = useState(false);
  const hasGames = games.length > 0;

  function openGame(game) {
    setSearchOpen(false);
    router.push(`/child/games/${game.id}`);
  }

  return (
    <ChildScreen style={{ gap: 8 }}>
      <View style={styles.header}>
        <AppText size={28} weight="extrabold" color={colors.seaDeep} accessibilityRole="header">
          Tiny Giants
        </AppText>
        {hasGames && (
          <View style={styles.actions}>
            <IconButton icon="search" label="Search games" onPress={() => setSearchOpen(true)} />
            <Button variant="secondary" icon="grid" onPress={() => router.push('/child/games')}>
              All games
            </Button>
          </View>
        )}
      </View>

      <View style={styles.center}>{!loading && (hasGames ? <OpenBook /> : <EmptyShelf />)}</View>

      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="Find a game" align="top">
        <SearchBar childId={childId} onSelect={openGame} />
      </Modal>
    </ChildScreen>
  );
}

function OpenBook() {
  const { height } = useWindowDimensions();
  const bookHeight = Math.min(height * 0.56, 352);
  const bookWidth = bookHeight * PAGE_RATIO;

  return (
    <Pressable
      onPress={() => router.push('/child/story')}
      accessibilityRole="button"
      accessibilityLabel={`${book.title}. Open the storybook`}
      style={({ pressed }) => [styles.bookButton, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
    >
      <View style={{ width: bookWidth, height: bookHeight }}>
        {/* Page block peeking out from under the cover */}
        <View style={styles.pages} />
        <View style={styles.cover}>
          <BookCover width={bookWidth} height={bookHeight} />
        </View>
      </View>
      <AppText size={20} weight="bold" color={colors.inkSoft}>
        Tap the book to open it
      </AppText>
    </Pressable>
  );
}

function EmptyShelf() {
  return (
    <View style={{ alignItems: 'center', gap: 12, maxWidth: 560 }}>
      <AppText size={30} weight="extrabold" align="center">
        No stories here yet
      </AppText>
      <AppText size={20} color={colors.inkSoft} align="center">
        Ask a grown-up to choose some stories for you.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bookButton: { alignItems: 'center', gap: 12, padding: 8 },
  pages: {
    position: 'absolute',
    top: '2%',
    bottom: '2%',
    left: '6%',
    right: '-4%',
    backgroundColor: colors.page,
    borderWidth: 1,
    borderColor: colors.inkFaint,
  },
  cover: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    boxShadow: '0 8px 12px rgba(43, 39, 51, 0.25)',
  },
});
