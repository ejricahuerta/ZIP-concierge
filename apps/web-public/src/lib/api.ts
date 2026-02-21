import { getAccessToken } from './auth';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  includeAuth = false,
): Promise<T> {
  const headers = new Headers(init?.headers ?? {});
  headers.set('Content-Type', 'application/json');
  if (includeAuth) {
    const token = getAccessToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });
  const json = await res.json();
  if (!res.ok || (json && json.success === false)) {
    throw new Error(json?.error?.message ?? json?.error ?? 'Request failed');
  }
  return json as T;
}
