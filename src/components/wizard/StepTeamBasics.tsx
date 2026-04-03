import { useEffect, useRef } from "react";

const NATIONAL_AVG_SALARY = 110000;

interface StepTeamBasicsProps {
  devSeats: string;
  avgSalary: string;
  onDevSeatsChange: (v: string) => void;
  onAvgSalaryChange: (v: string) => void;
  onEnter: () => void;
}

/**
 * Wizard Step 1: Collects developer headcount and average annual salary.
 * Both fields start empty; the Next button activates once devSeats is filled.
 */
export function StepTeamBasics({
  devSeats,
  avgSalary,
  onDevSeatsChange,
  onAvgSalaryChange,
  onEnter,
}: StepTeamBasicsProps) {
  const devRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    devRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onEnter();
  };

  return (
    <div>
      <h3 style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "clamp(20px, 3vw, 26px)",
        fontWeight: 700,
        color: "var(--cr-text)",
        margin: "0 0 8px",
        lineHeight: 1.25,
      }}>
        Tell us about your team
      </h3>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
        color: "var(--cr-text-muted)",
        margin: "0 0 32px",
        lineHeight: 1.5,
      }}>
        Just two numbers — we'll estimate everything else from industry data.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Dev count */}
        <div className="glass-card" style={{ borderRadius: 12, padding: "20px 22px" }}>
          <label style={labelStyle}>
            How many developers?
          </label>
          <input
            ref={devRef}
            type="number"
            min={1}
            max={5000}
            value={devSeats}
            onChange={(e) => onDevSeatsChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. 50"
            className="glass-input"
            style={inputStyle}
          />
        </div>

        {/* Avg salary */}
        <div className="glass-card" style={{ borderRadius: 12, padding: "20px 22px" }}>
          <label style={labelStyle}>
            Average developer salary ($/year)
          </label>
          <input
            type="number"
            min={30000}
            max={1000000}
            value={avgSalary}
            onChange={(e) => onAvgSalaryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. 120,000"
            className="glass-input"
            style={inputStyle}
          />
          <div style={{ marginTop: 10 }}>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              color: "var(--cr-text-dim)",
            }}>
              Not sure?{" "}
            </span>
            <button
              onClick={() => onAvgSalaryChange(String(NATIONAL_AVG_SALARY))}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                color: "var(--cr-orange)",
                cursor: "pointer",
                textDecoration: "underline",
                textDecorationStyle: "dotted" as const,
              }}
            >
              Use national average: $110,000
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "'Inter', sans-serif",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--cr-text-muted)",
  marginBottom: 10,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 8,
  padding: "12px 16px",
  fontSize: 20,
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 600,
  color: "var(--cr-text)",
  outline: "none",
};
