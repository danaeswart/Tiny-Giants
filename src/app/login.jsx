import { useState } from 'react';
import AuthForm from '../adult/components/AuthForm.jsx';
import AdultButton from '../adult/components/AdultButton.jsx';
import AppText from '../shared/components/AppText.jsx';
import Popup from '../shared/components/Popup.jsx';
import { adult } from '../shared/theme.js';
import { sendPasswordReset, signIn } from '../shared/services/auth.js';
import { DEMO_PIN, enterDemo } from '../shared/services/demo.js';
import { validateSignIn } from '../shared/utils/authValidation.js';

// Signing in is all this screen does: the guard in app/_layout moves the parent on
// as soon as Firebase reports a user.
export default function Login() {
  const [note, setNote] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoBusy, setDemoBusy] = useState(false);

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
                setSent(true);
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
          <AdultButton block icon="play" onPress={() => setDemoOpen(true)}>
            View demo account
          </AdultButton>
          <Popup
            open={demoOpen}
            tone="confirm"
            icon="heart"
            title="A peek inside"
            message="This is a look at the app for a parent with 2 children, already set up so you can play around."
            confirmLabel={demoBusy ? 'Opening…' : 'Open demo'}
            cancelLabel="Not now"
            busy={demoBusy}
            onConfirm={async () => {
              setDemoBusy(true);
              setNote('');
              try {
                await enterDemo();
              } catch (e) {
                setNote(e.message);
                setDemoOpen(false);
              }
              setDemoBusy(false);
            }}
            onCancel={() => setDemoOpen(false)}
          >
            <AppText size={18} weight="bold" align="center">
              Your parent code is {DEMO_PIN}
            </AppText>
            <AppText size={16} color={adult.leaf} align="center">
              Use it to switch between the child and parent views.
            </AppText>
          </Popup>
          <Popup
            open={sent}
            tone="success"
            icon="sparkle"
            title="Check your inbox"
            message="If that email has an account, a reset link is on its way."
            confirmLabel="Done"
            onConfirm={() => setSent(false)}
          />
        </>
      }
      footer={{ text: 'New here?', linkLabel: 'Create an account', href: '/signup' }}
    />
  );
}
