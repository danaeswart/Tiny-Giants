import { useCallback } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { setCurrentChildId, useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useLoad } from '../../shared/hooks/useLoad.js';
import { useProfiles } from '../../shared/hooks/useProfiles.js';
import { getChild, getPlayedGames } from '../../shared/services/api.js';
import { colors } from '../../shared/theme.js';
import AdultScreen from '../components/AdultScreen.jsx';
import ChildTitleDropdown from '../components/ChildTitleDropdown.jsx';
import Eyebrow from '../components/Eyebrow.jsx';
import PlayedGameRow from '../components/PlayedGameRow.jsx';

/** Play together: the games the child has played, with how often they played and finished each. Opens a game for ideas. */
export default function Insights() {
  const childId = useCurrentChildId();
  const { profiles, current } = useProfiles();
  const load = useCallback(() => Promise.all([getChild(childId), getPlayedGames(childId)]), [childId]);
  const { data } = useLoad(load);

  if (!data) return <AdultScreen />;
  const [child, played] = data;
  const name = child?.name ?? 'your child';

  return (
    <AdultScreen>
      <View style={{ gap: 10 }}>
        <Eyebrow>Play together</Eyebrow>
        <ChildTitleDropdown profiles={profiles} current={current} onSelect={setCurrentChildId} />
        <AppText size={17} color={colors.inkSoft}>
          Pick a game to see what it teaches and get ideas for playing it together.
        </AppText>
      </View>
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
