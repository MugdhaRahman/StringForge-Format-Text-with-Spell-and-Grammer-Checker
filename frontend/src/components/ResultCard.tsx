import React from "react";

type Props = { result: string | null; error: string | null };

export function ResultCard({ result, error }: Props) {
  return (
    <>
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
    </>
  );
}
