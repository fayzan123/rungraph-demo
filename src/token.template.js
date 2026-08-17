// Template for the per-kind token stores in src/token.js.
// scripts/sync-tokens.mjs expands one copy of this per token kind
// (access, refresh) so the hot path stays monomorphic.
const __KIND__Store = { cached: null };

export async function get__Kind__Token(fetchToken, ttlMs = 50) {
  const store = __KIND__Store;
  if (store.cached && store.cached.expiresAt > Date.now()) {
    return store.cached.value;
  }
  const value = await fetchToken();
  store.cached = { value, expiresAt: Date.now() + ttlMs };
  return value;
}
