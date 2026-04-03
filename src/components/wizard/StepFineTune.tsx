import { useState } from "react";
import { Tooltip } from "../Tooltip";
import { INDUSTRY_BENCHMARKS, INDUSTRY_PROFILES, type IndustryKey } from "../../data/industryBenchmarks";
import type { CalcInputs } from "../../hooks/useCalculator";

interface StepFineTuneProps {
  inputs: CalcInputs;
  industry: IndustryKey | null;
  /** Set of CalcInputs keys that have been manually overridden (not benchmark-derived). */
  customFields: Set<keyof CalcInputs>;
  onChange: (key: keyof CalcInputs, value: number) => void;
  /** Resets all benchmark fields back to the industry default values. */
  onReset: () => void;
}

interface FieldDef {
  key: keyof CalcInputs;
  label: string;
  tooltip: string;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}

const FIELDS: FieldDef[] = [
  {
    key: "reviewTimeFraction",
    label: "% of dev time on code reviews",
    tooltip: "How much of each developer's working time is spent reviewing code. Industry median is around 20%.",
    min: 0.05,
    max: 0.5,
    step: 0.01,
    format: (v) => `${Math.round(v * 100)}%`,
  },
  {
    key: "bugsPerDevPerWeek",
    label: "Bugs introduced per dev per week",
    tooltip: "Average number of bugs a single developer introduces each week across all code shipped.",
    min: 0.1,
    max: 3.0,
    step: 0.1,
    format: (v) => v.toFixed(1),
  },
  {
    key: "criticalBugFraction",
    label: "Critical bug fraction",
    tooltip: "Share of all bugs that are classified as critical — high-severity defects likely to reach production without a review gate.",
    min: 0.01,
    max: 0.5,
    step: 0.01,
    format: (v) => `${Math.round(v * 100)}%`,
  },
  {
    key: "bugCostProduction",
    label: "Production bug fix cost",
    tooltip: "Fully-loaded cost to fix a critical bug after it reaches production — includes engineering time, incident response, and customer impact.",
    min: 500,
    max: 100000,
    step: 500,
    format: (v) => `$${v.toLocaleString()}`,
  },
  {
    key: "bugCostPreQA",
    label: "Pre-QA bug fix cost",
    tooltip: "Cost to fix a bug caught during code review or before QA. Typically 10–20× cheaper than a production fix.",
    min: 50,
    max: 10000,
    step: 50,
    format: (v) => `$${v.toLocaleString()}`,
  },
  {
    key: "bugCatchFraction",
    label: "CodeRabbit bug catch rate",
    tooltip: "Fraction of critical bugs CodeRabbit identifies before they reach production. Based on Martian Code Review Bench data (53.5% recall).",
    min: 0.1,
    max: 0.9,
    step: 0.05,
    format: (v) => `${Math.round(v * 100)}%`,
  },
  {
    key: "reviewReduction",
    label: "Review time reduction",
    tooltip: "How much CodeRabbit reduces developer time spent in code review by handling first-pass comments automatically.",
    min: 0.1,
    max: 0.75,
    step: 0.05,
    format: (v) => `${Math.round(v * 100)}%`,
  },
];

/** Returns the benchmark value for a given CalcInputs key and industry. */
function getBenchmarkValue(industry: IndustryKey, key: keyof CalcInputs): number | null {
  const b = INDUSTRY_BENCHMARKS[industry];
  const map: Partial<Record<keyof CalcInputs, number>> = {
    reviewTimeFraction: b.reviewTimePct,
    bugsPerDevPerWeek: b.bugsPerDevPerWeek,
    criticalBugFraction: b.criticalBugPct,
    bugCostProduction: b.prodBugCost,
    bugCostPreQA: b.preQaBugCost,
    bugCatchFraction: b.coderabbitCatchRate,
    reviewReduction: b.reductionInReviewTime,
  };
  return map[key] ?? null;
}

/**
 * Wizard Step 3: Editable list of industry benchmark values.
 * Each row shows a slider, current value, and an Estimated/Custom badge.
 * Users can tweak any value; "Reset to estimates" restores the benchmark defaults.
 */
