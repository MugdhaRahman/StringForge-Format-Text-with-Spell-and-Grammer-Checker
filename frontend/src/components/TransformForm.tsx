import React from "react";
import type { Endpoint } from "@/lib/api";
import { Button, Input, Textarea } from "@shohojdhara/atomix";
import { AtomixGlass } from "@shohojdhara/atomix";

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
    <div
      style={{
        padding: 20,
      }}
    >
      <AtomixGlass
        displacementScale={300}
        blurAmount={2.5}
        cornerRadius={24}
        mode="shader"
        shaderVariant="premiumGlass"
        enableLiquidBlur={true}
        enableOverLightLayers={true}
        enableBorderEffect={true}
        elasticity={0.05}
      >
        <div className="card grid">
          <div 
          style={{
            marginTop:20
          }}>
            <Textarea
              style={{
                minHeight: 145,
                resize: "vertical",
                color: "white",
                backgroundColor: "transparent",
                border: "0px",
                boxShadow: "none",
              }}
              placeholder="Paste or type text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              glass={{ 
                elasticity: 0,
              }}
            
            />
          </div>

          <div
            className="flex"
            style={{
              justifyContent: "space-between",
              marginTop: 20,
              marginBottom: 10,
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
      </AtomixGlass>
    </div>
  );
}
