import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import AppText from '../shared/components/AppText.jsx';
import AdultButton from '../adult/components/AdultButton.jsx';
import FormScreen from '../adult/components/FormScreen.jsx';
import AvatarPicker from '../adult/components/AvatarPicker.jsx';
import TextField from '../adult/components/TextField.jsx';
import { setCurrentChildId } from '../shared/hooks/useCurrentChildId.js';
import { refreshProfiles } from '../shared/hooks/useProfiles.js';
import { addChild } from '../shared/services/api.js';
import { adult, colors } from '../shared/theme.js';

/** Add a child to the signed-in parent's account (also the first thing a new parent sees). */
export default function AddChild() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const { onboarding } = useLocalSearchParams();

  async function submit() {
    const years = Number(age);
    if (!name.trim()) return setError('Enter your child’s name.');
    if (!Number.isInteger(years) || years < 1 || years > 17) return setError('Enter an age between 1 and 17.');
    setBusy(true);
    setError('');
    try {
      const child = await addChild({ name, age: years, avatar });
      setCurrentChildId(child.id);
      refreshProfiles();
      router.dismissTo('/adult'); // the parent dashboard, not the child's home
    } catch {
      setError('Could not save. Check your connection and try again.');
      setBusy(false);
    }
  }

  return (
    <FormScreen>
      {onboarding ? (
        <AppText size={16} weight="bold" color={adult.accent}>
          Step 3 of 3
        </AppText>
      ) : null}
      <AppText size={32} weight="extrabold" accessibilityRole="header">
        Add a child
      </AppText>
      <AppText size={17} color={colors.inkSoft}>
        Each child gets their own profile and their own choice of stories.
      </AppText>
      <TextField label="Name" value={name} onChangeText={setName} autoCapitalize="words" editable={!busy} />
      <TextField label="Age" value={age} onChangeText={setAge} keyboardType="number-pad" maxLength={2} editable={!busy} onSubmitEditing={submit} />
      <AppText size={16} weight="semibold">
        Pick a character
      </AppText>
      <AvatarPicker value={avatar} onChange={setAvatar} disabled={busy} />
      {error ? (
        <AppText size={16} color={adult.berry} accessibilityLiveRegion="assertive">
          {error}
        </AppText>
      ) : null}
      <AdultButton variant="primary" onPress={submit} disabled={busy}>
        {busy ? 'Saving…' : 'Add child'}
      </AdultButton>
      {onboarding ? (
        <AdultButton icon="back" onPress={() => router.replace('/create-pin')} disabled={busy}>
          Back
        </AdultButton>
      ) : (
        router.canGoBack() && (
          <AdultButton onPress={() => router.back()} disabled={busy}>
            Cancel
          </AdultButton>
        )
      )}
    </FormScreen>
  );
}
