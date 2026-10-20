import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Popup from '../../shared/components/Popup.jsx';
import { deleteAccount, signOut } from '../../shared/services/auth.js';
import { adult } from '../../shared/theme.js';
import AdultButton from './AdultButton.jsx';
import Eyebrow from './Eyebrow.jsx';
import TextField from './TextField.jsx';

/**
 * The "no-no zone" at the bottom of the account page, kept deliberately plain: a rule, then
 * two text links. Deleting asks for the password first and says plainly what will be lost.
 * When it succeeds the sign-in disappears and the app returns to the login screen by itself.
 */
export default function DangerZone() {
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [signingOut, setSigningOut] = useState(false);
  const [leaving, setLeaving] = useState(false);

  function cancel() {
    setConfirming(false);
    setPassword('');
    setError('');
  }

  async function remove() {
    if (!password) return setError('Enter your password to confirm.');
    setBusy(true);
    setError('');
    try {
      await deleteAccount({ currentPassword: password });
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  }

  return (
    <View style={styles.zone}>
      <Eyebrow color={adult.berry}>The no-no zone</Eyebrow>

      <Pressable onPress={() => setSigningOut(true)} disabled={busy} accessibilityRole="button" style={styles.link}>
        <AppText size={17} weight="bold">
          Sign out
        </AppText>
      </Pressable>

      {confirming ? (
        <View style={{ gap: 16 }}>
          <AppText size={17} weight="semibold" color={adult.berry}>
            This deletes your account, every baby’s profile and all of their play history. It cannot be undone.
          </AppText>
          <TextField
            label="Your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="current-password"
            editable={!busy}
            onSubmitEditing={remove}
          />
          {error ? (
            <AppText size={16} color={adult.berry} accessibilityLiveRegion="assertive">
              {error}
            </AppText>
          ) : null}
          <View style={styles.actions}>
            <AdultButton variant="primary" onPress={remove} disabled={busy} style={styles.destroy}>
              {busy ? 'Deleting…' : 'Delete everything for good'}
            </AdultButton>
            <AdultButton onPress={cancel} disabled={busy}>
              Keep my account
            </AdultButton>
          </View>
        </View>
      ) : (
        <Pressable onPress={() => setConfirming(true)} accessibilityRole="button" style={styles.link}>
          <AppText size={17} weight="bold" color={adult.berry}>
            Delete account
          </AppText>
        </Pressable>
      )}

      <Popup
        open={signingOut}
        tone="confirm"
        icon="user"
        title="Sign out?"
        message="You’ll need your password to come back."
        confirmLabel="Sign out"
        cancelLabel="Stay"
        onConfirm={() => {
          setLeaving(true);
          setSigningOut(false);
        }}
        onCancel={() => setSigningOut(false)}
        // Signing out swaps the whole app to the login screen, so wait until the popup has gone.
        onClosed={() => leaving && signOut()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  zone: { gap: 4, paddingTop: 20, borderTopWidth: 1.5, borderTopColor: adult.berry },
  link: { alignSelf: 'flex-start', minHeight: 44, justifyContent: 'center' },
  destroy: { backgroundColor: adult.berry, borderColor: adult.berry },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
});
