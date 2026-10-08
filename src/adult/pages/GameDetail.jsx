import { useCallback, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import CoverImage from '../../shared/components/CoverImage.jsx';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useLoad } from '../../shared/hooks/useLoad.js';
import { getChildGameSettings, getGameById, getInsightsForGame, toggleGameActive } from '../../shared/services/api.js';
import { colors, radius } from '../../shared/theme.js';
import AdultButton from '../components/AdultButton.jsx';
import AdultScreen from '../components/AdultScreen.jsx';
import BackBar from '../components/BackBar.jsx';
import Chip from '../components/Chip.jsx';
import Eyebrow from '../components/Eyebrow.jsx';
import Hero from '../components/Hero.jsx';
import InsightCard from '../components/InsightCard.jsx';
import Section from '../components/Section.jsx';

/**
 * One game in full. Reached from the Games list (with an Activate / Deactivate button) or
 * from an insight (with a way back to it). Recent insights for the game are listed either way.
 */
export default function GameDetail() {
  const { gameId, from } = useLocalSearchParams();
  const childId = useCurrentChildId();
  const load = useCallback(
    () => Promise.all([getGameById(gameId), getChildGameSettings(childId), getInsightsForGame(childId, gameId)]),
    [gameId, childId],
  );
  const { data, loading } = useLoad(load);
  const [override, setOverride] = useState(null);
  const [notice, setNotice] = useState('');

  if (loading) return <AdultScreen withNav={false} />;
  const [game, settings, insights] = data ?? [];
  if (!game) {
    return (
      <AdultScreen withNav={false}>
        <BackBar />
        <AppText size={20} weight="bold">
          We could not find that game.
        </AppText>
      </AdultScreen>
    );
  }

  const active = override ?? settings.enabledGameIds.includes(game.id);
  const fromInsight = from === 'insight';

  async function toggle() {
    const next = !active;
    setOverride(next);
    setNotice('');
    try {
      await toggleGameActive(childId, game.id);
    } catch (error) {
      setOverride(!next);
      setNotice(error.message);
    }
  }

  return (
    <AdultScreen
      withNav={false}
      hero={
        <Hero
          top={<BackBar label={fromInsight ? 'Insight' : 'Games'} onDark />}
          eyebrow={game.category + (game.comingSoon ? ' · Coming soon' : active ? ' · Active' : '')}
          title={game.title}
        />
      }
    >
      <View style={styles.cover}>
        <CoverImage game={game} style={{ width: '100%', height: '100%' }} />
      </View>

      <AppText size={22} weight="semibold" style={{ lineHeight: 30 }}>
        {game.parentNote}
      </AppText>

      <Section label="Teaches">
        <AppText size={18}>{game.teaches}</AppText>
      </Section>

      <Section label="Tools">
        <View style={styles.chips}>
          {game.tools.map((tool) => (
            <Chip key={tool} label={tool} />
          ))}
        </View>
      </Section>

      {fromInsight ? (
        <AdultButton variant="primary" onPress={() => router.back()} style={{ alignSelf: 'stretch' }}>
          Back to this insight
        </AdultButton>
      ) : (
        <View style={{ gap: 16 }}>
          <AdultButton
            variant={active ? 'secondary' : 'primary'}
            onPress={toggle}
            disabled={game.comingSoon && !active}
            style={{ alignSelf: 'stretch' }}
          >
            {game.comingSoon && !active ? 'Not available yet' : active ? 'Deactivate' : 'Activate'}
          </AdultButton>
          {notice ? (
            <AppText size={16} color={colors.inkSoft} accessibilityLiveRegion="polite">
              {notice}
            </AppText>
          ) : null}
        </View>
      )}

      {insights.length > 0 && (
        <View style={{ gap: 32 }}>
          <Eyebrow>Recent insights</Eyebrow>
          {insights.slice(0, 3).map((insight) => (
            <InsightCard key={insight.id} insight={insight} compact onPress={() => router.push(`/adult/insight/${insight.id}`)} />
          ))}
        </View>
      )}
    </AdultScreen>
  );
}

const styles = StyleSheet.create({
  cover: { height: 220, borderRadius: radius.lg, overflow: 'hidden' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
