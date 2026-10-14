import { useState } from 'react';
import { router } from 'expo-router';
import AppText from '../shared/components/AppText.jsx';
import AdultButton from '../adult/components/AdultButton.jsx';
import FormScreen from '../adult/components/FormScreen.jsx';
import TextField from '../adult/components/TextField.jsx';
import { getProfiles } from '../shared/services/api.js';
import { signOut } from '../shared/services/auth.js';
import { isValidPin, PIN_LENGTH, setParentPin } from '../shared/services/pin.js';
import { adult, colors } from '../shared/theme.js';

/** Onboarding step 2 of 3: make the PIN that keeps little hands out of the grown-up side. */
export default function CreatePin() {
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!isValidPin(pin)) return setError(`Your PIN must be exactly ${PIN_LENGTH} digits.`);
    if (pin !== confirm) return setError('The two PINs do not match.');
    setBusy(true);
    setError('');
    try {
      await setParentPin(pin);
      // New account: step 3 is adding a child. An older account that already has children is done.
      if ((await getProfiles()).length > 0) router.dismissTo('/adult');
      else router.replace('/add-child?onboarding=1');
    } catch (e) {
      setError(e.message || 'Could not save your PIN. Check your connection and try again.');
      setBusy(false);
    }
  }

  return (
    <FormScreen>
      <AppText size={16} weight="bold" color={adult.accent}>
        Step 2 of 3
      </AppText>
      <AppText size={32} weight="extrabold" accessibilityRole="header">
        Make a grown-up PIN
      </AppText>
      <AppText size={17} color={colors.inkSoft}>
        You will type this PIN to get from your child’s screen to the parent area, so only you can open it.
      </AppText>
      <TextField
        label={`PIN (${PIN_LENGTH} digits)`}
        value={pin}
        onChangeText={(t) => setPin(t.replace(/\D/g, ''))}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={PIN_LENGTH}
        editable={!busy}
      />
      <TextField
        label="Confirm PIN"
        value={confirm}
        onChangeText={(t) => setConfirm(t.replace(/\D/g, ''))}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={PIN_LENGTH}
        editable={!busy}
        onSubmitEditing={submit}
      />
      {error ? (
        <AppText size={16} color={adult.berry} accessibilityLiveRegion="assertive">
          {error}
        </AppText>
      ) : null}
      <AdultButton variant="primary" onPress={submit} disabled={busy}>
        {busy ? 'Saving…' : 'Continue'}
      </AdultButton>
      {/* Your account already exists, so "back" means signing out; signing in again picks up here. */}
      <AdultButton icon="back" onPress={() => signOut()} disabled={busy}>
        Back to sign in
      </AdultButton>
    </FormScreen>
  );
}
