import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import AppText from '../../shared/components/AppText.jsx';
import { setCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useLoad } from '../../shared/hooks/useLoad.js';
import { useProfiles } from '../../shared/hooks/useProfiles.js';
import { getChildGameSettings, getGames, getPlayedGames } from '../../shared/services/api.js';
import { adult, colors } from '../../shared/theme.js';
import AdultScreen from '../components/AdultScreen.jsx';
import AdultButton from '../components/AdultButton.jsx';
import Eyebrow from '../components/Eyebrow.jsx';
import FloatingChildren from '../components/FloatingChildren.jsx';
import FloatingSkills from '../components/FloatingSkills.jsx';
import PlayedGameRow from '../components/PlayedGameRow.jsx';
import GameSummaryRow from '../components/GameSummaryRow.jsx';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';

/**
 * The overview. The top is mostly white space with each child's character floating in it.
 * Tapping a character drops down that child's section: how many games are active, the
 * skills those build, their most recent game, and a couple of new ones to try.
 */
export default function Dashboard() {
  const { profiles } = useProfiles();
  const [selectedId, setSelectedId] = useState(null);
  const load = useCallback(
    async () => {
      const games = await getGames();
      const settings = await Promise.all(profiles.map((p) => getChildGameSettings(p.id)));
      const played = await Promise.all(profiles.map((p) => getPlayedGames(p.id).catch(() => [])));
      return { games, settings, played };
    },
    [profiles],
  );
  const { data } = useLoad(load);

  // Open the Games tab or a game as this child, so those screens show the right child's choices.
  function goTo(childId, path) {
    setCurrentChildId(childId);
    router.push(path);
  }

  return (
    <AdultScreen
      hero={
        <Hero
          light
          title="Let's see what the little ones have been up to"
          aside={
            <FloatingChildren selectedId={selectedId} onSelect={(id) => setSelectedId((cur) => (cur === id ? null : id))}>
              {profiles}
            </FloatingChildren>
          }
        />
      }
    >
      {data
        ? profiles.map((child, i) => {
            if (child.id !== selectedId) return null;
            const enabled = new Set(data.settings[i]?.enabledGameIds ?? []);
            const active = data.games.filter((g) => enabled.has(g.id));
            const skills = [...new Set(active.flatMap((g) => g.tools))];
            const skillCount = skills.length;
            const recent = data.played[i]?.[0];
            const recommended = data.games.filter((g) => !enabled.has(g.id) && !g.comingSoon).slice(0, 2);
            const noun = (n, one, many) => (n === 1 ? one : many);

            return (
              <Animated.View key={child.id} entering={FadeInUp.duration(450)} exiting={FadeOutUp.duration(250)}>
              <Section label={`${child.name}'s games`} stacked>
                <Pressable
                  onPress={() => goTo(child.id, '/adult/games')}
                  accessibilityRole="button"
                  accessibilityLabel={`${child.name} has ${active.length} active ${noun(active.length, 'game', 'games')}. Open the games tab.`}
                  style={({ pressed }) => [styles.count, pressed && { opacity: 0.7 }]}
                >
                  <AppText size={72} weight="bold" color={adult.accent} style={{ lineHeight: 78 }}>
                    {active.length}
                  </AppText>
                  <AppText size={17} color={colors.inkSoft} style={styles.countText}>
                    {noun(active.length, 'game is', 'games are')} active
                    {skillCount > 0 ? `, practising ${skillCount} ${noun(skillCount, 'skill', 'skills')}.` : '.'}
                  </AppText>
                </Pressable>

                <FloatingSkills skills={skills} />

                <AdultButton variant="primary" onPress={() => goTo(child.id, '/adult/games')} style={styles.left}>
                  See all games
                </AdultButton>

                <View style={{ gap: 12 }}>
                  <Eyebrow>Recent games</Eyebrow>
                  {recent ? (
                    <PlayedGameRow entry={recent} onPress={() => goTo(child.id, `/adult/game/${recent.game.id}?from=play`)} />
                  ) : (
                    <AppText size={17} color={colors.inkSoft}>
                      Nothing played yet. When {child.name} plays a story, it shows up here.
                    </AppText>
                  )}
                </View>

                {recommended.length > 0 && (
                  <View style={{ gap: 20 }}>
                    <Eyebrow>Try next for {child.name}</Eyebrow>
                    {recommended.map((game) => (
                      <GameSummaryRow key={game.id} game={game} onPress={() => goTo(child.id, `/adult/game/${game.id}?from=games`)} />
                    ))}
                  </View>
                )}
              </Section>
              </Animated.View>
            );
          })
        : null}
    </AdultScreen>
  );
}

const styles = StyleSheet.create({
  left: { alignSelf: 'flex-start' },
  count: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  countText: { flex: 1 },
});
