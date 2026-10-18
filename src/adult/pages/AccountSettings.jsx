import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLoad } from '../../shared/hooks/useLoad.js';
import { getParentAccount, updateParentEmail, updateParentName, updateParentPassword } from '../../shared/services/api.js';
import { isValidPin, PIN_LENGTH, setParentPin, verifyParentPin } from '../../shared/services/pin.js';
import { adult } from '../../shared/theme.js';
import AccountRow from '../components/AccountRow.jsx';
import AdultScreen from '../components/AdultScreen.jsx';
import BackBar from '../components/BackBar.jsx';
import DangerZone from '../components/DangerZone.jsx';
import PageHeader from '../components/PageHeader.jsx';
import ParentPinGate from '../components/ParentPinGate.jsx';
import Section from '../components/Section.jsx';

/**
 * Account settings, opened with the grown-up PIN: username, email, password and PIN (each
 * changed in place), then the no-no zone (sign out and delete).
 */
export default function AccountSettings() {
  const load = useCallback(() => getParentAccount(), []);
  const { data: parent } = useLoad(load);

  if (!parent) return <AdultScreen withNav={false} />;

  return (
    <AdultScreen withNav={false}>
      <BackBar label="Profile" />
      <PageHeader eyebrow="Account" title="Account settings" subtitle="Your sign-in details." />
      <ParentPinGate>
      <Section label="Sign-in" stacked>
        <AccountRow
          label="Username"
          value={parent.name || 'Not set'}
          submitLabel="Save username"
          successMessage="Username updated."
          fields={[{ key: 'name', label: 'New username', autoComplete: 'name' }]}
          validate={(v) => ((v.name ?? '').trim() ? null : 'Enter a username.')}
          onSubmit={(v) => updateParentName(v)}
        />
        <View style={styles.hairline} />
        <AccountRow
          label="Email"
          value={parent.email}
          submitLabel="Send confirmation"
          successMessage="Check your new inbox and tap the link to finish the change."
          fields={[
            { key: 'email', label: 'New email', keyboardType: 'email-address', autoComplete: 'email' },
            { key: 'currentPassword', label: 'Current password', secure: true, autoComplete: 'current-password' },
          ]}
          validate={(v) =>
            !/^\S+@\S+\.\S+$/.test((v.email ?? '').trim())
              ? 'Enter a valid email address.'
              : !v.currentPassword
                ? 'Enter your current password to confirm.'
                : null
          }
          onSubmit={(v) => updateParentEmail(v)}
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
        <View style={styles.hairline} />
        <AccountRow
          label="Grown-up PIN"
          value="••••"
          submitLabel="Save PIN"
          successMessage="PIN updated."
          fields={[
            { key: 'currentPin', label: 'Current PIN', secure: true, keyboardType: 'number-pad' },
            { key: 'newPin', label: `New PIN (${PIN_LENGTH} digits)`, secure: true, keyboardType: 'number-pad' },
          ]}
          validate={(v) =>
            !isValidPin(v.currentPin ?? '')
              ? 'Enter your current PIN.'
              : !isValidPin(v.newPin ?? '')
                ? `Your new PIN must be exactly ${PIN_LENGTH} digits.`
                : null
          }
          onSubmit={async (v) => {
            if (!(await verifyParentPin(v.currentPin))) throw new Error('That PIN is not right.');
            await setParentPin(v.newPin);
          }}
        />
      </Section>

      <DangerZone />
      </ParentPinGate>
    </AdultScreen>
  );
}

const styles = StyleSheet.create({
  hairline: { height: 1, backgroundColor: adult.border },
});
