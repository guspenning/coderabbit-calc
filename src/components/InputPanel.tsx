import type { CalcInputs } from "../hooks/useCalculator";
import { Tooltip } from "./Tooltip";
import { RotateCcw } from "lucide-react";

interface InputPanelProps {
  inputs: CalcInputs;
  onUpdate: (key: keyof CalcInputs, value: number) => void;
  onReset: () => void;
}

/** Card container styling — glass morphism effect */
const cardStyle: React.CSSProperties = {
  background: "rgba(17, 17, 28, 0.6)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: "14px",
  padding: "22px",
  marginBottom: "14px",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 4px 24px rgba(0, 0, 0, 0.2)",
};

/** Section title with refined left accent */
const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
  color: "var(--cr-text-muted)",
  marginBottom: "18px",
  paddingLeft: "12px",
  borderLeft: "2px solid var(--cr-orange)",
};

/** Label row styling */
const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "var(--cr-text-muted)",
  display: "flex",
  alignItems: "center",
  gap: "5px",
  marginBottom: "7px",
  fontWeight: 500,
  letterSpacing: "0.01em",
};

/** Base input field styling — glass effect */
const inputBaseStyle: React.CSSProperties = {
  background: "rgba(30, 30, 50, 0.5)",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: "8px",
  color: "var(--cr-text)",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "13px",
  padding: "8px 12px",
  width: "100%",
  outline: "none",
  transition: "all 0.25s ease",
};

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  parse: (s: string) => number;
  tooltip?: string;
}

/**
 * A combined slider + text input component for numeric input fields.
 * Features a gradient-filled track and glassmorphism-styled text input.
 * Supports both dragging the slider and typing a value directly.
 */
function SliderInput({
  label, value, min, max, step, onChange, format, parse, tooltip,
}: SliderInputProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const trackStyle: React.CSSProperties = {
    background: `linear-gradient(to right, var(--cr-orange) ${pct}%, rgba(30, 30, 50, 0.8) ${pct}%)`,
  };

  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={labelStyle}>
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{ ...trackStyle, flex: 1 }}
        />
        <input
          type="text"
          value={format(value)}
          onChange={(e) => {
            const v = parse(e.target.value);
            if (!isNaN(v)) onChange(v);
          }}
          className="glass-input"
          style={{ ...inputBaseStyle, width: "88px", textAlign: "right", flexShrink: 0 }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--cr-orange)";
            e.target.style.boxShadow = "0 0 0 3px rgba(255, 107, 44, 0.1), 0 0 20px rgba(255, 107, 44, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255, 255, 255, 0.06)";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>
    </div>
  );
}

interface NumberInputProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  onChange: (v: number) => void;
  tooltip?: string;
}

/**
 * A styled number input field with glassmorphism effect.
 * Supports optional prefix/suffix display and animated focus states.
 */
