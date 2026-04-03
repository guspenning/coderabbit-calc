import "./index.css";
import { useCalculator } from "./hooks/useCalculator";
import { InputPanel } from "./components/InputPanel";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { motion } from "framer-motion";

/**
 * Root application component for CodeRabbit Calc.
 * Renders a premium dark SaaS layout with frosted glass header,
 * ambient gradient orbs, and a two-column desktop layout
 * (stacked on mobile) with the input panel on the left
 * and results dashboard on the right.
 */
function App() {
  const { inputs, results, updateInput, resetToDefaults } = useCalculator();

  return (
    <div
      className="grid-bg noise-overlay scanline-overlay"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      {/* Ambient gradient orbs */}
      <div className="ambient-orb-1" />
      <div className="ambient-orb-2" />

      {/* Sticky frosted glass header */}
      <header
        className="frosted-header"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          padding: "0 20px",
        }}
      >
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "16px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Logo with orange glow */}
            <div className="logo-container">
              <img src="/coderabbit-logo.png" alt="CodeRabbit" style={{ height: 24, width: "auto", display: "block" }} />
            </div>
            <div style={{
              width: "1px",
              height: "24px",
              background: "rgba(255, 255, 255, 0.1)",
            }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--cr-text-muted)",
              letterSpacing: "0.04em",
            }}>
              ROI Calculator
            </span>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span
              className="badge-sales"
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase" as const,
                color: "var(--cr-orange)",
                background: "rgba(255, 107, 44, 0.08)",
                border: "1px solid rgba(255, 107, 44, 0.2)",
                borderRadius: "20px",
                padding: "5px 14px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              For Sales Teams
            </span>
          </div>
        </div>
      </header>

      {/* Page wrapper */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 2 }}>

        {/* Hero tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            marginBottom: "36px",
            paddingTop: "28px",
          }}
        >
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "14px",
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
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "36px",
          alignItems: "start",
          paddingBottom: "80px",
        }}
          className="calc-grid"
        >
          {/* Left: Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <InputPanel
              inputs={inputs}
              onUpdate={updateInput}
              onReset={resetToDefaults}
            />
          </motion.div>

          {/* Right: Results — sticky on desktop with spotlight */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ position: "sticky", top: "80px" }}
          >
            <div style={{ position: "relative" }}>
              <div className="results-spotlight" />
              <ResultsDashboard inputs={inputs} results={results} />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Responsive styles via a style tag */}
      <style>{`
        @media (max-width: 768px) {
          .calc-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
