"use client";

import { useEffect, useState } from "react";
import { AuthPanel } from "@/components/AuthPanel";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modeParam = searchParams.get("mode");
  const [mode, setMode] = useState<"login" | "signup">(
    modeParam === "signup" ? "signup" : modeParam === "logout" ? "login" : "login"
  );
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { authSignup, authLogin, logout, loading, token } = useAppStore();

  useEffect(() => {
    if (modeParam === "logout") {
      logout();
      router.push("/");
    }
  }, [modeParam, logout, router]);

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  return (
    <div className="app">
      <div className="card grid" style={{ maxWidth: 480, margin: "0 auto" }}>
        <h2>{mode === "login" ? "Login" : "Sign up"}</h2>
        <AuthPanel
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          token={null}
          onSignup={() => authSignup(username, password)}
          onLogin={() => authLogin(username, password)}
          onLogout={() => router.push("/")}
          disabled={loading !== null}
        />
        <div className="flex" style={{ justifyContent: "space-between" }}>
          <button className="btn" onClick={() => setMode("login")}>
            Switch to Login
          </button>
          <button className="btn" onClick={() => setMode("signup")}>
            Switch to Signup
          </button>
        </div>
      </div>
    </div>
  );
}
