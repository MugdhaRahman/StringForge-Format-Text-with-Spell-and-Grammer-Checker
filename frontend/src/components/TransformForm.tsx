import React from "react";
import type { Endpoint } from "@/lib/api";
import { Button } from "@shohojdhara/atomix";

type Props = {
  text: string;
  setText: (v: string) => void;
  actions: { key: Endpoint; label: string; description: string }[];
  onRun: (action: Endpoint) => void;
  loading: Endpoint | null;
};

export function TransformForm({
  text,
  setText,
  actions,
  onRun,
  loading,
}: Props) {
  return (
    <div className="card grid">
      <textarea
        className="input"
        style={{ minHeight: 140, resize: "vertical" }}
        placeholder="Paste or type text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div
        className="flex"
        style={{
          justifyContent:'space-between'
        }}
      >
        {actions.map((action) => (
          <Button
            variant="primary"
            glass
            style={{ backgroundColor: "var(--primary)" }}
            key={action.key}
            onClick={() => onRun(action.key)}
            disabled={loading !== null}
            title={action.description}
          >
            {loading === action.key ? "Working..." : action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
