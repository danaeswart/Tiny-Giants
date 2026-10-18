import { useState } from 'react';
import { View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { isValidPin, PIN_LENGTH, verifyParentPin } from '../../shared/services/pin.js';
import { adult, colors } from '../../shared/theme.js';
import AdultButton from './AdultButton.jsx';
import TextField from './TextField.jsx';

/**
 * Asks for the grown-up PIN before showing `children`. Used on pages with sensitive settings
 * (password, PIN, deleting the account). Leaving the page and coming back asks again.
 */
export default function ParentPinGate({ children }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (unlocked) return children;

  async function unlock() {
    if (!isValidPin(pin)) return setError(`Enter your ${PIN_LENGTH}-digit PIN.`);
    setBusy(true);
    setError('');
    try {
      if (await verifyParentPin(pin)) return setUnlocked(true);
      setError('That PIN is not right.');
      setPin('');
    } catch (e) {
      setError(e.message);
    }
    setBusy(false);
  }

  return (
    <View style={{ gap: 16 }}>
      <AppText size={17} color={colors.inkSoft}>
        Enter your grown-up PIN to open your account settings.
      </AppText>
      <TextField
        label="Grown-up PIN"
        value={pin}
        onChangeText={(text) => setPin(text.replace(/\D/g, '').slice(0, PIN_LENGTH))}
        secureTextEntry
        keyboardType="number-pad"
        maxLength={PIN_LENGTH}
        editable={!busy}
        onSubmitEditing={unlock}
        autoFocus
      />
      {error ? (
        <AppText size={16} color={adult.berry} accessibilityLiveRegion="assertive">
          {error}
        </AppText>
      ) : null}
      <AdultButton variant="primary" onPress={unlock} disabled={busy} style={{ alignSelf: 'flex-start' }}>
        {busy ? 'Checking…' : 'Unlock'}
      </AdultButton>
    </View>
  );
}
