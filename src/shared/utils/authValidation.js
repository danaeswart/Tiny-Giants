// Pure helpers for the sign-in / sign-up forms. No Firebase or React in here, so they are
// quick to unit test (see __tests__/authValidation.test.js).

export const MIN_PASSWORD_LENGTH = 8;

/** True for anything shaped like name@site.tld (spaces not allowed). */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((email ?? '').trim());
}

/** Error message for the sign-in form, or null when it is OK to submit. */
export function validateSignIn({ email, password }) {
  if (!isValidEmail(email)) return 'Enter a valid email address.';
  if (!password) return 'Enter your password.';
  return null;
}

/** Error message for the sign-up form, or null when it is OK to submit. */
export function validateSignUp({ name, email, password, confirm }) {
  if (!(name ?? '').trim()) return 'Enter your name.';
  if (!isValidEmail(email)) return 'Enter a valid email address.';
  if ((password ?? '').length < MIN_PASSWORD_LENGTH) {
    return `Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`;
  }
  if (password !== confirm) return 'The passwords do not match.';
  return null;
}

/** Error message for adding a child profile, or null when it is OK to submit. */
export function validateChild({ name, age }) {
  if (!(name ?? '').trim()) return "Enter your child's name.";
  const years = Number(age);
  if (!Number.isInteger(years) || years < 1 || years > 12) return 'Enter an age between 1 and 12.';
  return null;
}
