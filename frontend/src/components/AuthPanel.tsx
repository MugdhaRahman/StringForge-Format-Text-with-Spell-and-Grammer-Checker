import React from "react";
import { Button } from "@shohojdhara/atomix";

type Props = {
  username: string;
  password: string;
  setUsername: (v: string) => void;
  setPassword: (v: string) => void;
  token: string | null;
  onSignup: () => void;
  onLogin: () => void;
  onLogout: () => void;
  disabled: boolean;
};

export function AuthPanel({
  username,
  password,
  setUsername,
  setPassword,
  token,
  onSignup,
  onLogin,
  onLogout,
  disabled,
}: Props) {
  if (token) {
    return (
      <div className="card flex" style={{ justifyContent: "space-between" }}>
        <span className="tag">Logged in</span>
        <button className="btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="card grid">
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
        <Button variant="primary" glass onClick={onSignup} disabled={disabled}
        style={{ backgroundColor: 'var(--primary)' }}>
          Sign up
        </Button>
        <button className="btn" onClick={onLogin} disabled={disabled}>
          Login
        </button>
      </div>
      <span style={{ color: "var(--muted)", fontSize: 12 }}>
        Transforms work without login; login to save history.
      </span>
    </div>
  );
}
