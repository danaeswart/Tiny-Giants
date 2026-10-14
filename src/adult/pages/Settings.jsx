import { useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import AvatarImage from '../../shared/components/AvatarImage.jsx';
import { setCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { refreshProfiles, useProfiles } from '../../shared/hooks/useProfiles.js';
import { setChildAvatar } from '../../shared/services/api.js';
import { adult, colors } from '../../shared/theme.js';
import { formatMonthYear } from '../../shared/utils/dates.js';
import AdultButton from '../components/AdultButton.jsx';
import AvatarPicker from '../components/AvatarPicker.jsx';
import NavRow from '../components/NavRow.jsx';
import AdultScreen from '../components/AdultScreen.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Section from '../components/Section.jsx';

/** Settings: account settings, each baby's profile (with its way into the child view), and play history. */
export default function Settings() {
  const { profiles } = useProfiles();
  const [picking, setPicking] = useState(null); // id of the child whose character is being changed
  const [error, setError] = useState('');

  function openChildView(childId) {
    setCurrentChildId(childId);
    router.dismissTo('/child');
  }

  async function choose(childId, avatar) {
    setError('');
    try {
      await setChildAvatar(childId, avatar);
      refreshProfiles();
      setPicking(null);
    } catch {
      setError('Could not save the character. Check your connection and try again.');
    }
  }

  return (
    <AdultScreen>
      <PageHeader eyebrow="Settings" title="You and your baby" subtitle="Your account, your babies and their play history." rule={false} />

      <NavRow onPress={() => router.push('/adult/account')}>Account settings</NavRow>

      <Section label="Your babies" stacked style={styles.noRule}>
        {profiles.map((child, i) => (
          <View key={child.id} style={[styles.baby, i < profiles.length - 1 && styles.divider]}>
            <View style={styles.top}>
              <AvatarImage avatar={child.avatar} height={110} />
              <View style={{ flex: 1, gap: 4 }}>
                <AppText size={26} weight="semibold">
                  {child.name}
                </AppText>
                <AppText size={17} color={colors.inkSoft}>
                  {child.age} years old · with us since {formatMonthYear(child.joinedDate)}
                </AppText>
                <AdultButton onPress={() => setPicking(picking === child.id ? null : child.id)} style={styles.left}>
                  {picking === child.id ? 'Close' : 'Change character'}
                </AdultButton>
              </View>
            </View>
            {picking === child.id ? (
              <>
                <AvatarPicker value={child.avatar} onChange={(avatar) => choose(child.id, avatar)} />
                {error ? (
                  <AppText size={16} color={adult.berry} accessibilityLiveRegion="assertive">
                    {error}
                  </AppText>
                ) : null}
              </>
            ) : null}
            <AdultButton variant="primary" icon="swap" onPress={() => openChildView(child.id)} style={styles.wide}>
              Open child view
            </AdultButton>
          </View>
        ))}
        <AdultButton onPress={() => router.push('/add-child')} style={styles.left}>
          Add child
        </AdultButton>
      </Section>

      <NavRow onPress={() => router.push('/adult/play-history')}>Play history</NavRow>
    </AdultScreen>
  );
}

const styles = StyleSheet.create({
  noRule: { borderTopWidth: 0, paddingTop: 0 },
  left: { alignSelf: 'flex-start' },
  top: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  baby: { gap: 12, paddingVertical: 16 },
  divider: { borderBottomWidth: 1, borderBottomColor: adult.border },
  wide: { alignSelf: 'stretch', minHeight: 56 },
});
