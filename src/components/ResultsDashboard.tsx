import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { CalcInputs, CalcResults } from "../hooks/useCalculator";
import { formatCurrency, formatMultiple, formatNumber, formatHours } from "../utils/formatters";
import { SavingsChart } from "./SavingsChart";
import { ShareButton } from "./ShareButton";
import { TrendingUp, Clock, Bug, DollarSign, BarChart2, ExternalLink } from "lucide-react";

interface BenchmarkRowProps {
  label: string;
  value: string;
  accent?: string;
}

/**
 * A single metric row inside the benchmark panel.
 */
function BenchmarkRow({ label, value, accent = "var(--cr-orange)" }: BenchmarkRowProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0" }}>
      <span style={{ fontSize: "12px", color: "var(--cr-text-muted)" }}>{label}</span>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "13px",
        fontWeight: 700,
        color: accent,
      }}>{value}</span>
    </div>
  );
}

/**
 * Returns a contextual "how does your team compare?" message and colour
 * based on the number of developer seats.
 */
function getTeamComparisonNote(devSeats: number): { note: string; color: string } {
  if (devSeats <= 15) {
    return {
      note: "Small teams like yours often spend 25-30% of dev time on reviews — above the industry median of 20%. CodeRabbit typically delivers its highest proportional ROI lift here by eliminating repetitive nit feedback.",
      color: "var(--cr-orange)",
    };
  }
  if (devSeats <= 100) {
    return {
      note: "Teams your size (16-100 devs) sit in the sweet spot for CodeRabbit ROI. Industry data shows a 25-35% review-time reduction at this scale, closely matching the benchmark's 53.5% recall rate on real-world PRs.",
      color: "#60a5fa",
    };
  }
  if (devSeats <= 300) {
    return {
      note: "At 100-300 devs, review bottlenecks compound fast. Enterprise teams at this scale report 40%+ reductions in critical bug escapes and measurable improvements in PR cycle time — consistent with CodeRabbit's #1 F1 ranking.",
      color: "var(--cr-green)",
    };
  }
  return {
    note: "Large organisations (300+ devs) benefit most from consistent, policy-aware reviews across many teams. CodeRabbit's precision of ~49% means roughly 1-in-2 comments drives an actual code change — signal, not noise.",
    color: "var(--cr-green)",
  };
}

interface IndustryBenchmarksProps {
  devSeats: number;
}

/**
 * Panel showing headline stats from the Martian Code Review Bench
 * (Jan–Feb 2026, ~300k PRs, 10 tools) plus a contextual note about
 * how the user's team size stacks up against industry patterns.
 */
function IndustryBenchmarks({ devSeats }: IndustryBenchmarksProps) {
  const { note, color } = getTeamComparisonNote(devSeats);

  return (
    <div style={{
      background: "rgba(17, 17, 28, 0.6)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.05)",
      borderRadius: "12px",
      padding: "18px 20px",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
    }}>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <BarChart2 size={14} style={{ color: "var(--cr-orange)" }} />
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--cr-text-muted)",
          }}>
            Industry Benchmarks
          </span>
        </div>
        <a
          href="https://www.coderabbit.ai/blog/coderabbit-tops-martian-code-review-benchmark"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "10px",
            color: "var(--cr-text-dim)",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--cr-orange)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--cr-text-dim)"; }}
        >
          Martian Bench <ExternalLink size={10} />
        </a>
      </div>

      {/* Benchmark metrics */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        marginBottom: "14px",
        paddingBottom: "10px",
      }}>
        <BenchmarkRow label="Overall ranking (10 tools evaluated)" value="#1" accent="var(--cr-orange)" />
        <BenchmarkRow label="F1 Score" value="51.2%" accent="var(--cr-orange)" />
        <BenchmarkRow label="Recall (comment acceptance)" value="53.5%" accent="var(--cr-green)" />
        <BenchmarkRow label="Precision (changes per comment)" value="~1 in 2" accent="var(--cr-green)" />
        <BenchmarkRow label="PRs analysed (Jan–Feb 2026)" value="~300k" accent="var(--cr-text-muted)" />
      </div>

      {/* Dynamic team comparison note */}
      <div style={{
        background: `linear-gradient(135deg, ${color}0a 0%, transparent 100%)`,
        border: `1px solid ${color}22`,
        borderRadius: "8px",
        padding: "10px 12px",
      }}>
        <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color, marginBottom: "6px" }}>
          How does your team compare?
        </div>
        <p style={{ fontSize: "11px", color: "var(--cr-text-muted)", margin: 0, lineHeight: 1.6 }}>
          {note}
        </p>
      </div>
    </div>
  );
}

interface ResultsDashboardProps {
  inputs: CalcInputs;
  results: CalcResults;
}

/**
 * Animates a numeric value from its previous value to its new value
 * whenever the target changes.
 * @param target - The destination value to animate to
 * @param duration - Animation duration in ms
 * @returns The current animated value
 */