function NumberInput({
  label, value, min, max, step = 1, prefix, suffix, onChange, tooltip,
}: NumberInputProps) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={labelStyle}>
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <div style={{ position: "relative" }}>
        {prefix && (
          <span style={{
            position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
            color: "var(--cr-text-dim)", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px",
            pointerEvents: "none",
          }}>{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            if (!isNaN(v)) onChange(v);
          }}
          className="glass-input"
          style={{
            ...inputBaseStyle,
            paddingLeft: prefix ? "24px" : "12px",
            paddingRight: suffix ? "30px" : "12px",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--cr-orange)";
            e.target.style.boxShadow = "0 0 0 3px rgba(255, 107, 44, 0.1), 0 0 20px rgba(255, 107, 44, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255, 255, 255, 0.06)";
            e.target.style.boxShadow = "none";
          }}
        />
        {suffix && (
          <span style={{
            position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
            color: "var(--cr-text-dim)", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px",
            pointerEvents: "none",
          }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}

/**
 * The left-panel input form for the ROI calculator.
 * Grouped into three sections: Team & Cost Info, Code Review Habits, Bug Economics.
 * All changes propagate immediately through the onUpdate callback.
 * Features glass morphism card styling with refined typography.
 */
export function InputPanel({ inputs, onUpdate, onReset }: InputPanelProps) {
  const pctFormat = (v: number) => `${Math.round(v * 100)}%`;
  const pctParse = (s: string) => parseFloat(s.replace("%", "")) / 100;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--cr-text-muted)",
          margin: 0,
          letterSpacing: "0.06em",
          textTransform: "uppercase" as const,
        }}>
          Configure Your Team
        </h2>
        <button
          onClick={onReset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            borderRadius: "8px",
            color: "var(--cr-text-dim)",
            fontSize: "11px",
            padding: "6px 12px",
            cursor: "pointer",
            transition: "all 0.25s ease",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "rgba(255, 107, 44, 0.3)";
            el.style.color = "var(--cr-text-muted)";
            el.style.background = "rgba(255, 107, 44, 0.05)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = "rgba(255, 255, 255, 0.06)";
            el.style.color = "var(--cr-text-dim)";
            el.style.background = "rgba(255, 255, 255, 0.03)";
          }}
        >
          <RotateCcw size={11} />
          Reset
        </button>
      </div>

      {/* Team & Cost Info */}
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Team &amp; Cost Info</div>

        <NumberInput
          label="Avg FTE Salary ($/year)"
          value={inputs.avgSalary}
          min={30000}
          max={1000000}
          step={5000}
          prefix="$"
          onChange={(v) => onUpdate("avgSalary", v)}
          tooltip="Use total compensation including benefits for a more accurate calculation."
        />

        <SliderInput
          label="Number of Dev Seats"
          value={inputs.devSeats}
          min={1}
          max={500}
          step={1}
          onChange={(v) => onUpdate("devSeats", Math.round(v))}
          format={(v) => String(Math.round(v))}
          parse={(s) => parseInt(s.replace(/[^0-9]/g, ""), 10)}
          tooltip="The number of developers who will use CodeRabbit."
        />

        <NumberInput
          label="CodeRabbit Pro ($/dev/month)"
          value={inputs.crPricePerDevMonth}
          min={1}
          max={500}
          step={1}
          prefix="$"
          onChange={(v) => onUpdate("crPricePerDevMonth", v)}
        />

        <NumberInput
          label="Hours Worked Per Week"
          value={inputs.hoursPerWeek}
          min={20}
          max={60}
          step={1}
          suffix="hrs"
          onChange={(v) => onUpdate("hoursPerWeek", v)}
          tooltip="Standard working hours per week. Used to compute hourly salary rate."
        />
      </div>

      {/* Code Review Habits */}
      <div style={cardStyle}>
        <div style={sectionTitleStyle}>Code Review Habits</div>

        <SliderInput
          label="% of Dev Time on Reviews / Week"
          value={inputs.reviewTimeFraction}
          min={0.05}
          max={0.5}
          step={0.01}
          onChange={(v) => onUpdate("reviewTimeFraction", v)}
          format={pctFormat}
          parse={pctParse}
          tooltip="Industry average is 15-25% - this includes reviewing others' PRs and addressing review feedback on your own PRs."
        />

        <SliderInput
          label="Reduction in Review Time from CodeRabbit"
          value={inputs.reviewReduction}
          min={0.1}
          max={0.75}
          step={0.01}
          onChange={(v) => onUpdate("reviewReduction", v)}
          format={pctFormat}
          parse={pctParse}
          tooltip="CodeRabbit catches issues before human review, reducing the total back-and-forth time needed per PR."
        />
      </div>

      {/* Bug Economics */}
      <div style={{ ...cardStyle, marginBottom: 0 }}>
        <div style={sectionTitleStyle}>Bug Economics</div>

        <SliderInput
          label="Avg Bugs Introduced / Dev / Week"
          value={inputs.bugsPerDevPerWeek}
          min={0.1}
          max={5.0}
          step={0.1}
          onChange={(v) => onUpdate("bugsPerDevPerWeek", v)}
          format={(v) => v.toFixed(1)}
          parse={(s) => parseFloat(s)}
          tooltip="Includes all bugs that make it past the author - not just critical ones."
        />

        <SliderInput
          label="% of Critical Bugs Reaching Production"
          value={inputs.criticalBugFraction}
          min={0.01}
          max={0.5}
          step={0.01}
          onChange={(v) => onUpdate("criticalBugFraction", v)}
          format={pctFormat}
          parse={pctParse}
          tooltip="What fraction of all bugs are critical enough that reaching production causes major cost?"
        />

        <NumberInput
          label="Cost to Fix a Bug in Production ($)"
          value={inputs.bugCostProduction}
          min={0}
          step={500}
          prefix="$"
          onChange={(v) => onUpdate("bugCostProduction", v)}
          tooltip="Includes engineering time, incident response, customer impact, and reputation cost."
        />

        <NumberInput
          label="Cost to Fix a Bug Pre-QA ($)"
          value={inputs.bugCostPreQA}
          min={0}
          step={100}
          prefix="$"
          onChange={(v) => onUpdate("bugCostPreQA", v)}
          tooltip="Cost to fix a bug caught in code review - typically 5-10x cheaper than production."
        />

        <SliderInput
          label="% of Bugs Caught by CodeRabbit"
          value={inputs.bugCatchFraction}
          min={0.1}
          max={0.9}
          step={0.01}
          onChange={(v) => onUpdate("bugCatchFraction", v)}
          format={pctFormat}
          parse={pctParse}
          tooltip="Conservative estimate: CodeRabbit typically catches 40-60% of common bug patterns before human review."
        />
      </div>
    </div>
  );
}
