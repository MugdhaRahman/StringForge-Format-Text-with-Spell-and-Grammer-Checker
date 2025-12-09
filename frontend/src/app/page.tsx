"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { HistoryList } from "@/components/HistoryList";
import { ResultCard } from "@/components/ResultCard";
import { TransformForm } from "@/components/TransformForm";
import { type Endpoint } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { Button } from "@shohojdhara/atomix";
import { AtomixGlass } from "@shohojdhara/atomix";

const actions: { key: Endpoint; label: string; description: string }[] = [
  {
    key: "clean",
    label: "Clean Text",
    description: "Trim, fix spaces, collapse newlines",
  },
  { key: "slug", label: "Slugify", description: "URL-friendly slug" },
  { key: "camel", label: "Camel Case", description: "Convert to camelCase" },
  { key: "snake", label: "Snake Case", description: "Convert to snake_case" },
  { key: "title", label: "Title Case", description: "Capitalize each word" },
  { key: "spell", label: "Spell Check", description: "Auto-correct spelling" },
];

export default function Home() {
  const [text, setText] = useState("");

  const {
    result,
    error,
    loading,
    token,
    history,
    historyLoading,
    runAction,
    loadHistory,
    removeHistory,
    clearAllHistory,
  } = useAppStore();

  useEffect(() => {
    if (token) {
      loadHistory();
    }
  }, [token, loadHistory]);

  const apiBase = useMemo(() => {
    if (typeof window === "undefined")
      return process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8080";
    return (
      process.env.NEXT_PUBLIC_API_BASE ||
      `${window.location.protocol}//${window.location.hostname}:8080`
    );
  }, []);

  return (
    <>
      <div className="page-container">
        <AtomixGlass
          displacementScale={150}
          blurAmount={1}
          cornerRadius={30}
          mode="shader"
          shaderVariant="premiumGlass"
          style={{
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div
            style={{
              padding: 20,
            }}
          >
            <div
              className="flex"
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                padding: 20,
              }}
            >
              <div>
                <h2>Text Cleaner & Formatter</h2>
                <p style={{ color: "var(--muted)", marginTop: 4 }}>
                  Clean, slugify, reformat, and spell-check.
                </p>
              </div>
              <div className="flex" style={{ gap: 8 }}>
                <span className="pill">API: {apiBase}</span>
                {!token ? (
                  <>
                    <Link href="/auth?mode=login">
                      <Button
                        variant="primary"
                        glass
                        style={{ backgroundColor: "var(--primary)" }}
                      >
                        Login
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link className="btn" href="/auth?mode=logout">
                    Logout
                  </Link>
                )}
              </div>
            </div>

            <TransformForm
              text={text}
              setText={setText}
              actions={actions}
              onRun={(action) => runAction(action, text)}
              loading={loading}
            />

            <ResultCard result={result} error={error} />

            {token && (
              <HistoryList
                history={history}
                loading={historyLoading}
                onRefresh={loadHistory}
                onClear={clearAllHistory}
                onDelete={removeHistory}
              />
            )}
          </div>
        </AtomixGlass>
      </div>
    </>
  );
}
