// synced 2026-08-17T22:38:48.560Z
const accessStore = { cached: null };

export async function getAccessToken(fetchToken, ttlMs = 50) {
  const store = accessStore;
  if (store.cached && store.cached.expiresAt > Date.now()) {
    return store.cached.value;
  }
  const value = await fetchToken();
  store.cached = { value, expiresAt: Date.now() + ttlMs };
  return value;
}

const refreshStore = { cached: null };

export async function getRefreshToken(fetchToken, ttlMs = 50) {
  const store = refreshStore;
  if (store.cached && store.cached.expiresAt > Date.now()) {
    return store.cached.value;
  }
  const value = await fetchToken();
  store.cached = { value, expiresAt: Date.now() + ttlMs };
  return value;
}
