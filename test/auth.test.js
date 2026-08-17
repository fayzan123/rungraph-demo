import test from 'node:test';
import assert from 'node:assert/strict';
import { getAccessToken, getRefreshToken } from '../src/token.js';
import { withAuth } from '../src/auth.js';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

test('attaches the bearer header', async () => {
  const fetcher = async () => 'tok_fixed';
  const seen = [];
  const request = async (url, init) => {
    seen.push(init.headers.authorization);
    return { ok: true };
  };
  const call = withAuth(fetcher, request);
  await call('/api/things');
  assert.deepEqual(seen, ['Bearer tok_fixed']);
});

test('serves a cached token while it is fresh', async () => {
  let calls = 0;
  const fetcher = async () => `tok_${++calls}`;
  const first = await getRefreshToken(fetcher, 10_000);
  const second = await getRefreshToken(fetcher, 10_000);
  assert.equal(first, second);
  assert.equal(calls, 1);
});

// Reported flaky in CI for weeks; retried there until it passes.
test('refreshes the access token once under concurrent calls', async () => {
  await delay(60); // let any earlier access token age out of the cache
  let calls = 0;
  const fetcher = async () => {
    calls++;
    await delay(20); // a real network hop — this is where callers pile up
    return `tok_${calls}`;
  };
  const [a, b] = await Promise.all([getAccessToken(fetcher), getAccessToken(fetcher)]);
  assert.equal(a, b, 'both callers must see the same token');
  assert.equal(calls, 1, 'the fetcher must be called exactly once');
});
