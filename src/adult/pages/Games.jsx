import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useLoad } from '../../shared/hooks/useLoad.js';
import { getChildGameSettings, getGameCategories, getGames, toggleGameActive } from '../../shared/services/api.js';
import { adult, colors } from '../../shared/theme.js';
import ActiveToggle from '../components/ActiveToggle.jsx';
import AdultScreen from '../components/AdultScreen.jsx';
import CategoryFilter, { ALL } from '../components/CategoryFilter.jsx';
import GameCard from '../components/GameCard.jsx';
import Hero from '../components/Hero.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Section from '../components/Section.jsx';

const MODES = [
  { key: 'active', label: 'Active' },
  { key: 'add', label: 'Add games' },
];

/**
 * Browse and manage the game library. The switch at the top picks the view: "Active" is an
 * overview plus only the games the child can play right now; "Add games" has search, themes
 * and every game with an Activate button. Changes apply to the child's own screens immediately.
 */
export default function Games() {
  const childId = useCurrentChildId();
  const load = useCallback(
    () => Promise.all([getGames(), getChildGameSettings(childId), getGameCategories()]),
    [childId],
  );
  const { data } = useLoad(load);

  const [mode, setMode] = useState('active');
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState('');
  // changes made on this screen, shown straight away while they're saved
  const [overrides, setOverrides] = useState({});
  const [notice, setNotice] = useState('');

  if (!data) return <AdultScreen />;
  const [games, settings, categories] = data;

  const serverActive = new Set(settings.enabledGameIds);
  const keyFor = (gameId) => `${childId}:${gameId}`;
  const isActive = (gameId) => (keyFor(gameId) in overrides ? overrides[keyFor(gameId)] : serverActive.has(gameId));

  async function toggle(game) {
    const next = !isActive(game.id);
    setOverrides((o) => ({ ...o, [keyFor(game.id)]: next }));
    setNotice('');
    try {
      await toggleGameActive(childId, game.id);
      setNotice(`${game.title} is now ${next ? 'active' : 'off'}.`);
    } catch (error) {
      setOverrides((o) => ({ ...o, [keyFor(game.id)]: !next }));
      setNotice(error.message);
    }
  }

  const adding = mode === 'add';
  const q = adding ? query.trim().toLowerCase() : '';
  const shown = games.filter(
    (g) =>
      (adding || isActive(g.id)) &&
      (!adding || category === ALL || g.category === category) &&
      (!q || [g.title, g.blurb, g.category, ...g.tools].join(' ').toLowerCase().includes(q)),
  );

  const activeGames = games.filter((g) => isActive(g.id));
  const skillCount = new Set(activeGames.flatMap((g) => g.tools)).size;

  return (
    <AdultScreen
      hero={
        <Hero eyebrow="Library" title="Games" subtitle="Choose which stories your child can play.">
          <ActiveToggle options={MODES} value={mode} onChange={setMode} />
        </Hero>
      }
    >
      {adding ? (
        <View style={{ gap: 20 }}>
          <SearchBar value={query} onChangeText={setQuery} />
          <CategoryFilter categories={categories} value={category} onChange={setCategory} />
        </View>
      ) : (
        <Section label="Overview">
          <AppText size={72} weight="bold" color={adult.accent} style={{ lineHeight: 78 }}>
            {activeGames.length}
          </AppText>
          <AppText size={17} color={colors.inkSoft}>
            {activeGames.length === 1 ? 'game is' : 'games are'} active
            {skillCount > 0 ? `, practising ${skillCount} ${skillCount === 1 ? 'skill' : 'skills'}.` : '.'}
          </AppText>
        </Section>
      )}

      {notice ? (
        <AppText size={16} color={colors.inkSoft} accessibilityLiveRegion="polite">
          {notice}
        </AppText>
      ) : null}

      {shown.length === 0 ? (
        <AppText size={17} color={colors.inkSoft}>
          {adding
            ? 'No games match. Try a different search or theme.'
            : 'No games are active yet. Switch to "Add games" to choose some.'}
        </AppText>
      ) : (
        <View style={{ gap: 32 }}>
          {shown.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              active={isActive(game.id)}
              onPress={() => router.push(`/adult/game/${game.id}?from=games`)}
              onToggle={adding ? () => toggle(game) : undefined}
            />
          ))}
        </View>
      )}
    </AdultScreen>
  );
}
