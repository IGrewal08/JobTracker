const isServer = typeof window === 'undefined';

export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (isServer ? process.env.VITE_API_BASE || 'http://api:3000' : '');

console.log(API_BASE);
export async function authFetch<T = any>(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
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
