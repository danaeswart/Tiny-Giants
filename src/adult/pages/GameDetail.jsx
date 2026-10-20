import { useCallback, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import CoverImage from '../../shared/components/CoverImage.jsx';
import Popup from '../../shared/components/Popup.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useLoad } from '../../shared/hooks/useLoad.js';
import { getChild, getChildGameSettings, getGameById, getInsightsForGame, getPlayedGames, toggleGameActive } from '../../shared/services/api.js';
import { adult, colors, radius } from '../../shared/theme.js';
import AdultButton from '../components/AdultButton.jsx';
import AdultScreen from '../components/AdultScreen.jsx';
import BackBar from '../components/BackBar.jsx';
import Chip from '../components/Chip.jsx';
import CoachChat from '../components/CoachChat.jsx';
import Eyebrow from '../components/Eyebrow.jsx';
import InsightCard from '../components/InsightCard.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Section from '../components/Section.jsx';

/**
 * One game in full. Reached from the Games list (with an Activate / Deactivate button) or
 * from an insight (with a way back to it). Recent insights for the game are listed either way.
 */
export default function GameDetail() {
  const { gameId, from } = useLocalSearchParams();
  const childId = useCurrentChildId();
  const load = useCallback(
    () => Promise.all([getGameById(gameId), getChildGameSettings(childId), getInsightsForGame(childId, gameId), getChild(childId), getPlayedGames(childId)]),
    [gameId, childId],
  );
  const { data, loading } = useLoad(load);
  const [override, setOverride] = useState(null);
  const [notice, setNotice] = useState('');
  const [popup, setPopup] = useState(null); // 'activated' | 'deactivate' (asking first)

  if (loading) return <AdultScreen withNav={false} />;
  const [game, settings, insights, child, played] = data ?? [];
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
  const fromPlay = from === 'play';

  async function toggle() {
    const next = !active;
    setOverride(next);
    setNotice('');
    try {
      await toggleGameActive(childId, game.id);
      if (next) setPopup('activated');
    } catch (error) {
      setOverride(!next);
      setNotice(error.message);
    }
  }

  // The full game page (what it teaches, its tools, the description), as reached from the Games tab.
  function openInfo() {
    router.push(`/adult/game/${game.id}?from=info`);
  }

  if (fromPlay) {
    return (
      <AdultScreen withNav={false} gap={16}>
        <BackBar label="More games" />
        <View style={{ gap: 4 }}>
          <Eyebrow>{game.category}</Eyebrow>
          <AppText size={48} weight="extrabold" accessibilityRole="header" style={{ lineHeight: 52 }}>
            {game.title}
          </AppText>
        </View>

        <View style={{ gap: 8, marginBottom: -8 }}>
          <Pressable onPress={openInfo} accessibilityRole="button" accessibilityLabel={`${game.title}. More info.`} style={({ pressed }) => [styles.cover, pressed && { opacity: 0.85 }]}>
            <CoverImage game={game} large style={{ width: '100%', height: '100%' }} />
          </Pressable>
          <Pressable onPress={openInfo} accessibilityRole="button" accessibilityLabel="More info" style={({ pressed }) => [styles.moreInfo, pressed && { opacity: 0.7 }]}>
            <AppText size={17} weight="bold" color={adult.accent}>
              More info
            </AppText>
            <Icon name="chevron-right" size={20} color={adult.accent} strokeWidth={2.4} />
          </Pressable>
        </View>

        {!game.comingSoon && (
          <Section label="Play together" stacked>
            <CoachChat game={game} child={child} plays={played.find((p) => p.game.id === game.id)} />
          </Section>
        )}
      </AdultScreen>
    );
  }

  return (
    <AdultScreen withNav={false}>
      <BackBar label={fromInsight ? 'Insight' : from === 'info' ? 'Back' : 'Games'} />
      {/* PageHeader pads 20px underneath; the negative margin pulls the image up under the title. */}
      <View style={{ marginBottom: -32 }}>
        <PageHeader
          eyebrow={game.category + (game.comingSoon ? ' · Coming soon' : active ? ' · Active' : ' · Inactive')}
          title={game.title}
          rule={false}
        />
      </View>

      <View style={styles.cover}>
        <CoverImage game={game} large style={{ width: '100%', height: '100%' }} />
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

      {!game.comingSoon && (
        <Section label="Play together" stacked>
          <CoachChat game={game} child={child} plays={played.find((p) => p.game.id === game.id)} />
        </Section>
      )}

      {fromInsight ? (
        <AdultButton variant="primary" onPress={() => router.back()} style={{ alignSelf: 'stretch' }}>
          Back to this insight
        </AdultButton>
      ) : (
        <View style={styles.actionRow}>
          <AdultButton
            variant={active ? 'secondary' : 'positive'}
            onPress={active ? () => setPopup('deactivate') : toggle}
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

      <Popup
        open={popup === 'activated'}
        tone="success"
        icon="book"
        title="Game activated"
        message={`${child?.name ?? 'Your child'} can play it now.`}
        confirmLabel="Done"
        onConfirm={() => setPopup(null)}
      />
      <Popup
        open={popup === 'deactivate'}
        tone="confirm"
        icon="book"
        title="Deactivate game?"
        message={`${child?.name ?? 'Your child'} won’t see it until you turn it back on.`}
        confirmLabel="Deactivate"
        cancelLabel="Keep it"
        onConfirm={() => {
          setPopup(null);
          toggle();
        }}
        onCancel={() => setPopup(null)}
      />
    </AdultScreen>
  );
}

const styles = StyleSheet.create({
  cover: { height: 220, borderRadius: radius.lg, overflow: 'hidden' },
  // A flat, square-cornered bar: label on the left, arrow at the edge.
  moreInfo: {
    minHeight: 44,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 0,
  },
  // The Activate / Deactivate button, under a rule like the other sections.
  actionRow: { gap: 16, paddingTop: 20, borderTopWidth: 1.5, borderTopColor: adult.rule },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
