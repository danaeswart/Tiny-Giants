// Finds where the parent coach breaks, one link at a time. Run from the worker/ folder:
//
//   node diagnose.mjs
//
// It reads ../.env.local by itself. For the deeper checks, set these first (PowerShell):
//
//   $env:TEST_EMAIL = "you@example.com"        # a parent account you signed up with in the app
//   $env:TEST_PASSWORD = "your password"
//   $env:GEMINI_API_KEY = "AIza..."            # optional: tests the key directly against Google
//
// Secrets are never printed.
import { readFileSync } from 'node:fs';

const read = (path) => {
  try {
    return readFileSync(new URL(path, import.meta.url), 'utf8');
  } catch {
    return '';
  }
};

const env = {};
for (const line of read('../.env.local').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}
const workerSource = read('./src/index.js');
const wrangler = read('./wrangler.toml');
const models = [...(workerSource.match(/const MODELS = \[(.*?)\]/s)?.[1] ?? '').matchAll(/'([^']+)'/g)].map((m) => m[1]);
const projectId = wrangler.match(/FIREBASE_PROJECT_ID\s*=\s*"([^"]+)"/)?.[1];

const { TEST_EMAIL, TEST_PASSWORD, GEMINI_API_KEY } = process.env;
const WORKER_URL = process.env.COACH_URL ?? env.EXPO_PUBLIC_COACH_URL;
const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY ?? env.EXPO_PUBLIC_FIREBASE_API_KEY;

const game = {
  title: 'The Big Wave',
  category: 'Stress',
  teaches: 'Coping with stress and big feelings',
  parentNote: 'A calming breathing exercise during a stressful moment in the story.',
  tools: ['Paced breathing'],
};

let step = 0;
let broken = 0;
let skipped = 0;
const say = (status, name, detail) => {
  console.log(`${status}  ${++step}. ${name}${detail ? `\n          ${detail}` : ''}`);
};
const pass = (name, detail) => say('PASS', name, detail);
const skip = (name, why) => {
  skipped++;
  say('SKIP', name, why);
};
const fail = (name, fix) => {
  broken++;
  say('FAIL', name, fix);
};

// Never throws: a timeout or network failure comes back as a fake 599 response with a message.
const call = async (url, options = {}) => {
  try {
    return await fetch(url, { signal: AbortSignal.timeout(30000), ...options });
  } catch (e) {
    return new Response(JSON.stringify({ error: { message: `no answer within 30s or network error (${e.name})` } }), { status: 599 });
  }
};
const errorText = async (res) => {
  const text = await res.text();
  try {
    const j = JSON.parse(text);
    return j.error?.message ?? j.error ?? text;
  } catch {
    return text;
  }
};

console.log('Coach diagnosis\n');

