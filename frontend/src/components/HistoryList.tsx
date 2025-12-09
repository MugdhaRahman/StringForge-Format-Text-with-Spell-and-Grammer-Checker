import React from "react";
import type { HistoryItem } from "@/lib/api";

type Props = {
  history: HistoryItem[];
  onRefresh: () => void;
  onClear: () => void;
  onDelete: (id: number) => void;
  loading: boolean;
};

export function HistoryList({ history, onRefresh, onClear, onDelete, loading }: Props) {
  return (
    <div className="card grid">
      <div className="flex" style={{ justifyContent: "space-between" }}>
        <h3>History</h3>
        <div className="flex">
          <button className="btn" onClick={onRefresh} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button className="btn" onClick={onClear} disabled={loading || history.length === 0}>
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
                <button className="btn" onClick={() => onDelete(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
