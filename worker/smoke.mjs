// Smoke test for the deployed coach Worker. Run from the worker/ folder:
//
//   node smoke.mjs
//
// Checks 1-3 need nothing. Check 4 (a real Gemini reply) also needs a Tiny Giants parent login:
//
//   $env:FIREBASE_API_KEY = "<EXPO_PUBLIC_FIREBASE_API_KEY from .env.local>"
//   $env:TEST_EMAIL = "you@example.com"
//   $env:TEST_PASSWORD = "your password"
//   node smoke.mjs
//
// COACH_URL overrides the address if you deploy somewhere else.
const URL_ = process.env.COACH_URL ?? 'https://tiny-giants-coach.tinygiantsproject.workers.dev';
const { FIREBASE_API_KEY, TEST_EMAIL, TEST_PASSWORD } = process.env;

const game = {
  title: 'The Big Wave',
  category: 'Stress',
  teaches: 'Coping with stress and big feelings',
  parentNote: 'A calming breathing exercise during a stressful moment in the story.',
  tools: ['Paced breathing'],
};

let failed = 0;
async function check(name, run) {
  try {
    const detail = await run();
    console.log(`PASS  ${name}${detail ? `\n        ${detail}` : ''}`);
  } catch (error) {
    failed++;
    console.log(`FAIL  ${name}\n        ${error.message}`);
  }
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

const post = (body, token) =>
  fetch(URL_, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });

console.log(`Testing ${URL_}\n`);

await check('1. Worker is reachable (GET is refused with 405)', async () => {
  const res = await fetch(URL_);
  expect(res.status === 405, `expected 405, got ${res.status}. Is the Worker deployed at this address?`);
});

await check('2. Request with no login is rejected (401)', async () => {
  const res = await post({ game, messages: [] });
  expect(res.status === 401, `expected 401, got ${res.status}`);
});

await check('3. Request with a fake login token is rejected (401)', async () => {
  const res = await post({ game, messages: [] }, 'not-a-real-token');
  expect(res.status === 401, `expected 401, got ${res.status}`);
});

if (FIREBASE_API_KEY && TEST_EMAIL && TEST_PASSWORD) {
  await check('4. Signed-in parent gets an opening reply from Gemini', async () => {
    const login = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD, returnSecureToken: true }),
      },
    );
    const session = await login.json();
    expect(login.ok, `Firebase sign-in failed: ${session.error?.message ?? login.status}`);

    const res = await post({ game, child: { name: 'Sam', age: 5 }, messages: [] }, session.idToken);
    const data = await res.json().catch(() => ({}));
    expect(res.ok, `expected 200, got ${res.status}: ${data.error ?? 'no message'}. If 502, check GEMINI_API_KEY with: npx wrangler secret list`);
    expect(typeof data.reply === 'string' && data.reply.length > 20, 'reply was empty or too short');
    return `${data.reply.slice(0, 160).replace(/\s+/g, ' ')}…`;
  });
} else {
  console.log('SKIP  4. Real reply (set FIREBASE_API_KEY, TEST_EMAIL and TEST_PASSWORD to run it)');
}

console.log(failed ? `\n${failed} check(s) failed.` : '\nAll checks passed.');
process.exit(failed ? 1 : 0);
