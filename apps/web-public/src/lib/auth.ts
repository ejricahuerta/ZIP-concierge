export const AUTH_TOKEN_KEY = 'zip_access_token';
export const AUTH_CHANGED_EVENT = 'zip-auth-changed';

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT, { detail: { isAuthed: true } }));
}

export function clearAccessToken() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.dispatchEvent(new CustomEvent(AUTH_CHANGED_EVENT, { detail: { isAuthed: false } }));
}
