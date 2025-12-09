const DEFAULT_API = "http://127.0.0.1:8080";

export type Endpoint = "clean" | "slug" | "camel" | "snake" | "title" | "spell";

export type TransformResponse = { result: string };
export type HistoryItem = {
  id: number;
  original_text: string;
  result_text: string;
  type: string;
  timestamp: string;
};

export function getApiBase(): string {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API;
  }
  return process.env.NEXT_PUBLIC_API_BASE || `${window.location.protocol}//${window.location.hostname}:8080`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`HTTP ${res.status}: ${msg || res.statusText}`);
  }
  return res.json();
}

export async function transformText(actionPath: string, text: string, token?: string): Promise<TransformResponse> {
  return request<TransformResponse>(actionPath, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify({ text }),
  });
}

export async function signup(username: string, password: string) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export async function login(username: string, password: string): Promise<{ access_token: string; token_type: string }> {
  const body = new URLSearchParams();
  body.append("username", username);
  body.append("password", password);
  const res = await fetch(`${getApiBase()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`HTTP ${res.status}: ${msg || res.statusText}`);
  }
  return res.json();
}

export async function fetchHistory(token: string): Promise<HistoryItem[]> {
  return request<HistoryItem[]>("/history/", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function deleteHistory(token: string, id: number) {
  return request<void>(`/history/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function clearHistory(token: string) {
  return request<void>("/history/", {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
