import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import IconButton from '../../shared/components/IconButton.jsx';
import { useEnabledGame } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { colors, radius } from '../../shared/theme.js';
import ChildMessage from '../components/ChildMessage.jsx';
import ChildScreen from '../components/ChildScreen.jsx';

/** Stub: each game's real implementation will load here. */
export default function GamePlaceholder() {
  const { gameId } = useLocalSearchParams();
  const childId = useCurrentChildId();
  const { game, loading } = useEnabledGame(childId, gameId);

  if (loading) return <ChildScreen />;
  if (!game) return <ChildMessage title="This story isn't here right now" />;

  return (
    <ChildScreen style={{ gap: 20 }}>
      <View style={styles.header}>
        <IconButton
          icon="back"
          label="Back to the storybook"
          onPress={() => router.dismissTo(`/child/story?game=${game.id}`)}
        />
        <AppText size={44} weight="extrabold" color={colors.white} accessibilityRole="header" style={{ flexShrink: 1, lineHeight: 48 }}>
          {game.title}
        </AppText>
      </View>
      <View style={styles.stage}>
        <AppText size={24} weight="bold" color={colors.white}>
          The game goes here
        </AppText>
      </View>
    </ChildScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
});
