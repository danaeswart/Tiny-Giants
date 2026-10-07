import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Button from '../../shared/components/Button.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { useEnabledGame } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { colors, radius } from '../../shared/theme.js';
import ChildMessage from '../components/ChildMessage.jsx';
import ChildScreen from '../components/ChildScreen.jsx';

/** A short note for the grown-up nearby, shown before a game starts. */
export default function GameNotice() {
  const { gameId } = useLocalSearchParams();
  const childId = useCurrentChildId();
  const { game, loading } = useEnabledGame(childId, gameId);
  const { width } = useWindowDimensions();

  if (loading) return <ChildScreen />;
  if (!game) return <ChildMessage title="This story isn't here right now" />;

  // Back to wherever the child came from (storybook, grid or search).
  const goBack = () =>
    router.canGoBack() ? router.back() : router.replace(`/child/story?game=${game.id}`);

  const sideWidth = Math.min(Math.max(width * 0.24, 150), 240);

  return (
    <ChildScreen style={styles.row}>
      <ScrollView style={styles.note} contentContainerStyle={styles.noteContent}>
        <View style={styles.label}>
          <Icon name="heart" size={24} color={colors.seaDeep} />
          <AppText size={18} weight="bold" color={colors.seaDeep}>
            A note for the grown-up nearby
          </AppText>
        </View>
        <AppText size={30} weight="extrabold" accessibilityRole="header">
          {game.title}
        </AppText>
        <AppText size={18}>
          <AppText size={18} weight="bold">
            What it helps with:{' '}
          </AppText>
          {game.teaches}
        </AppText>
        <AppText size={18} color={colors.inkSoft} style={styles.relaxed}>
          {game.parentNote}
        </AppText>
        <AppText size={18} style={styles.relaxed}>
          When you’re both ready, your little one can tap{' '}
          <AppText size={18} weight="extrabold">
            Start
          </AppText>
          .
        </AppText>
      </ScrollView>

      <View style={[styles.side, { width: sideWidth }]}>
        <Button variant="secondary" icon="back" onPress={goBack}>
          Back
        </Button>
        <Button
          size="xl"
          icon="play"
          vertical
          onPress={() => router.push(`/child/games/${game.id}/play`)}
          style={styles.start}
        >
          Start
        </Button>
      </View>
    </ChildScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 16 },
  note: {
    flex: 1,
    borderRadius: radius.lg,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.inkFaint,
  },
  noteContent: { padding: 24, gap: 12 },
  label: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  relaxed: { lineHeight: 28 },
  side: { gap: 16 },
  start: { flex: 1, maxHeight: 224, borderRadius: 40 },
});
