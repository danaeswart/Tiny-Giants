import { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import ProfileMenu from '../../adult/components/ProfileMenu.jsx';
import AppText from '../../shared/components/AppText.jsx';
import Avatar from '../../shared/components/Avatar.jsx';
import Button from '../../shared/components/Button.jsx';
import { book, PAGE_RATIO } from '../../shared/data/book.js';
import IconButton from '../../shared/components/IconButton.jsx';
import Modal from '../../shared/components/Modal.jsx';
import { useEnabledGames } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useProfiles } from '../../shared/hooks/useProfiles.js';
import { adult, colors, fonts } from '../../shared/theme.js';
import ChildScreen from '../components/ChildScreen.jsx';
import BookCover from '../components/BookCover.jsx';
import BouncingBook from '../components/BouncingBook.jsx';
import SearchBar from '../components/SearchBar.jsx';

/** Child home: a big friendly hello on the left, the one big book to open on the right. */
export default function StorybookShelf() {
  const childId = useCurrentChildId();
  const { games, loading } = useEnabledGames(childId);
  const { current: profile } = useProfiles();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hasGames = games.length > 0;

  function openGame(game) {
    setSearchOpen(false);
    router.push(`/child/games/${game.id}`);
  }

  return (
    <ChildScreen style={{ gap: 16 }}>
      <View style={styles.header}>
        <Pressable
          onPress={() => setMenuOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Profile and settings"
          hitSlop={8}
          style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.92 : 1 }] })}
        >
          <Avatar profile={profile} size={56} />
        </Pressable>
        {hasGames && (
          <View style={styles.actions}>
            <IconButton icon="search" label="Search games" onPress={() => setSearchOpen(true)} />
            <Button variant="secondary" icon="grid" onPress={() => router.push('/child/games')}>
              All games
            </Button>
          </View>
        )}
      </View>

      <View style={styles.main}>
        <View style={styles.hello}>
          <Text style={styles.eyebrow}>TINY GIANTS · STORY TIME</Text>
          <AppText size={72} weight="extrabold" color={colors.white} accessibilityRole="header" style={{ lineHeight: 74 }}>
            {profile?.name ? `Hi, ${profile.name}!` : 'Hi there!'}
          </AppText>
          <View style={styles.sticker}>
            <AppText size={20} weight="bold" color={colors.ink}>
              {hasGames ? 'Tap the book to start a story' : 'No stories here yet'}
            </AppText>
          </View>
        </View>

        <View style={styles.bookSide}>{!loading && (hasGames ? <OpenBook /> : <EmptyShelf />)}</View>
      </View>

      <Modal open={searchOpen} onClose={() => setSearchOpen(false)} title="Find a game" align="top">
        <SearchBar childId={childId} onSelect={openGame} />
      </Modal>
      <ProfileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </ChildScreen>
  );
}

function OpenBook() {
  const { height } = useWindowDimensions();
  const bookHeight = Math.min(height * 0.5, 340);
  const bookWidth = bookHeight * PAGE_RATIO;

  return (
    <Pressable
      onPress={() => router.push('/child/story')}
      accessibilityRole="button"
      accessibilityLabel={`${book.title}. Open the storybook`}
      style={({ pressed }) => [styles.bookButton, { transform: [{ scale: pressed ? 0.95 : 1 }] }]}
    >
      <BouncingBook size={bookHeight}>
          <View style={{ width: bookWidth, height: bookHeight }}>
          {/* Page block peeking out from under the cover */}
          <View style={styles.pages} />
          <View style={styles.cover}>
            <BookCover width={bookWidth} height={bookHeight} />
          </View>
        </View>
      </BouncingBook>
    </Pressable>
  );
}

function EmptyShelf() {
  return (
    <View style={{ gap: 12, maxWidth: 360 }}>
      <AppText size={20} color={colors.white}>
        Ask a grown-up to choose some stories for you.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 32 },
  hello: { flex: 1, gap: 16, paddingLeft: 40 },
  eyebrow: { fontFamily: fonts.mono, fontSize: 13, letterSpacing: 1.6, color: 'rgba(255,255,255,0.8)' },
  sticker: {
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: adult.lime,
    transform: [{ rotate: '-2deg' }],
  },
  bookSide: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bookButton: { alignItems: 'center', padding: 8 },
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
    boxShadow: '0 12px 20px rgba(36, 20, 71, 0.4)',
  },
});
