import { router, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Button from '../../shared/components/Button.jsx';
import CoverImage from '../../shared/components/CoverImage.jsx';
import IconButton from '../../shared/components/IconButton.jsx';
import { useEnabledGame } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { adult, radius } from '../../shared/theme.js';
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

/** The step between the games grid and a game: its picture (or clip), name and Play. */
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
        <View style={styles.imageFrame}>
          {game.introVideo ? (
            <IntroVideo source={game.introVideo} />
          ) : (
            <CoverImage game={game} large style={StyleSheet.absoluteFill} />
          )}
        </View>

        <View style={styles.info}>
          <AppText size={72} weight="extrabold" color={adult.accent} accessibilityRole="header" style={{ lineHeight: 76 }}>
            {game.title}
          </AppText>
        </View>
      </View>

      <Button
        size="xl"
        icon="play"
        variant="primary"
        onPress={() => router.push(`/child/games/${game.id}/play`)}
        style={styles.play}
      >
        Play
      </Button>
    </ChildScreen>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 32 },
  imageFrame: {
    flex: 1.2,
    aspectRatio: 4 / 3,
    maxHeight: '100%',
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  info: { flex: 1, justifyContent: 'center', paddingBottom: 96 },
  play: { position: 'absolute', right: 32, bottom: 24 },
});
