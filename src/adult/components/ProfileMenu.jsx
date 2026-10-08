import { useState } from 'react';
import { router } from 'expo-router';
import { Modal, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../shared/components/AppText.jsx';
import Avatar from '../../shared/components/Avatar.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { setCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useProfiles } from '../../shared/hooks/useProfiles.js';
import { setSetting, useSettings } from '../../shared/hooks/useSettings.js';
import { adult, colors, radius } from '../../shared/theme.js';
import AdultButton from './AdultButton.jsx';

/**
 * Full-screen profile menu, opened from the picture beside the title on the child's
 * home page. It's built for grown-ups, so it uses standard-size controls, not the big
 * child buttons. Two views: the main one (account + settings) and the account list
 * that "Switch account" opens.
 */
export default function ProfileMenu({ open, onClose }) {
  const insets = useSafeAreaInsets();
  const { profiles, current } = useProfiles();
  const settings = useSettings();
  const [view, setView] = useState('main'); // 'main' | 'accounts'

  function close() {
    setView('main');
    onClose();
  }

  function openDashboard() {
    close();
    router.push('/adult');
  }

  function choose(profile) {
    setCurrentChildId(profile.id);
    close();
  }

  return (
    <Modal
      visible={open}
      animationType="fade"
      onRequestClose={view === 'accounts' ? () => setView('main') : close}
      // iOS modals default to portrait-only, which would rotate the landscape child screen.
      supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']}
      statusBarTranslucent
    >
      <View
        style={[
          styles.screen,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 16),
            paddingLeft: Math.max(insets.left, 24),
            paddingRight: Math.max(insets.right, 24),
          },
        ]}
        accessibilityViewIsModal
      >
        <View style={styles.topBar}>
          <AppText size={22} weight="extrabold" accessibilityRole="header" style={{ flexShrink: 1 }}>
            {view === 'accounts' ? 'Switch account' : 'Profile & settings'}
          </AppText>
          {view === 'accounts' ? (
            <AdultButton icon="back" onPress={() => setView('main')}>
              Back
            </AdultButton>
          ) : (
            <AdultButton icon="close" onPress={close} accessibilityLabel="Close menu">
              Close
            </AdultButton>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {view === 'accounts' ? (
            <Section title="Who's playing?">
              {profiles.map((profile, i) => (
                <AccountRow
                  key={profile.id}
                  profile={profile}
                  selected={profile.id === current?.id}
                  last={i === profiles.length - 1}
                  onPress={() => choose(profile)}
                />
              ))}
            </Section>
          ) : (
            <>
              <Section title="Account">
                <View style={styles.accountRow}>
                  <Avatar profile={current} size={52} />
                  <View style={{ flex: 1 }}>
                    <AppText size={18} weight="bold">
                      {current?.name ?? 'Player'}
                    </AppText>
                    <AppText size={16} color={colors.inkSoft}>
                      Currently playing
                    </AppText>
                  </View>
                  <AdultButton icon="swap" onPress={() => setView('accounts')}>
                    Switch account
                  </AdultButton>
                </View>
              </Section>

              <Section title="Settings">
                <SettingRow
                  label="Read stories aloud"
                  hint="Plays the narration. Turn off for quiet reading."
                  value={settings.narration}
                  onChange={(v) => setSetting('narration', v)}
                />
                <SettingRow
                  label="Show captions"
                  hint="Shows the words on screen while a story is read. Always on when narration is off."
                  value={settings.captions}
                  onChange={(v) => setSetting('captions', v)}
                  last
                />
              </Section>
            </>
          )}
        </ScrollView>

        {view === 'main' && (
          <View style={styles.footer}>
            <AdultButton variant="primary" onPress={openDashboard} style={{ alignSelf: 'stretch' }}>
              Parent dashboard
            </AdultButton>
          </View>
        )}
      </View>
    </Modal>
  );
}

function Section({ title, children }) {
  return (
    <View style={{ gap: 8 }}>
      <AppText size={16} weight="bold" color={colors.inkSoft}>
        {title}
      </AppText>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function SettingRow({ label, hint, value, onChange, last }) {
  return (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <View style={{ flex: 1 }}>
        <AppText size={16} weight="bold">
          {label}
        </AppText>
        <AppText size={16} color={colors.inkSoft}>
          {hint}
        </AppText>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ false: colors.switchOff, true: adult.accent }}
        thumbColor={colors.white}
      />
    </View>
  );
}

function AccountRow({ profile, selected, last, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${profile.name}${selected ? ', playing now' : ''}`}
      style={({ pressed }) => [styles.row, !last && styles.rowDivider, pressed && { backgroundColor: colors.cream }]}
    >
      <Avatar profile={profile} size={44} />
      <AppText size={16} weight="bold" style={{ flex: 1 }}>
        {profile.name}
      </AppText>
      {selected && <Icon name="check" size={22} color={adult.accent} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream, gap: 16 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  content: { width: '100%', maxWidth: 720, alignSelf: 'center', gap: 20, paddingBottom: 8 },
  footer: { width: '100%', maxWidth: 720, alignSelf: 'center' },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.inkFaint,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  accountRow: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, paddingHorizontal: 14 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: colors.inkFaint },
});
