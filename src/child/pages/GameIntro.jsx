import { router, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Button from '../../shared/components/Button.jsx';
import CoverImage from '../../shared/components/CoverImage.jsx';
import IconButton from '../../shared/components/IconButton.jsx';
import { resolveImage } from '../../shared/data/images.js';
import { useEnabledGame } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { adult, colors, radius } from '../../shared/theme.js';
import ChildMessage from '../components/ChildMessage.jsx';
import ChildScreen from '../components/ChildScreen.jsx';

/** Looping, silent clip for games that have one (games.js `introVideo`). */
function IntroVideo({ source }) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  return <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="cover" nativeControls={false} />;
}

/**
 * The game's large picture, shown whole: measured against its box and sized to the picture's own
 * shape, so it is never cropped or zoomed. Games without art get the generated placeholder cover.
 */
function FullCover({ game }) {
  const [box, setBox] = useState({ width: 0, height: 0 });
  const source = resolveImage(game.image) ?? resolveImage(game.coverImage) ?? resolveImage(game.pages?.left);
  const real = source ? Image.resolveAssetSource(source) : null;
  const ratio = real?.width && real?.height ? real.width / real.height : 4 / 3;
  const width = Math.min(box.width, box.height * ratio);
  const height = width / ratio;

  return (
    <View
      style={styles.imageBox}
      onLayout={({ nativeEvent: { layout } }) => setBox({ width: layout.width, height: layout.height })}
    >
      {width > 0 && (
        <CoverImage game={game} large resizeMode="contain" style={{ width, height, borderRadius: radius.lg }} />
      )}
    </View>
  );
}

/** The step between the games grid and a game: its picture (or clip) on the left, and its name with the Play button under it on the right. */
export default function GameIntro() {
  const { gameId } = useLocalSearchParams();
  const childId = useCurrentChildId();
  const { game, loading } = useEnabledGame(childId, gameId);

  if (loading) return <ChildScreen />;
  if (!game) return <ChildMessage title="This story isn't here right now" />;

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/child/games'));

  return (
    <ChildScreen style={{ gap: 16 }}>
      <View>
        <IconButton icon="back" variant="blue" label="Back to all games" onPress={goBack} />
      </View>

      <View style={styles.main}>
        {game.introVideo ? (
          <View style={styles.imageFrame}>
            <IntroVideo source={game.introVideo} />
          </View>
        ) : (
          <FullCover game={game} />
        )}

        <View style={styles.info}>
          <AppText size={56} weight="extrabold" color={adult.accent} accessibilityRole="header" style={{ lineHeight: 60 }}>
            {game.title}
          </AppText>
          <Button
            size="xl"
            icon="play"
            variant="primary"
            onPress={() => router.push(`/child/games/${game.id}/play`)}
            style={styles.play}
          >
            Play
          </Button>
        </View>
      </View>
    </ChildScreen>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 32 },
  // Holds the picture; FullCover sizes the picture itself to fit inside.
  imageBox: { flex: 1.2, alignSelf: 'stretch', marginBottom: 8, alignItems: 'center', justifyContent: 'center' },
  imageFrame: {
    flex: 1.2,
    alignSelf: 'stretch',
    marginBottom: 8,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.waveSoft,
  },
  info: { flex: 1, justifyContent: 'center', alignItems: 'flex-start', gap: 24 },
  play: { alignSelf: 'flex-start' },
});
