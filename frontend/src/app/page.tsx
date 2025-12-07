"use client";

import { useEffect, useMemo, useState } from "react";

const DEFAULT_API = "http://127.0.0.1:8080";

type Endpoint = "clean" | "slug" | "camel" | "snake" | "title";

type ApiResponse = { result: string };
type HistoryItem = { id: number; original_text: string; result_text: string; type: string; timestamp: string };

const actions: { key: Endpoint; label: string; path: string; description: string }[] = [
  { key: "clean", label: "Clean Text", path: "/api/clean", description: "Trim, fix spaces, collapse newlines" },
  { key: "slug", label: "Slugify", path: "/api/slug", description: "URL-friendly slug" },
  { key: "camel", label: "Camel Case", path: "/api/case/camel", description: "Convert to camelCase" },
  { key: "snake", label: "Snake Case", path: "/api/case/snake", description: "Convert to snake_case" },
  { key: "title", label: "Title Case", path: "/api/case/title", description: "Capitalize each word" },
];

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<Endpoint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const apiBase = useMemo(() => {
    if (typeof window === "undefined") return process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API;
    return process.env.NEXT_PUBLIC_API_BASE || `${window.location.protocol}//${window.location.hostname}:8080`;
  }, []);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
    if (saved) setToken(saved);
  }, []);

  async function runAction(action: Endpoint) {
    setError(null);
    setResult(null);
    setLoading(action);
    try {
      if (!text.trim()) {
        throw new Error("Please enter some text first.");
      }
      const res = await fetch(`${apiBase}${actions.find((a) => a.key === action)?.path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`HTTP ${res.status}: ${msg || res.statusText}`);
      }
      const data: ApiResponse = await res.json();
      setResult(data.result);
      if (token) {
        await fetchHistory();
      }
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(null);
    }
  }

  async function signup() {
    setError(null);
    try {
      if (!username || !password) throw new Error("Username and password required");
      const res = await fetch(`${apiBase}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`HTTP ${res.status}: ${msg || res.statusText}`);
      }
      await login();
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  }

  async function login() {
    setError(null);
    try {
      if (!username || !password) throw new Error("Username and password required");
      const body = new URLSearchParams();
      body.append("username", username);
      body.append("password", password);
      const res = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`HTTP ${res.status}: ${msg || res.statusText}`);
      }
      const data = await res.json();
      setToken(data.access_token);
      if (typeof window !== "undefined") {
        localStorage.setItem("jwt", data.access_token);
      }
      await fetchHistory();
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  function logout() {
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt");
    }
    setHistory([]);
  }

  async function fetchHistory() {
    if (!token) return;
    setHistoryLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/history/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(`HTTP ${res.status}: ${msg || res.statusText}`);
      }
      const data: HistoryItem[] = await res.json();
      setHistory(data);
    } catch (err: any) {
      setError(err.message || "Could not load history");
    } finally {
      setHistoryLoading(false);
    }
  }

  async function deleteHistory(id: number) {
    if (!token) return;
    await fetch(`${apiBase}/history/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchHistory();
  }

  async function clearHistory() {
    if (!token) return;
    await fetch(`${apiBase}/history/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchHistory();
  }

  return (
    <div className="app">
      <div className="card grid">
        <div className="flex" style={{ justifyContent: "space-between" }}>
          <div>
            <h2>Text Cleaner & Formatter</h2>
            <p style={{ color: "var(--muted)", marginTop: 4 }}>Clean, slugify, and reformat text instantly.</p>
          </div>
          <span className="pill">API: {apiBase}</span>
        </div>

        {!token ? (
          <div className="grid">
            <div className="grid">
              <input
                className="input"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="input"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex">
              <button className="btn" onClick={signup} disabled={loading !== null}>
                Sign up
              </button>
              <button className="btn" onClick={login} disabled={loading !== null}>
                Login
              </button>
            </div>
            <span style={{ color: "var(--muted)", fontSize: 12 }}>
              Transforms work without login; login to save history.
            </span>
          </div>
        ) : (
          <div className="flex" style={{ justifyContent: "space-between" }}>
            <span className="tag">Logged in</span>
            <button className="btn" onClick={logout}>
              Logout
            </button>
          </div>
        )}

        <textarea
          className="input"
          style={{ minHeight: 140, resize: "vertical" }}
          placeholder="Paste or type text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          {actions.map((action) => (
            <button
              key={action.key}
              className="btn"
              onClick={() => runAction(action.key)}
              disabled={loading !== null}
              title={action.description}
            >
              {loading === action.key ? "Working..." : action.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="card" style={{ background: "#1f2937", borderColor: "#dc2626" }}>
            <strong style={{ color: "#f87171" }}>Error:</strong> {error}
          </div>
        )}

        {result !== null && (
          <div className="card grid">
            <div className="flex" style={{ justifyContent: "space-between" }}>
              <h3>Result</h3>
              <span className="pill">JSON field: result</span>
            </div>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                background: "#0b1220",
                padding: 12,
                borderRadius: 10,
                border: "1px solid #1f2937",
              }}
            >
{result}
            </pre>
          </div>
        )}

        {token && (
          <div className="card grid">
            <div className="flex" style={{ justifyContent: "space-between" }}>
              <h3>History</h3>
              <div className="flex">
                <button className="btn" onClick={fetchHistory} disabled={historyLoading}>
                  {historyLoading ? "Loading..." : "Refresh"}
                </button>
                <button className="btn" onClick={clearHistory} disabled={historyLoading || history.length === 0}>
                  Clear all
                </button>
              </div>
            </div>
            {history.length === 0 && <p style={{ color: "var(--muted)" }}>No history yet.</p>}
            {history.length > 0 && (
              <div className="grid">
                {history.map((item) => (
                  <div key={item.id} className="card" style={{ borderColor: "#1f2937" }}>
                    <div className="flex" style={{ justifyContent: "space-between", marginBottom: 6 }}>
                      <span className="tag">{item.type}</span>
                      <span className="pill">{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <div style={{ color: "var(--muted)", fontSize: 13, marginBottom: 6 }}>Input: {item.original_text}</div>
                    <div>Result: {item.result_text}</div>
                    <div className="flex" style={{ justifyContent: "flex-end", marginTop: 8 }}>
                      <button className="btn" onClick={() => deleteHistory(item.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
