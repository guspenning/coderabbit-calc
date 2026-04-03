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
        fontFamily: "'Inter', sans-serif",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--cr-orange)",
        marginBottom: "14px",
        paddingLeft: "12px",
        borderLeft: "3px solid var(--cr-orange)",
      }}>
        Savings Breakdown
      </div>

      {/* Stacked bar */}
      <div style={{
        height: "36px",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        background: "rgba(30, 30, 50, 0.6)",
        marginBottom: "14px",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
      }}>
        <motion.div
          animate={{ width: `${devPct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #E85A1E, #FF8C5A)",
            borderRadius: devPct > 99 ? "8px" : "8px 0 0 8px",
            boxShadow: "2px 0 12px rgba(255, 107, 44, 0.3)",
          }}
        />
        <motion.div
          animate={{ width: `${bugPct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            height: "100%",
            background: "linear-gradient(90deg, #16A34A, #22C55E)",
            borderRadius: bugPct > 99 ? "8px" : "0 8px 8px 0",
            boxShadow: "-2px 0 12px rgba(34, 197, 94, 0.2)",
          }}
        />
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <LegendItem
          color="var(--cr-orange)"
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
