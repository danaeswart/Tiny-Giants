import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { setCurrentChildId, useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useLoad } from '../../shared/hooks/useLoad.js';
import { useProfiles } from '../../shared/hooks/useProfiles.js';
import { getChildGameSettings, getGameCategories, getGames, toggleGameActive } from '../../shared/services/api.js';
import { colors } from '../../shared/theme.js';
import ActiveToggle from '../components/ActiveToggle.jsx';
import AdultScreen from '../components/AdultScreen.jsx';
import CategoryFilter, { ALL } from '../components/CategoryFilter.jsx';
import ChildTitleDropdown from '../components/ChildTitleDropdown.jsx';
import Eyebrow from '../components/Eyebrow.jsx';
import GameCard from '../components/GameCard.jsx';
import SearchBar from '../components/SearchBar.jsx';

const MODES = [
  { key: 'active', label: 'Active' },
  { key: 'add', label: 'Add games' },
];

/**
 * Browse and manage the game library. The switch at the top picks the view: "Active" is
 * only the games the child can play right now (the overview lives on the Dashboard); "Add games" has search, themes
 * and every game with an Activate button. Changes apply to the child's own screens immediately.
 */
export default function Games() {
  const childId = useCurrentChildId();
  const { profiles, current } = useProfiles();
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

  return (
    <AdultScreen>
      <View style={{ gap: 10 }}>
        <Eyebrow>Library</Eyebrow>
        <ChildTitleDropdown profiles={profiles} current={current} onSelect={setCurrentChildId} noun="library" />
        <AppText size={17} color={colors.inkSoft}>
          Choose which stories {current?.name ?? 'your child'} can play.
        </AppText>
      </View>

      <ActiveToggle options={MODES} value={mode} onChange={setMode} />

      {adding ? (
        <View style={{ gap: 16 }}>
          <SearchBar value={query} onChangeText={setQuery} />
          <CategoryFilter categories={categories} value={category} onChange={setCategory} />
        </View>
      ) : null}

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
        <View style={{ gap: 24 }}>
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
