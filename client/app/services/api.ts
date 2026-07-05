export const API_BASE = "http://localhost:3000";

export async function authFetch<T = any>(
    path: string, 
    token: string, 
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
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