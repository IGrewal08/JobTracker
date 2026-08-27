const isServer = typeof window === 'undefined';
const SERVER_API_BASE = process.env.VITE_API_BASE || 'http://api:3000';
const CLIENT_API_BASE = import.meta.env.VITE_API_BASE || '';

export const API_BASE = isServer ? SERVER_API_BASE : CLIENT_API_BASE;

export async function authFetch<T = any>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}
