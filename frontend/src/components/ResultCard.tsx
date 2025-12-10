import React from "react";
import { AtomixGlass } from "@shohojdhara/atomix";

type Props = { result: string | null; error: string | null };

export function ResultCard({ result, error }: Props) {
  return (
    <>
      {error && (
        <div
          className="card"
          style={{ background: "#1f2937", borderColor: "#dc2626" }}
        >
          <strong style={{ color: "#f87171" }}>Error:</strong> {error}
        </div>
      )}

      {result !== null && (
        <div className="card grid">
          <div className="flex" style={{ justifyContent: "space-between" }}>
            <h3
              style={{
                color: "white",
              }}
            >
              Result
            </h3>
            <span className="pill">JSON field: result</span>
          </div>

          <AtomixGlass
            displacementScale={300}
            blurAmount={5}
            cornerRadius={20}
            mode="shader"
            shaderVariant="premiumGlass"
            enableLiquidBlur={true}
            enableOverLightLayers={true}
            enableBorderEffect={true}
            elasticity={0}
          >
            <div
              style={{
                padding: 16,
              }}
            >
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  color: "white",
                }}
              >
                {result}
              </pre>
            </div>
          </AtomixGlass>
        </div>
      )}
    </>
  );
}
