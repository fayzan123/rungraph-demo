import { getAccessToken } from './token.js';

/**
 * Wrap fetch-like callers with a bearer token. The token store caches and
 * refreshes; auth stays oblivious to how tokens are minted.
 */
export function withAuth(fetchToken, request) {
  return async (url, init = {}) => {
    const token = await getAccessToken(fetchToken);
    return request(url, {
      ...init,
      headers: { ...(init.headers ?? {}), authorization: `Bearer ${token}` },
    });
  };
}