function useCountUp(target: number, duration = 600): number {
  const [current, setCurrent] = useState(target);
  const prevRef = useRef(target);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const start = prevRef.current;
    const end = target;
    const startTime = performance.now();

    cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(start + (end - start) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = end;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return current;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
}

/**
 * A secondary stat card in the key metrics row.
 */
function StatCard({ icon, label, value, accent = "var(--cr-orange)" }: StatCardProps) {
  return (
    <div className="stat-card" style={{
      flex: 1,
      minWidth: "120px",
      background: "rgba(17, 17, 28, 0.6)",
      backdropFilter: "blur(10px)",
      borderRadius: "10px",
      padding: "14px 16px",
    }}>
      <div style={{ color: accent, marginBottom: "8px" }}>{icon}</div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "16px",
        fontWeight: 600,
        color: "var(--cr-text)",
        marginBottom: "4px",
      }}>
        {value}
      </div>
      <div style={{ fontSize: "11px", color: "var(--cr-text-muted)", lineHeight: 1.4 }}>
        {label}
      </div>
    </div>
  );
}

/**
 * The right-panel results dashboard for the ROI calculator.
 * Shows hero metrics (Total Savings, ROI Multiple), savings breakdown chart,
 * key stats row, and the share button. All numbers animate smoothly on change.
 */
export function ResultsDashboard({ inputs, results }: ResultsDashboardProps) {
  const animatedSavings = useCountUp(results.totalSavings);
  const animatedRoi = useCountUp(results.roiMultiple, 700);
  const animatedCost = useCountUp(results.crLicenseCostYear);
  const animatedDevTime = useCountUp(results.devTimeSavedValue);
  const animatedBugs = useCountUp(results.bugsSavedValue);
  const animatedHoursSaved = useCountUp(results.timeSavedPerDevPerWeek);
  const animatedTotalHours = useCountUp(results.totalDevHoursSavedPerYear);
  const animatedBugsCaught = useCountUp(results.bugsCaughtPerYear);
  const animatedCostPerBug = useCountUp(results.costPerBugAvoided);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* Header */}
      <div style={{ marginBottom: "4px" }}>
        <h2 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "18px",
          fontWeight: 700,
          color: "var(--cr-text)",
          margin: 0,
        }}>
          Your ROI Estimate
        </h2>
      </div>

      {/* Hero card — Total Savings */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glow-pulse hero-border-glow"
        style={{
          background: "linear-gradient(135deg, rgba(255, 107, 44, 0.08) 0%, rgba(9, 9, 15, 0.95) 60%, rgba(34, 197, 94, 0.05) 100%)",
          borderRadius: "16px",
          padding: "28px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background accent */}
        <div style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34, 197, 94, 0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ fontSize: "12px", color: "var(--cr-text-muted)", marginBottom: "8px", letterSpacing: "0.06em" }}>
          TOTAL ANNUAL SAVINGS
        </div>
        <div className="savings-glow" style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(40px, 5vw, 58px)",
          fontWeight: 800,
          color: "var(--cr-green)",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          marginBottom: "20px",
        }}>
          {formatCurrency(animatedSavings)}
        </div>

        {/* ROI badge */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--cr-text-muted)", marginBottom: "4px", letterSpacing: "0.06em" }}>
              ROI MULTIPLE
            </div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 107, 44, 0.15)",
              border: "1px solid var(--cr-border-bright)",
              borderRadius: "8px",
              padding: "6px 14px",
            }}>
              <TrendingUp size={14} style={{ color: "var(--cr-orange)" }} />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--cr-orange)",
              }}>
                {formatMultiple(animatedRoi)}
              </span>
              <span style={{ fontSize: "13px", color: "var(--cr-text-muted)" }}>return</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "11px", color: "var(--cr-text-muted)", marginBottom: "4px", letterSpacing: "0.06em" }}>
              CR ANNUAL COST
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--cr-text-muted)",
            }}>
              {formatCurrency(animatedCost)}/yr
            </div>
          </div>
        </div>
      </motion.div>

      {/* Savings breakdown chart */}
      <div style={{
        background: "rgba(17, 17, 28, 0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03)",
      }}>
        <SavingsChart
          devTimeSaved={animatedDevTime}
          bugsSaved={animatedBugs}
        />
      </div>

      {/* Key stats row */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <StatCard
          icon={<Clock size={16} />}
          label="Hours saved per dev per week"
          value={formatHours(animatedHoursSaved)}
          accent="var(--cr-orange)"
        />
        <StatCard
          icon={<Clock size={16} />}
          label="Total dev hours saved per year"
          value={formatNumber(animatedTotalHours)}
          accent="var(--cr-orange)"
        />
        <StatCard
          icon={<Bug size={16} />}
          label="Critical bugs caught per year"
          value={formatNumber(animatedBugsCaught)}
          accent="var(--cr-green)"
        />
        <StatCard
          icon={<DollarSign size={16} />}
          label="Cost per bug avoided"
          value={formatCurrency(animatedCostPerBug)}
          accent="var(--cr-green)"
        />
      </div>

      {/* Industry benchmarks + team comparison */}
      <IndustryBenchmarks devSeats={inputs.devSeats} />

      {/* Share button */}
      <ShareButton inputs={inputs} results={results} />

      {/* Disclaimer */}
      <p style={{
        fontSize: "11px",
        color: "var(--cr-text-dim)",
        textAlign: "center",
        lineHeight: "1.6",
        margin: 0,
      }}>
        Estimates are illustrative and based on your inputs.
        Actual results may vary based on team workflow, codebase complexity, and CodeRabbit configuration.
      </p>
    </div>
  );
}
