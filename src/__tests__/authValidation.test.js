import {
  isValidEmail,
  MIN_PASSWORD_LENGTH,
  validateChild,
  validateSignIn,
  validateSignUp,
} from '../shared/utils/authValidation.js';
import { makeChild, makeSignUpForm } from './helpers/testHelpers.js';

describe('isValidEmail', () => {
  test.each(['a@b.co', 'alex.morgan@example.com', '  padded@example.com  '])('accepts %p', (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  test.each(['', 'no-at-sign.com', 'two@@example.com', 'spaces in@example.com', 'missing@tld', null, undefined])(
    'rejects %p',
    (email) => {
      expect(isValidEmail(email)).toBe(false);
    },
  );
});

describe('validateSignIn', () => {
  test('passes with an email and a password', () => {
    expect(validateSignIn({ email: 'alex@example.com', password: 'x' })).toBeNull();
  });

  test('asks for a valid email first', () => {
    expect(validateSignIn({ email: 'nope', password: 'x' })).toMatch(/valid email/i);
  });

  test('asks for the password when it is empty', () => {
    expect(validateSignIn({ email: 'alex@example.com', password: '' })).toMatch(/password/i);
  });
});

describe('validateSignUp', () => {
  test('passes a fully valid form', () => {
    expect(validateSignUp(makeSignUpForm())).toBeNull();
  });

  test('requires a name (spaces alone do not count)', () => {
    expect(validateSignUp(makeSignUpForm({ name: '   ' }))).toMatch(/name/i);
  });

  test('requires a valid email', () => {
    expect(validateSignUp(makeSignUpForm({ email: 'alex@' }))).toMatch(/email/i);
  });

  test('enforces the minimum password length', () => {
    const short = 'a'.repeat(MIN_PASSWORD_LENGTH - 1);
    expect(validateSignUp(makeSignUpForm({ password: short, confirm: short }))).toMatch(/characters/i);

    const exact = 'a'.repeat(MIN_PASSWORD_LENGTH);
    expect(validateSignUp(makeSignUpForm({ password: exact, confirm: exact }))).toBeNull();
  });

  test('requires both passwords to match', () => {
    expect(validateSignUp(makeSignUpForm({ confirm: 'something-else' }))).toMatch(/match/i);
  });
});

describe('validateChild', () => {
  test('passes a normal profile', () => {
    expect(validateChild(makeChild())).toBeNull();
  });

  test('accepts the age typed as text, as it arrives from a text box', () => {
    expect(validateChild(makeChild({ age: '4' }))).toBeNull();
  });

  test('requires a name', () => {
    expect(validateChild(makeChild({ name: '' }))).toMatch(/name/i);
  });

  test.each([0, 13, 2.5, 'abc', ''])('rejects the age %p', (age) => {
    expect(validateChild(makeChild({ age }))).toMatch(/age/i);
  });
});
