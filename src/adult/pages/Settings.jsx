import { useCallback } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import AvatarImage from '../../shared/components/AvatarImage.jsx';
import Icon from '../../shared/components/Icon.jsx';
import { setCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useLoad } from '../../shared/hooks/useLoad.js';
import { useProfiles } from '../../shared/hooks/useProfiles.js';
import { getParentAccount } from '../../shared/services/api.js';
import { adult, colors, radius } from '../../shared/theme.js';
import { formatMonthYear } from '../../shared/utils/dates.js';
import AdultButton from '../components/AdultButton.jsx';
import AdultScreen from '../components/AdultScreen.jsx';
import Eyebrow from '../components/Eyebrow.jsx';
import NavRow from '../components/NavRow.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Section from '../components/Section.jsx';

/**
 * Profile: the grown-up's account (opens behind the PIN), each child's card (with a pencil
 * to edit them and a way into the child view), and play history.
 */
export default function Settings() {
  const { profiles } = useProfiles();
  const load = useCallback(() => getParentAccount(), []);
  const { data: parent } = useLoad(load);

  function openChildView(childId) {
    setCurrentChildId(childId);
    router.dismissTo('/child');
  }

  return (
    <AdultScreen>
      <PageHeader eyebrow="Profile" title="You and your baby" subtitle="Your account, your babies and their play history." rule={false} />

      <Pressable
        onPress={() => router.push('/adult/account')}
        accessibilityRole="button"
        accessibilityLabel="Your account settings. Needs your PIN."
        style={({ pressed }) => [styles.account, pressed && { opacity: 0.7 }]}
      >
        <View style={{ flex: 1, gap: 6 }}>
          <Eyebrow>Your account</Eyebrow>
          <AppText size={22} weight="bold">
            {parent?.name || 'Your account'}
          </AppText>
          <AppText size={17} color={colors.inkSoft}>
            {parent?.email ?? ' '}
          </AppText>
        </View>
        <Icon name="chevron-right" size={22} color={adult.accent} strokeWidth={2.6} />
      </Pressable>

      <Section label="Your babies" stacked style={styles.noRule}>
        {profiles.map((child) => (
          <View key={child.id} style={styles.card}>
            <Pressable
              onPress={() => router.push(`/adult/child/${child.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Edit ${child.name}`}
              hitSlop={6}
              style={({ pressed }) => [styles.edit, pressed && { opacity: 0.6 }]}
            >
              <Icon name="edit" size={20} color={adult.accent} strokeWidth={2.2} />
            </Pressable>
            <View style={styles.top}>
              <AvatarImage avatar={child.avatar} height={90} />
              <View style={{ flex: 1, gap: 4, paddingRight: 36 }}>
                <AppText size={26} weight="semibold">
                  {child.name}
                </AppText>
                <AppText size={17} color={colors.inkSoft}>
                  {child.age} years old · with us since {formatMonthYear(child.joinedDate)}
                </AppText>
              </View>
            </View>
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
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: adult.rule,
  },
  card: { gap: 16, padding: 20, borderRadius: radius.lg, borderWidth: 1.5, borderColor: adult.rule },
  top: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  // Pencil in the card's top-right corner; the box is 44px so it is easy to hit.
  edit: { position: 'absolute', top: 8, right: 8, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  wide: { alignSelf: 'stretch', minHeight: 56 },
});
