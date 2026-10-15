import { useState } from 'react';
import { router } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import ProfileMenu from '../../adult/components/ProfileMenu.jsx';
import AppText from '../../shared/components/AppText.jsx';
import Button from '../../shared/components/Button.jsx';
import { useEnabledGames } from '../../shared/hooks/useChildGames.js';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useProfiles } from '../../shared/hooks/useProfiles.js';
import { adult, colors, fonts } from '../../shared/theme.js';
import ChildScreen from '../components/ChildScreen.jsx';

// Set this to the moving-avatar video, e.g. require('../../../assets/book/avatar-home.mp4').
// Until then the still avatar image is shown.
const AVATAR_VIDEO = null;
const AVATAR_STILL = require('../../../assets/book/avatars/avatar1.png');

/** Child home: a friendly hello and the All games button on the left, the moving avatar on the right. */
export default function StorybookShelf() {
  const childId = useCurrentChildId();
  const { games, loading } = useEnabledGames(childId);
  const { current: profile } = useProfiles();
  const [menuOpen, setMenuOpen] = useState(false);
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

        <View style={styles.avatarSide}>
          <Avatar />
        </View>
      </View>

      <ProfileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </ChildScreen>
  );
}

function Avatar() {
  return AVATAR_VIDEO ? (
    <AvatarVideo />
  ) : (
    <Image source={AVATAR_STILL} resizeMode="contain" style={styles.avatar} accessibilityIgnoresInvertColors />
  );
}

function AvatarVideo() {
  const player = useVideoPlayer(AVATAR_VIDEO, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });
  return <VideoView player={player} nativeControls={false} contentFit="contain" style={styles.avatar} />;
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  settingsButton: { width: 64, marginLeft: -12 },
  main: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 32 },
  hello: { flex: 1, gap: 4, paddingLeft: 40, justifyContent: 'center', paddingBottom: 48 },
  eyebrow: { fontFamily: fonts.mono, fontSize: 16, letterSpacing: 1.6, color: adult.accent },
  greeting: { alignSelf: 'flex-start', alignItems: 'center', gap: 4 },
  gamesButton: { alignSelf: 'center', marginTop: 8 },
  avatarSide: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatar: { width: '100%', height: '100%' },
});
