import { useCallback, useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { AccessibilityInfo, Platform, StyleSheet, View } from 'react-native';
import IconButton from '../../shared/components/IconButton.jsx';
import { PAGE_RATIO } from '../../shared/data/book.js';
import { useEnabledGames } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import BookCover from '../components/BookCover.jsx';
import BookPage from '../components/BookPage.jsx';
import ChildMessage from '../components/ChildMessage.jsx';
import ChildScreen from '../components/ChildScreen.jsx';
import PageTurner from '../components/PageTurner.jsx';

// Extra height taken off the book so the swipe cue arrow fits below it while the book stays centred.
const HINT_ROOM = 44;

/**
 * The storybook: an open book, one enabled game per two-page spread. Swipe to turn pages. ?game=<id> opens the book at that game's spread.
 */
export default function StorybookReader() {
  const childId = useCurrentChildId();
  const { games, loading } = useEnabledGames(childId);
  const { game: gameParam } = useLocalSearchParams();
  const [index, setIndex] = useState(null);
  const [area, setArea] = useState(null);
  const turner = useRef(null);

  const requested = games.findIndex((g) => g.id === gameParam);
  const current = Math.min(index ?? Math.max(requested, 0), Math.max(games.length - 1, 0));

  const handleIndexChange = useCallback(
    (i) => {
      setIndex(i);
      if (games[i]) {
        router.setParams({ game: games[i].id });
        AccessibilityInfo.announceForAccessibility(`Page ${i + 1} of ${games.length}: ${games[i].title}`);
      }
    },
    [games],
  );

  // Arrow keys on web / hardware keyboards.
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight') turner.current?.turn(1);
      if (e.key === 'ArrowLeft') turner.current?.turn(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (loading) return <ChildScreen />;
  if (games.length === 0) {
    return <ChildMessage title="No stories here yet">Ask a grown-up to choose some stories for you.</ChildMessage>;
  }

  // Fit the open book (two pages side by side) into the space between the side columns.
  const pageHeight = area ? Math.min(area.height - 8 - HINT_ROOM, (area.width - 8) / (2 * PAGE_RATIO)) : 0;
  const pageWidth = pageHeight * PAGE_RATIO;

  return (
    <ChildScreen style={styles.row}>
      <View style={styles.side}>
        <IconButton icon="home" label="Back to the shelf" onPress={() => router.dismissTo('/child')} />
      </View>

      <View style={styles.bookArea} onLayout={(e) => setArea(e.nativeEvent.layout)}>
        {pageHeight > 0 && (
          <PageTurner
            ref={turner}
            index={current}
            count={games.length}
            pageWidth={pageWidth}
            pageHeight={pageHeight}
            onIndexChange={handleIndexChange}
            renderCover={() => <BookCover width={pageWidth} height={pageHeight} />}
            renderPage={(i, side) => (
              <BookPage
                game={games[i]}
                side={side}
                width={pageWidth}
                height={pageHeight}
                onPlay={() => router.push(`/child/games/${games[i].id}`)}
              />
            )}
          />
        )}
      </View>

      {/* Matches the left column so the book stays centred */}
      <View style={styles.side} />
    </ChildScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  side: { width: 84, alignItems: 'center' },
  bookArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
