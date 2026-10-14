import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { deleteAccount, signOut } from '../../shared/services/auth.js';
import { adult, radius } from '../../shared/theme.js';
import AdultButton from './AdultButton.jsx';
import Eyebrow from './Eyebrow.jsx';
import TextField from './TextField.jsx';

/**
 * The "no-no zone" at the bottom of the account pages: sign out, and delete the account for
 * good. Deleting asks for the password first and says plainly what will be lost. When it
 * succeeds the sign-in disappears and the app returns to the login screen by itself.
 */
export default function DangerZone() {
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

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
      <AdultButton icon="swap" onPress={signOut} disabled={busy} style={styles.button}>
        Sign out
      </AdultButton>

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
        <AdultButton onPress={() => setConfirming(true)} style={[styles.button, styles.destroyOutline]}>
          Delete account
        </AdultButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  zone: { gap: 16, padding: 24, borderRadius: radius.lg, borderWidth: 1.5, borderColor: adult.berry, backgroundColor: adult.berrySoft },
  button: { alignSelf: 'flex-start' },
  destroy: { backgroundColor: adult.berry, borderColor: adult.berry },
  destroyOutline: { borderColor: adult.berry },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
});
