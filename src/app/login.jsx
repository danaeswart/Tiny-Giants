import { useState } from 'react';
import AuthForm from '../adult/components/AuthForm.jsx';
import AdultButton from '../adult/components/AdultButton.jsx';
import AppText from '../shared/components/AppText.jsx';
import { adult } from '../shared/theme.js';
import { sendPasswordReset, signIn } from '../shared/services/auth.js';
import { validateSignIn } from '../shared/utils/authValidation.js';

// Signing in is all this screen does: the guard in app/_layout moves the parent on
// as soon as Firebase reports a user.
export default function Login() {
  const [note, setNote] = useState('');
  const [email, setEmail] = useState('');

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to see how your child is getting on."
      submitLabel="Sign in"
      fields={[
        { key: 'email', label: 'Email', keyboardType: 'email-address', autoComplete: 'email' },
        { key: 'password', label: 'Password', secure: true, autoComplete: 'current-password' },
      ]}
      onSubmit={async (values) => {
        setEmail(values.email ?? '');
        setNote('');
        const problem = validateSignIn(values);
        if (problem) throw new Error(problem);
        await signIn(values);
      }}
      extra={
        <>
          <AdultButton
            onPress={async () => {
              try {
                await sendPasswordReset(email);
                setNote('If that email has an account, a reset link is on its way.');
              } catch (e) {
                setNote(e.message);
              }
            }}
          >
            Forgot password?
          </AdultButton>
          {note ? (
            <AppText size={16} color={adult.leaf} accessibilityLiveRegion="polite">
              {note}
            </AppText>
          ) : null}
        </>
      }
      footer={{ text: 'New here?', linkLabel: 'Create an account', href: '/signup' }}
    />
  );
}
