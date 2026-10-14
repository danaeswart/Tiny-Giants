import AuthForm from '../adult/components/AuthForm.jsx';
import { signUp } from '../shared/services/auth.js';
import { validateSignUp } from '../shared/utils/authValidation.js';

export default function Signup() {
  return (
    <AuthForm
      title="Create your account"
      subtitle="Step 1 of 3 · One account for you and your children."
      submitLabel="Create account"
      fields={[
        { key: 'name', label: 'Your name', autoComplete: 'name', autoCapitalize: 'words' },
        { key: 'email', label: 'Email', keyboardType: 'email-address', autoComplete: 'email' },
        { key: 'password', label: 'Password (8+ characters)', secure: true, autoComplete: 'new-password' },
        { key: 'confirm', label: 'Confirm password', secure: true, autoComplete: 'new-password' },
      ]}
      onSubmit={(values) => {
        const problem = validateSignUp(values);
        if (problem) throw new Error(problem);
        return signUp(values); // the guard in the root layout moves the parent into the app
      }}
      footer={{ text: 'Already have an account?', linkLabel: 'Sign in', href: '/login' }}
    />
  );
}