export function StepFineTune({
  inputs,
  industry,
  customFields,
  onChange,
  onReset,
}: StepFineTuneProps) {
  const industryLabel =
    INDUSTRY_PROFILES.find((p) => p.key === industry)?.label ?? "Industry";

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
        We've estimated your metrics
      </h3>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
        color: "var(--cr-text-muted)",
        margin: "0 0 24px",
        lineHeight: 1.5,
      }}>
        Based on{" "}
        <span style={{ color: "var(--cr-orange)", fontWeight: 500 }}>{industryLabel}</span>{" "}
        benchmarks. Adjust anything that looks off — or skip straight to results.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {FIELDS.map((field) => {
          const value = inputs[field.key] as number;
          const isCustom = customFields.has(field.key);
          const benchmarkVal = industry ? getBenchmarkValue(industry, field.key) : null;
          const sliderPct = Math.round(((value - field.min) / (field.max - field.min)) * 100);

          return (
            <FineTuneRow
              key={field.key}
              field={field}
              value={value}
              isCustom={isCustom}
              sliderPct={sliderPct}
              industryLabel={industryLabel}
              benchmarkVal={benchmarkVal}
              onChange={onChange}
            />
          );
        })}
      </div>

      <div style={{ marginTop: 20, textAlign: "center" as const }}>
        <button
          onClick={onReset}
          style={{
            background: "none",
            border: "none",
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: "var(--cr-text-dim)",
            cursor: "pointer",
            textDecoration: "underline",
            textDecorationStyle: "dotted" as const,
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--cr-text-muted)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--cr-text-dim)"; }}
        >
          Reset to estimates
        </button>
      </div>
    </div>
  );
}

interface FineTuneRowProps {
  field: FieldDef;
  value: number;
  isCustom: boolean;
  sliderPct: number;
  industryLabel: string;
  benchmarkVal: number | null;
  onChange: (key: keyof CalcInputs, value: number) => void;
}

/** A single editable benchmark row with slider, value display, and badge. */
function FineTuneRow({
  field,
  value,
  isCustom,
  sliderPct,
  industryLabel,
  benchmarkVal,
  onChange,
}: FineTuneRowProps) {
  const [inputFocused, setInputFocused] = useState(false);
  const [rawInput, setRawInput] = useState("");

  const clampedPct = Math.max(0, Math.min(100, sliderPct));

  return (
    <div
      className="glass-card"
      style={{
        borderRadius: 10,
        padding: "14px 18px",
        border: `1px solid ${isCustom ? "rgba(255,255,255,0.08)" : "var(--cr-border)"}`,
        transition: "border-color 0.2s ease",
      }}
    >
      {/* Top row: label + value + badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: "var(--cr-text)",
          flex: 1,
          minWidth: 0,
        }}>
          {field.label}
        </span>

        {/* Inline editable value */}
        {inputFocused ? (
          <input
            autoFocus
            type="number"
            min={field.min}
            max={field.max}
            step={field.step}
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            onBlur={() => {
              const parsed = parseFloat(rawInput);
              if (!isNaN(parsed)) {
                onChange(field.key, parsed);
              }
              setInputFocused(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              if (e.key === "Escape") setInputFocused(false);
            }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--cr-text)",
              background: "var(--cr-bg-elevated)",
              border: "1px solid var(--cr-orange)",
              borderRadius: 6,
              padding: "2px 8px",
              width: 72,
              outline: "none",
              textAlign: "right" as const,
            }}
          />
        ) : (
          <button
            onClick={() => { setRawInput(String(value)); setInputFocused(true); }}
            title="Click to edit"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--cr-text)",
              background: "none",
              border: "none",
              cursor: "text",
              padding: "2px 4px",
              borderRadius: 4,
              minWidth: 48,
              textAlign: "right" as const,
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "none";
            }}
          >
            {field.format(value)}
          </button>
        )}

        {/* Estimated / Custom badge */}
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase" as const,
          color: isCustom ? "var(--cr-text-muted)" : "var(--cr-orange)",
          background: isCustom ? "rgba(255,255,255,0.05)" : "rgba(255,107,44,0.1)",
          border: `1px solid ${isCustom ? "rgba(255,255,255,0.1)" : "rgba(255,107,44,0.25)"}`,
          borderRadius: 20,
          padding: "2px 8px",
          flexShrink: 0,
          transition: "all 0.25s ease",
        }}>
          {isCustom ? "✎ Custom" : "Estimated"}
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        onChange={(e) => onChange(field.key, parseFloat(e.target.value))}
        style={{
          width: "100%",
          background: `linear-gradient(to right, var(--cr-orange) ${clampedPct}%, var(--cr-bg-elevated-solid) ${clampedPct}%)`,
        }}
      />

      {/* Bottom: tooltip + benchmark label */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
        <Tooltip text={field.tooltip} />
        {benchmarkVal !== null && (
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            color: "var(--cr-text-dim)",
          }}>
            {industryLabel} avg: {field.format(benchmarkVal)}
          </span>
        )}
      </div>
    </div>
  );
}
