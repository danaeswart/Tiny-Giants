import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import CoverImage from '../../shared/components/CoverImage.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { searchEnabledGamesForChild } from '../../shared/services/api.js';
import { colors, fonts, radius } from '../../shared/theme.js';

/** Title search over this child's enabled games only. */
export default function SearchBar({ childId, onSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    let cancelled = false;
    searchEnabledGamesForChild(childId, query).then((games) => !cancelled && setResults(games));
    return () => {
      cancelled = true;
    };
  }, [childId, query]);

  const hasQuery = query.trim().length > 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.inputWrap}>
        <View style={styles.inputIcon}>
          <Icon name="search" size={28} color={colors.inkSoft} />
        </View>
        <TextInput
          value={query}
          onChangeText={setQuery}
          autoFocus
          placeholder="Find a game…"
          placeholderTextColor={colors.inkSoft}
          accessibilityLabel="Search for a game"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          // Android otherwise swaps to a full-screen text editor in landscape.
          disableFullscreenUI
          maxFontSizeMultiplier={1.4}
          style={styles.input}
        />
      </View>

      <AppText size={16} style={styles.srOnly} accessibilityLiveRegion="polite">
        {hasQuery ? `${results.length} ${results.length === 1 ? 'game' : 'games'} found` : ''}
      </AppText>

      {hasQuery &&
        (results.length > 0 ? (
          results.map((game) => (
            <Pressable
              key={game.id}
              onPress={() => onSelect(game)}
              accessibilityRole="button"
              accessibilityLabel={game.title}
              style={({ pressed }) => [styles.result, pressed && styles.resultPressed]}
            >
              <CoverImage game={game} style={styles.thumb} />
              <AppText size={20} weight="extrabold" style={{ flexShrink: 1 }}>
                {game.title}
              </AppText>
            </Pressable>
          ))
        ) : (
          <AppText size={20} color={colors.inkSoft}>
            No games with that name. Try another word!
          </AppText>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  inputWrap: { justifyContent: 'center' },
  inputIcon: { position: 'absolute', left: 20, zIndex: 1, pointerEvents: 'none' },
  input: {
    height: 64,
    borderRadius: radius.pill,
    borderWidth: 4,
    borderColor: colors.sun,
    backgroundColor: colors.white,
    paddingLeft: 60,
    paddingRight: 24,
    fontFamily: fonts.regular,
    fontSize: 22,
    color: colors.ink,
  },
  result: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    minHeight: 80,
    padding: 8,
    paddingRight: 24,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.inkFaint,
  },
  resultPressed: { backgroundColor: colors.paper, transform: [{ scale: 0.98 }] },
  thumb: { width: 96, height: 64, borderRadius: radius.sm },
  srOnly: { position: 'absolute', width: 1, height: 1, opacity: 0 },
});
