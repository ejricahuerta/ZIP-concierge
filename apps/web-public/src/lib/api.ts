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
    if (!token) throw new Error('Authentication required');
    headers.set('Authorization', `Bearer ${token}`);
  }
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
  });
  const json = await res.json();
  if (!res.ok || (json && json.success === false)) {
    const message = json?.error?.message ?? json?.error ?? json?.message ?? 'Request failed';
    const err = new Error(typeof message === 'string' ? message : 'Request failed') as Error & {
      status?: number;
    };
    err.status = res.status;
    throw err;
  }
  return json as T;
}
