import { motion } from "framer-motion";
import { formatCurrency } from "../utils/formatters";

interface SavingsChartProps {
  /** Dollar value of developer time saved per year */
  devTimeSaved: number;
  /** Dollar value of early bug detection savings per year */
  bugsSaved: number;
}

/**
 * A visual horizontal stacked bar chart showing the two savings components:
 * Developer Time Saved and Early Bug Detection.
 * Segments are animated when values change.
 */
export function SavingsChart({ devTimeSaved, bugsSaved }: SavingsChartProps) {
  const total = devTimeSaved + bugsSaved;
  const devPct = total > 0 ? (devTimeSaved / total) * 100 : 50;
  const bugPct = total > 0 ? (bugsSaved / total) * 100 : 50;

  return (
    <div>
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--cr-purple-light)",
        marginBottom: "14px",
      }}>
        Savings Breakdown
      </div>

      {/* Stacked bar */}
      <div style={{
        height: "28px",
        borderRadius: "6px",
        overflow: "hidden",
        display: "flex",
        background: "var(--cr-bg-elevated)",
        marginBottom: "12px",
      }}>
        <motion.div
          animate={{ width: `${devPct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, var(--cr-purple), var(--cr-purple-light))",
            borderRadius: devPct > 99 ? "6px" : "6px 0 0 6px",
          }}
        />
        <motion.div
          animate={{ width: `${bugPct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, var(--cr-green), var(--cr-green-light))",
            borderRadius: bugPct > 99 ? "6px" : "0 6px 6px 0",
          }}
        />
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <LegendItem
          color="var(--cr-purple)"
          label="Dev Time Saved"
          value={formatCurrency(devTimeSaved)}
          pct={devPct}
        />
        <LegendItem
          color="var(--cr-green)"
          label="Early Bug Detection"
          value={formatCurrency(bugsSaved)}
          pct={bugPct}
        />
      </div>
    </div>
  );
}

interface LegendItemProps {
  color: string;
  label: string;
  value: string;
  pct: number;
}

/**
 * A single legend item for the savings breakdown chart.
 */
function LegendItem({ color, label, value, pct }: LegendItemProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, minWidth: "160px" }}>
      <div style={{
        width: "10px",
        height: "10px",
        borderRadius: "3px",
        background: color,
        flexShrink: 0,
      }} />
      <div>
        <div style={{ fontSize: "12px", color: "var(--cr-text-muted)", marginBottom: "2px" }}>
          {label}
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--cr-text)",
        }}>
          {value}
          <span style={{ fontSize: "11px", color: "var(--cr-text-muted)", marginLeft: "5px", fontWeight: 400 }}>
            {pct.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
