import { useCallback } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useLoad } from '../../shared/hooks/useLoad.js';
import { getChild, getPlayedGames } from '../../shared/services/api.js';
import { colors } from '../../shared/theme.js';
import AdultScreen from '../components/AdultScreen.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PlayedGameRow from '../components/PlayedGameRow.jsx';

/** Play together: the games the child has played, with how often they played and finished each. Opens a game for ideas. */
export default function Insights() {
  const childId = useCurrentChildId();
  const load = useCallback(() => Promise.all([getChild(childId), getPlayedGames(childId)]), [childId]);
  const { data } = useLoad(load);

  if (!data) return <AdultScreen />;
  const [child, played] = data;
  const name = child?.name ?? 'your child';

  return (
    <AdultScreen>
      <PageHeader eyebrow="Play together" title={`${name}'s games`} subtitle="Pick a game to see what it teaches and get ideas for playing it together." />
      {played.length === 0 ? (
        <AppText size={17} color={colors.inkSoft}>
          No games played yet. When {name} plays a story, it shows up here with ideas for playing it together.
        </AppText>
      ) : (
        <View style={{ gap: 20 }}>
          {played.map((entry) => (
            <PlayedGameRow key={entry.game.id} entry={entry} onPress={() => router.push(`/adult/game/${entry.game.id}?from=play`)} />
          ))}
        </View>
      )}
    </AdultScreen>
  );
}
