import { useEffect, useRef, useState } from 'react';
import { router } from 'expo-router';
import { Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '../../shared/components/AppText.jsx';
import Avatar from '../../shared/components/Avatar.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { getAvatar } from '../../shared/data/avatars.js';
import { setCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useProfiles } from '../../shared/hooks/useProfiles.js';
import { setSetting, useSettings } from '../../shared/hooks/useSettings.js';
import { adult, colors, radius } from '../../shared/theme.js';
import { hasParentPin, PIN_LENGTH, verifyParentPin } from '../../shared/services/pin.js';
import AdultButton from './AdultButton.jsx';
import TextField from './TextField.jsx';

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

  // Where to go once the modal has finished dismissing. Navigating while the native modal is
  // still on its way out leaves it swallowing every touch on this screen when we come back.
  const pendingRoute = useRef(null);
  const fallbackTimer = useRef(null);

  useEffect(() => () => clearTimeout(fallbackTimer.current), []);

  function close() {
    setView('main');
    onClose();
  }

  function goAfterClose(href) {
    pendingRoute.current = href;
    close();
    // iOS reports the end of the dismissal through onDismiss; Android has no such event.
    clearTimeout(fallbackTimer.current);
    fallbackTimer.current = setTimeout(flushRoute, Platform.OS === 'ios' ? 1000 : 350);
  }

  function flushRoute() {
    clearTimeout(fallbackTimer.current);
    const href = pendingRoute.current;
    pendingRoute.current = null;
    if (href) router.push(href);
  }

  async function openDashboard() {
    try {
      // An account made before PINs existed has none yet: make one before going on.
      if (!(await hasParentPin())) {
        goAfterClose('/create-pin');
        return;
      }
    } catch {
      // Can't tell (offline): the PIN screen below will report the problem.
    }
    setView('pin');
  }

  function unlocked() {
    goAfterClose('/adult');
  }

  function choose(profile) {
    setCurrentChildId(profile.id);
    close();
  }

  return (
    <Modal
      visible={open}
      animationType="fade"
      onDismiss={flushRoute}
      onRequestClose={view !== 'main' ? () => setView('main') : close}
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
            {view === 'accounts' ? 'Switch account' : view === 'pin' ? 'Grown-ups only' : 'Profile & settings'}
          </AppText>
          {view !== 'main' ? (
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
          {view === 'pin' ? (
            <PinEntry onUnlock={unlocked} />
          ) : view === 'accounts' ? (
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
                  <AccountPicture profile={current} />
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

              {/* The only way from the child side to the parent side, so it's the PIN's one checkpoint.
                  Sits just under the account, above the settings. */}
              <AdultButton variant="primary" onPress={openDashboard} style={{ alignSelf: 'stretch' }}>
                Parent dashboard
              </AdultButton>

              <Section title="Settings">
                <SettingRow
                  label="Skip buttons"
                  hint="Shows skip-forward and back buttons while a game is playing, so scenes can be moved through quickly."
                  value={settings.skip}
                  onChange={(v) => setSetting('skip', v)}
                  last
                />
              </Section>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

/** Asks for the grown-up PIN and calls onUnlock once it's right. Checks as soon as the last digit is typed. */
function PinEntry({ onUnlock }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  async function change(text) {
    const digits = text.replace(/\D/g, '');
    setPin(digits);
    setError('');
    if (digits.length < PIN_LENGTH) return;
    setChecking(true);
    try {
      if (await verifyParentPin(digits)) return onUnlock();
      setError('That PIN is not right.');
    } catch (e) {
      setError(e.message || 'Could not check the PIN. Check your connection.');
    }
    setPin('');
    setChecking(false);
  }

  return (
    <View style={{ gap: 12 }}>
      <AppText size={17} color={colors.inkSoft}>
        Enter your {PIN_LENGTH}-digit PIN to open the parent area.
      </AppText>
      <TextField
        label="PIN"
        value={pin}
        onChangeText={change}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={PIN_LENGTH}
        editable={!checking}
        autoFocus
      />
      {error ? (
        <AppText size={16} color={adult.berry} accessibilityLiveRegion="assertive">
          {error}
        </AppText>
      ) : null}
    </View>
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

/** The playing child's character on its own, no circle. Falls back to the round avatar if they have none. */
function AccountPicture({ profile, height = 72 }) {
  const character = getAvatar(profile?.avatar);
  if (!character) return <Avatar profile={profile} size={Math.round(height * 0.72)} />;
  return (
    <Image
      source={character.source}
      resizeMode="contain"
      accessible={false}
      style={{ width: height * character.ratio, height }}
    />
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
      <AccountPicture profile={profile} height={64} />
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
