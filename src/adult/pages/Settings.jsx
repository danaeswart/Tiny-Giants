import { useCallback, useState } from 'react';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import AppText from '../../shared/components/AppText.jsx';
import Avatar from '../../shared/components/Avatar.jsx';
import { useCurrentChildId } from '../../shared/hooks/useCurrentChildId.js';
import { useLoad } from '../../shared/hooks/useLoad.js';
import { getChild, getParentAccount, getSessions, updateParentEmail, updateParentPassword } from '../../shared/services/api.js';
import { adult, colors, radius } from '../../shared/theme.js';
import { formatDay, formatMonthYear } from '../../shared/utils/dates.js';
import AccountRow from '../components/AccountRow.jsx';
import AdultButton from '../components/AdultButton.jsx';
import AdultScreen from '../components/AdultScreen.jsx';
import Chip from '../components/Chip.jsx';
import Eyebrow from '../components/Eyebrow.jsx';
import Hero from '../components/Hero.jsx';
import Section from '../components/Section.jsx';

const HISTORY_LIMIT = 10;

/** Settings: the parent's account, the child's profile, the way into the child view, and a short play history. */
export default function Settings() {
  const childId = useCurrentChildId();
  const load = useCallback(
    () => Promise.all([getParentAccount(), getChild(childId), getSessions(childId)]),
    [childId],
  );
  const { data } = useLoad(load);
  const [email, setEmail] = useState(null); // set once the parent changes it on this screen

  if (!data) return <AdultScreen />;
  const [parent, child, sessions] = data;
  const recent = sessions.slice(0, HISTORY_LIMIT);

  return (
    <AdultScreen
      hero={<Hero eyebrow="Settings" title="You and your child" subtitle="Accounts, profiles and play history." />}
    >
      <Section label="You">
        <AppText size={26} weight="semibold">
          {parent.name}
        </AppText>
      </Section>

      <Section label="Sign-in" stacked>
        <AccountRow
          label="Email"
          value={email ?? parent.email}
          submitLabel="Save email"
          successMessage="Email updated."
          fields={[
            { key: 'email', label: 'New email', keyboardType: 'email-address', autoComplete: 'email' },
            { key: 'currentPassword', label: 'Current password', secure: true, autoComplete: 'current-password' },
          ]}
          validate={(v) =>
            !/^S+@S+.S+$/.test((v.email ?? '').trim())
              ? 'Enter a valid email address.'
              : !v.currentPassword
                ? 'Enter your current password to confirm.'
                : null
          }
          onSubmit={async (v) => setEmail((await updateParentEmail(v)).email)}
        />
        <View style={styles.hairline} />
        <AccountRow
          label="Password"
          value="••••••••"
          submitLabel="Save password"
          successMessage="Password updated."
          fields={[
            { key: 'currentPassword', label: 'Current password', secure: true, autoComplete: 'current-password' },
            { key: 'newPassword', label: 'New password (8+ characters)', secure: true, autoComplete: 'new-password' },
            { key: 'confirm', label: 'Confirm new password', secure: true, autoComplete: 'new-password' },
          ]}
          validate={(v) =>
            !v.currentPassword
              ? 'Enter your current password.'
              : (v.newPassword ?? '').length < 8
                ? 'Use at least 8 characters.'
                : v.newPassword === v.currentPassword
                  ? 'Choose a password you have not used just now.'
                  : v.newPassword !== v.confirm
                    ? 'The new passwords do not match.'
                    : null
          }
          onSubmit={(v) => updateParentPassword(v)}
        />
      </Section>

      {child && (
        <Section label="Your child">
          <View style={styles.person}>
            <Avatar profile={child} size={64} />
            <View style={{ flex: 1 }}>
              <AppText size={26} weight="semibold">
                {child.name}
              </AppText>
              <AppText size={17} color={colors.inkSoft}>
                {child.age} years old · with us since {formatMonthYear(child.joinedDate)}
              </AppText>
            </View>
          </View>
        </Section>
      )}

      <View style={styles.band}>
        <Eyebrow color="rgba(255,255,255,0.7)">Hand it over</Eyebrow>
        <AppText size={32} weight="extrabold" color={adult.lime} style={{ lineHeight: 36 }}>
          Ready for story time?
        </AppText>
        <AdultButton variant="secondary" icon="swap" onPress={() => router.dismissTo('/child')} style={styles.bandButton}>
          Open child view
        </AdultButton>
      </View>

      <Section label="Play history" stacked>
        {recent.length === 0 ? (
          <AppText size={17} color={colors.inkSoft}>
            No stories played yet.
          </AppText>
        ) : (
          recent.map((session, i) => (
            <View
              key={`${session.date}-${session.gameId}-${i}`}
              style={[styles.row, i < recent.length - 1 && styles.divider]}
            >
              <View style={{ flex: 1 }}>
                <AppText size={18} weight="semibold">
                  {session.gameTitle}
                </AppText>
                <AppText size={16} color={colors.inkSoft}>
                  {formatDay(session.date)} · {session.durationMinutes} min
                </AppText>
              </View>
              <Chip label={session.completed ? 'Finished' : 'Stopped early'} tone={session.completed ? 'leaf' : 'neutral'} />
            </View>
          ))
        )}
        {sessions.length > HISTORY_LIMIT && (
          <AppText size={16} color={colors.inkSoft}>
            Showing the latest {HISTORY_LIMIT} of {sessions.length} sessions.
          </AppText>
        )}
      </Section>
    </AdultScreen>
  );
}

const styles = StyleSheet.create({
  hairline: { height: 1, backgroundColor: adult.border },
  person: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  band: { gap: 16, padding: 28, borderRadius: radius.lg, backgroundColor: colors.ink },
  bandButton: { alignSelf: 'flex-start', backgroundColor: colors.white },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 16 },
  divider: { borderBottomWidth: 1, borderBottomColor: adult.border },
});
