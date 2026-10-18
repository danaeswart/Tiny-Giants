import { useCallback, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import { useLoad } from '../../shared/hooks/useLoad.js';
import { refreshProfiles } from '../../shared/hooks/useProfiles.js';
import { getChild, updateChild } from '../../shared/services/api.js';
import { adult, colors } from '../../shared/theme.js';
import { isoDate, parseISO } from '../../shared/utils/dates.js';
import AdultButton from '../components/AdultButton.jsx';
import AdultScreen from '../components/AdultScreen.jsx';
import AvatarPicker from '../components/AvatarPicker.jsx';
import BackBar from '../components/BackBar.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TextField from '../components/TextField.jsx';

// 'YYYY-MM-DD' that is a real calendar date, not in the future.
function validBirthday(text) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  const date = parseISO(text);
  return isoDate(date) === text && date <= new Date();
}

function ageOn(text) {
  const born = parseISO(text);
  const now = new Date();
  let years = now.getFullYear() - born.getFullYear();
  if (now.getMonth() < born.getMonth() || (now.getMonth() === born.getMonth() && now.getDate() < born.getDate())) years -= 1;
  return years;
}

/** Edit one child: name, age, birthday and character. */
export default function EditChild() {
  const { childId } = useLocalSearchParams();
  const load = useCallback(() => getChild(childId), [childId]);
  const { data: child, loading } = useLoad(load);

  if (loading) return <AdultScreen withNav={false} />;
  if (!child) {
    return (
      <AdultScreen withNav={false}>
        <BackBar label="Profile" />
        <AppText size={20} weight="bold">
          We could not find that child.
        </AppText>
      </AdultScreen>
    );
  }
  return <EditForm child={child} />;
}

function EditForm({ child }) {
  const [name, setName] = useState(child.name);
  const [age, setAge] = useState(String(child.age));
  const [birthday, setBirthday] = useState(child.birthday ?? '');
  const [avatar, setAvatar] = useState(child.avatar);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // A complete, valid birthday works out the age for you (you can still change it).
  function changeBirthday(text) {
    setBirthday(text);
    if (validBirthday(text)) {
      const years = ageOn(text);
      if (years >= 1 && years <= 17) setAge(String(years));
    }
  }

  async function save() {
    const years = Number(age);
    if (!name.trim()) return setError('Enter a name.');
    if (!Number.isInteger(years) || years < 1 || years > 17) return setError('Enter an age between 1 and 17.');
    const day = birthday.trim();
    if (day && !validBirthday(day)) return setError('Enter the birthday as YYYY-MM-DD, for example 2021-04-18.');
    setBusy(true);
    setError('');
    try {
      await updateChild(child.id, { name, age: years, birthday: day || null, avatar });
      refreshProfiles();
      router.back();
    } catch {
      setError('Could not save. Check your connection and try again.');
      setBusy(false);
    }
  }

  return (
    <AdultScreen withNav={false} gap={20}>
      <BackBar label="Profile" />
      <PageHeader eyebrow="Edit child" title={child.name} subtitle="Change their details or their character." rule={false} />

      <TextField label="Name" value={name} onChangeText={setName} autoCapitalize="words" editable={!busy} />
      <TextField label="Age" value={age} onChangeText={setAge} keyboardType="number-pad" maxLength={2} editable={!busy} />
      <TextField
        label="Birthday (YYYY-MM-DD)"
        value={birthday}
        onChangeText={changeBirthday}
        placeholder="2021-04-18"
        keyboardType="numbers-and-punctuation"
        maxLength={10}
        editable={!busy}
      />

      <View style={{ gap: 12 }}>
        <AppText size={16} weight="semibold" color={colors.inkSoft}>
          Character
        </AppText>
        <AvatarPicker value={avatar} onChange={setAvatar} disabled={busy} />
      </View>

      {error ? (
        <AppText size={16} color={adult.berry} accessibilityLiveRegion="assertive">
          {error}
        </AppText>
      ) : null}

      <AdultButton block variant="primary" onPress={save} disabled={busy}>
        {busy ? 'Saving…' : 'Save changes'}
      </AdultButton>
    </AdultScreen>
  );
}
