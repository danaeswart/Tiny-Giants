import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import ProfileMenu from '../../adult/components/ProfileMenu.jsx';
import AppText from '../../shared/components/AppText.jsx';
import Button from '../../shared/components/Button.jsx';
import { useEnabledGames } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useProfiles } from '../../shared/hooks/useProfiles.js';
import { adult, colors, fonts } from '../../shared/theme.js';
import ChildScreen from '../components/ChildScreen.jsx';
import FloatingAvatars from '../components/FloatingAvatars.jsx';

/** Child home: a friendly hello and the All games button on the left, the characters floating down the right. */
export default function StorybookShelf() {
  const childId = useCurrentChildId();
  const { games, loading } = useEnabledGames(childId);
  const { current: profile } = useProfiles();
  const [menuOpen, setMenuOpen] = useState(false);
  const [side, setSide] = useState({ width: 0, height: 0 }); // the right-hand space the characters float in
  const hasGames = games.length > 0;

  return (
    <ChildScreen style={{ gap: 16 }}>
      <View style={styles.header}>
        <Button
          variant="blue"
          size="lg"
          icon="settings"
          onPress={() => setMenuOpen(true)}
          accessibilityLabel="Profile and settings"
          style={styles.settingsButton}
        />
      </View>

      {/* Edge to edge: from the top of the screen to the bottom, out to the right-hand edge, behind everything. */}
      <View
        style={styles.floatLayer}
        pointerEvents="none"
        onLayout={({ nativeEvent: { layout } }) => setSide({ width: layout.width, height: layout.height })}
      >
        <FloatingAvatars width={side.width} height={side.height} />
      </View>

      <View style={styles.main}>
        <View style={styles.hello}>
          <Text style={styles.eyebrow}>TINY GIANTS · STORY TIME</Text>
          <View style={styles.greeting}>
          <AppText size={72} weight="extrabold" color={adult.accent} accessibilityRole="header" style={{ lineHeight: 74 }}>
            {profile?.name ? `Hi, ${profile.name}!` : 'Hi there!'}
          </AppText>
          {!loading &&
            (hasGames ? (
              <Button variant="primary" size="xl" icon="grid" onPress={() => router.push('/child/games')} style={styles.gamesButton}>
                All games
              </Button>
            ) : (
              <AppText size={20} weight="bold" color={colors.ink}>
                Ask a grown-up to choose some games for you.
              </AppText>
            ))}
          </View>
        </View>

        {/* keeps the greeting in the left half; the characters float in their own layer below */}
        <View style={styles.avatarSide} />
      </View>

      <ProfileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </ChildScreen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  settingsButton: { width: 64, marginLeft: -12 },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 32 },
  hello: { flex: 1, gap: 4, paddingLeft: 40, justifyContent: 'center', paddingBottom: 48 },
  eyebrow: { fontFamily: fonts.mono, fontSize: 16, letterSpacing: 1.6, color: adult.accent },
  greeting: { alignSelf: 'flex-start', alignItems: 'center', gap: 4 },
  gamesButton: { alignSelf: 'center', marginTop: 8 },
  avatarSide: { flex: 1 },
  floatLayer: { position: 'absolute', top: 0, bottom: 0, right: 0, left: '52%', overflow: 'hidden' },
});
