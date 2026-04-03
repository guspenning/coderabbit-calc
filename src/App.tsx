import "./index.css";
import { useEffect, useState } from "react";
import { useCalculator } from "./hooks/useCalculator";
import { InputPanel } from "./components/InputPanel";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { ModeSelector } from "./components/ModeSelector";
import { GuidedWizard } from "./components/wizard/GuidedWizard";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightLeft } from "lucide-react";

type AppMode = "selector" | "guided" | "full";

/**
 * Root application component for CodeRabbit Calc.
 *
 * Renders one of three views based on the current mode:
 *  - "selector"  — entry screen (Quick Estimate vs Full Calculator)
 *  - "guided"    — 4-step wizard with industry benchmarks
 *  - "full"      — two-column full calculator (original layout)
 *
 * All modes share the same `useCalculator` state so inputs carry over
 * seamlessly when switching between them.
 */
function App() {
  const { inputs, results, updateInput, resetToDefaults } = useCalculator();
  const [mode, setMode] = useState<AppMode>("selector");

  /** Sync mode with URL hash so the browser back button works naturally. */
  useEffect(() => {
    const readHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith("#guided")) {
        setMode("guided");
      } else if (hash === "#full") {
        setMode("full");
      } else if (hash === "" || hash === "#") {
        setMode("selector");
      }
    };
    window.addEventListener("popstate", readHash);
    readHash();
    return () => window.removeEventListener("popstate", readHash);
  }, []);

  const switchTo = (m: AppMode) => {
    setMode(m);
    if (m === "full") window.location.hash = "full";
    else if (m === "selector") window.location.hash = "";
    // guided hash is written by GuidedWizard itself
  };

  return (
    <div
      className="grid-bg noise-overlay scanline-overlay"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      {/* Ambient gradient orbs */}
      <div className="ambient-orb-1" />
      <div className="ambient-orb-2" />

      {/* ── Sticky frosted glass header ──────────────────────────── */}
      <header
        className="frosted-header"
        style={{ position: "sticky", top: 0, zIndex: 50, padding: "0 20px" }}
      >
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "16px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap" as const,
          gap: 12,
        }}>
          {/* Left: logo + label */}
          <button
            onClick={() => switchTo("selector")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div className="logo-container">
              <img
                src="/coderabbit-logo.png"
                alt="CodeRabbit"
                style={{ height: 24, width: "auto", display: "block" }}
              />
            </div>
            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13,
              fontWeight: 500,
              color: "var(--cr-text-muted)",
              letterSpacing: "0.04em",
            }}>
              ROI Calculator
            </span>
          </button>

          {/* Right: mode toggle + badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <AnimatePresence mode="wait">
              {mode === "guided" && (
                <motion.button
                  key="to-full"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => switchTo("full")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "1px solid var(--cr-border)",
                    borderRadius: 8,
                    padding: "6px 14px",
                    color: "var(--cr-text-muted)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,107,44,0.4)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--cr-orange)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--cr-border)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--cr-text-muted)";
                  }}
                >
                  <ArrowRightLeft size={13} />
                  Full Calculator
                </motion.button>
              )}

              {mode === "full" && (
                <motion.button
                  key="to-guided"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => switchTo("guided")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "none",
                    border: "1px solid var(--cr-border)",
                    borderRadius: 8,
                    padding: "6px 14px",
                    color: "var(--cr-text-muted)",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,107,44,0.4)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--cr-orange)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--cr-border)";
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--cr-text-muted)";
                  }}
                >
                  <ArrowRightLeft size={13} />
                  Guided Mode
                </motion.button>
              )}
            </AnimatePresence>

            <span
              className="badge-sales"
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "var(--cr-orange)",
                background: "rgba(255,107,44,0.08)",
                border: "1px solid rgba(255,107,44,0.2)",
                borderRadius: 20,
                padding: "5px 14px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              For Sales Teams
            </span>
          </div>
        </div>
      </header>

      {/* ── Page content ─────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <AnimatePresence mode="wait">

          {/* Mode selector */}
          {mode === "selector" && (
            <motion.div
              key="selector"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div style={{ paddingTop: 28 }}>
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    fontWeight: 400,
                    color: "var(--cr-text-dim)",
                    margin: 0,
                    lineHeight: 1.5,
                    letterSpacing: "0.01em",
                  }}
                >
                  Show your team the measurable impact of AI code review
                </motion.p>
              </div>
              <ModeSelector
                onSelectGuided={() => switchTo("guided")}
                onSelectFull={() => switchTo("full")}
              />
            </motion.div>
          )}

          {/* Guided wizard */}
          {mode === "guided" && (
            <motion.div
              key="guided"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              style={{ paddingTop: 36, paddingBottom: 80 }}
            >
              <GuidedWizard
                inputs={inputs}
                results={results}
                updateInput={updateInput}
                onSwitchToFull={() => switchTo("full")}
              />
            </motion.div>
          )}

          {/* Full calculator */}
          {mode === "full" && (
            <motion.div
              key="full"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero tagline */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                style={{ marginBottom: 36, paddingTop: 28 }}
              >
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 14,
                  fontWeight: 400,
                  color: "var(--cr-text-dim)",
                  margin: 0,
                  lineHeight: 1.5,
                  letterSpacing: "0.01em",
                }}>
                  Show your team the measurable impact of AI code review
                </p>
              </motion.div>

              {/* Two-column layout */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
                  gap: 36,
                  alignItems: "start",
                  paddingBottom: 80,
                }}
                className="calc-grid"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <InputPanel
                    inputs={inputs}
                    onUpdate={updateInput}
                    onReset={resetToDefaults}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{ position: "sticky", top: 80 }}
                >
                  <div style={{ position: "relative" }}>
                    <div className="results-spotlight" />
                    <ResultsDashboard inputs={inputs} results={results} />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .calc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

export default App;