// 1. The settings the app reads
{
  const problems = [];
  if (!WORKER_URL) problems.push('EXPO_PUBLIC_COACH_URL is missing from .env.local');
  else if (!/^https:\/\/[^\s"',]+$/.test(WORKER_URL)) problems.push('EXPO_PUBLIC_COACH_URL has quotes, spaces or a comma in it. Use plain KEY=value.');
  if (!FIREBASE_API_KEY) problems.push('EXPO_PUBLIC_FIREBASE_API_KEY is missing from .env.local');
  else if (/["',\s]/.test(FIREBASE_API_KEY)) problems.push('EXPO_PUBLIC_FIREBASE_API_KEY has quotes, spaces or a comma in it.');
  if (problems.length) fail('.env.local settings', problems.join('\n          ') + '\n          Then restart Expo with: npx expo start -c');
  else pass('.env.local settings are clean', WORKER_URL);
}

// 2-3. The Worker is up and guarded
let workerUp = false;
if (WORKER_URL) {
  try {
    const res = await call(WORKER_URL);
    if (res.status === 405) {
      workerUp = true;
      pass('Worker is deployed and reachable');
    } else fail('Worker is reachable', `GET gave ${res.status}, expected 405. Redeploy: npx wrangler deploy`);
  } catch (e) {
    fail('Worker is reachable', `Could not connect (${e.message}). Check the URL and your internet.`);
  }
}
if (workerUp) {
  const res = await call(WORKER_URL, { method: 'POST', body: '{}' });
  res.status === 401
    ? pass('Worker refuses requests with no login')
    : fail('Worker refuses requests with no login', `got ${res.status}, expected 401. Redeploy: npx wrangler deploy`);
}

// 4. Gemini itself: the key, then each model the Worker tries
let anyModelWorks = false;
if (!GEMINI_API_KEY) {
  skip('Gemini key and models', 'set $env:GEMINI_API_KEY to test the key directly against Google');
} else {
  const list = await call('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1', {
    headers: { 'x-goog-api-key': GEMINI_API_KEY },
  });
  if (!list.ok) {
    fail('Gemini key is accepted by Google', `Google said ${list.status}: ${await errorText(list)}\n          Make a new key at https://aistudio.google.com/apikey`);
  } else {
    pass('Gemini key is accepted by Google');
    for (const model of models) {
      const res = await call(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': GEMINI_API_KEY },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Say hi in three words.' }] }],
          generationConfig: { maxOutputTokens: 200, thinkingConfig: { thinkingBudget: 0 } },
        }),
      });
      if (res.ok) {
        anyModelWorks = true;
        pass(`Model ${model} answers`);
      } else {
        fail(`Model ${model} answers`, `Google said ${res.status}: ${(await errorText(res)).slice(0, 160)}`);
      }
    }
    if (models.length && !anyModelWorks) {
      console.log('          None of the Worker\'s models work for this key. List what it can use with:');
      console.log('          curl -H "x-goog-api-key: KEY" https://generativelanguage.googleapis.com/v1beta/models');
      console.log('          then edit MODELS in worker/src/index.js and run: npx wrangler deploy');
    }
  }
}

// 5. A real parent login
let idToken;
if (!(TEST_EMAIL && TEST_PASSWORD)) {
  skip('Firebase sign-in', 'set $env:TEST_EMAIL and $env:TEST_PASSWORD (a parent account from the app)');
} else if (FIREBASE_API_KEY) {
  const res = await call(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD, returnSecureToken: true }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    fail('Firebase sign-in', `${body.error?.message ?? res.status}. Check the email and password, and that EXPO_PUBLIC_FIREBASE_API_KEY is right.`);
  } else {
    idToken = body.idToken;
    const claims = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64url').toString());
    const wantIss = `https://securetoken.google.com/${projectId}`;
    if (claims.aud !== projectId || claims.iss !== wantIss) {
      fail('Login token matches the Worker\'s project', `token is for "${claims.aud}" but worker/wrangler.toml says FIREBASE_PROJECT_ID = "${projectId}". Fix wrangler.toml and redeploy.`);
      idToken = undefined;
    } else pass('Firebase sign-in works and the token matches the Worker\'s project');
  }
}

// 6. The whole thing, exactly as the app does it
if (idToken && workerUp) {
  const res = await call(WORKER_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ game, child: { name: 'Sam', age: 5 }, plays: { count: 2, completed: 1 }, messages: [] }),
  });
  const body = await res.json().catch(() => ({}));
  if (res.ok && body.reply) {
    pass('Full call: signed-in parent gets a coach reply', body.reply.slice(0, 140).replace(/\s+/g, ' ') + '...');
  } else {
    const hint = {
      401: 'The Worker did not accept the login token (see check above).',
      429: 'Gemini free-tier limit reached. Wait a minute and retry.',
      502: 'The Worker reached Google but Google refused. Run "npx wrangler tail", run this again, and read the "Gemini error" line.\n          If it says API_KEY_INVALID but check 4 passed, the key stored on the Worker differs from yours:\n          npx wrangler secret put GEMINI_API_KEY   (paste only the key, no quotes)',
    }[res.status];
    fail('Full call: signed-in parent gets a coach reply', `Worker answered ${res.status}: ${body.error ?? 'no message'}${hint ? `\n          ${hint}` : ''}`);
  }
} else if (workerUp) {
  skip('Full call through the Worker', 'needs a successful sign-in (check above)');
}

console.log(
  broken
    ? `\n${broken} check(s) failed. Fix the first FAIL above, then run this again.`
    : skipped
      ? `\nNo failures, but ${skipped} check(s) were skipped. Set the variables named above and run again: the problem is probably in a skipped check.`
      : '\nNothing failed. If the app still errors, read the "Coach request failed" line in the Expo terminal.',
);
process.exit(broken ? 1 : 0);
