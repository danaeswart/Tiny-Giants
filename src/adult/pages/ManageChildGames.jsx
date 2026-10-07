import { useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Switch, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Button from '../../shared/components/Button.jsx';
import CoverImage from '../../shared/components/CoverImage.jsx';
import { getChildGameSettings, getGames, setGameEnabledForChild } from '../../shared/services/api.js';
import { colors, radius } from '../../shared/theme.js';
import AdultScreen from '../components/AdultScreen.jsx';

/** A parent chooses which games from the catalogue their child can see. */
export default function ManageChildGames() {
  const { childId } = useLocalSearchParams();
  const [games, setGames] = useState([]);
  const [enabledIds, setEnabledIds] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([getGames(), getChildGameSettings(childId)]).then(([all, settings]) => {
      if (cancelled) return;
      setGames(all);
      setEnabledIds(new Set(settings.enabledGameIds));
    });
    return () => {
      cancelled = true;
    };
  }, [childId]);

  async function toggle(game, enabled) {
    const previous = enabledIds;
    const optimistic = new Set(previous);
    if (enabled) optimistic.add(game.id);
    else optimistic.delete(game.id);
    setEnabledIds(optimistic);

    try {
      const settings = await setGameEnabledForChild(childId, game.id, enabled);
      setEnabledIds(new Set(settings.enabledGameIds));
      setStatus(`${game.title} is now ${enabled ? 'shown' : 'hidden'}.`);
    } catch {
      setEnabledIds(previous);
      setStatus(`Couldn't save the change to ${game.title}. Please try again.`);
    }
  }

  return (
    <AdultScreen>
      <Stack.Screen options={{ title: 'Manage games' }} />
      {enabledIds && (
        <>
          <View style={{ gap: 8 }}>
            <AppText size={30} weight="extrabold" accessibilityRole="header">
              Choose your child’s games
            </AppText>
            <AppText size={18} color={colors.inkSoft}>
              Only games that are switched on appear on your child’s device. {enabledIds.size} of{' '}
              {games.length} switched on.
            </AppText>
          </View>

          <View style={styles.list}>
            {games.map((game, i) => {
              const checked = enabledIds.has(game.id);
              return (
                // The whole row is the switch, so the touch target is large.
                <Pressable
                  key={game.id}
                  onPress={() => toggle(game, !checked)}
                  accessibilityRole="switch"
                  accessibilityState={{ checked }}
                  accessibilityLabel={game.title}
                  accessibilityHint={game.teaches}
                  style={({ pressed }) => [styles.row, i > 0 && styles.divider, pressed && styles.rowPressed]}
                >
                  <CoverImage game={game} style={styles.thumb} />
                  <View style={styles.rowText}>
                    <AppText size={18} weight="bold">
                      {game.title}
                    </AppText>
                    <AppText size={16} color={colors.inkSoft}>
                      {game.teaches}
                    </AppText>
                  </View>
                  <AppText size={16} weight="bold" color={colors.inkSoft} importantForAccessibility="no">
                    {checked ? 'On' : 'Off'}
                  </AppText>
                  <Switch
                    value={checked}
                    onValueChange={(v) => toggle(game, v)}
                    trackColor={{ true: colors.leaf, false: colors.switchOff }}
                    thumbColor={colors.white}
                    ios_backgroundColor={colors.switchOff}
                    accessibilityElementsHidden
                    importantForAccessibility="no"
                  />
                </Pressable>
              );
            })}
          </View>

          <AppText size={16} color={colors.inkSoft} accessibilityLiveRegion="polite" style={{ minHeight: 24 }}>
            {status}
          </AppText>

          <Button variant="secondary" size="md" style={{ alignSelf: 'flex-start' }} onPress={() => router.push('/child')}>
            Open your child’s storybook
          </Button>
        </>
      )}
    </AdultScreen>
  );
}

const styles = StyleSheet.create({
  list: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.inkFaint,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 80, padding: 16 },
  divider: { borderTopWidth: 1, borderTopColor: colors.inkFaint },
  rowPressed: { backgroundColor: colors.cream },
  thumb: { width: 72, height: 56, borderRadius: radius.sm },
  rowText: { flex: 1, gap: 2 },
});
