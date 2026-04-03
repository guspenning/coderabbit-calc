import "./index.css";
import { useCalculator } from "./hooks/useCalculator";
import { InputPanel } from "./components/InputPanel";
import { ResultsDashboard } from "./components/ResultsDashboard";
import { CodeRabbitLogo } from "./components/CodeRabbitLogo";

/**
 * Root application component for CodeRabbit Calc.
 * Renders a two-column desktop layout (stacked on mobile) with
 * the input panel on the left and results dashboard on the right.
 */
function App() {
  const { inputs, results, updateInput, resetToDefaults } = useCalculator();

  return (
    <div
      className="grid-bg noise-overlay"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      {/* Page wrapper */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 20px" }}>

        {/* Header */}
        <header style={{
          padding: "28px 0 24px",
          borderBottom: "1px solid var(--cr-border)",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Logo wordmark */}
            <CodeRabbitLogo size={36} variant="dark" showWordmark={true} />
            <div style={{
              width: "1px",
              height: "24px",
              background: "var(--cr-border-bright)",
            }} />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              fontWeight: 500,
              color: "var(--cr-text-muted)",
              letterSpacing: "0.01em",
            }}>
              ROI Calculator
            </span>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase" as const,
              color: "var(--cr-orange)",
              background: "rgba(255, 107, 44, 0.1)",
              border: "1px solid rgba(255, 107, 44, 0.2)",
              borderRadius: "6px",
              padding: "4px 10px",
              fontFamily: "'Inter', sans-serif",
            }}>
              For Sales Teams
            </span>
          </div>
        </header>

        {/* Hero tagline */}
        <div style={{
          marginBottom: "32px",
          paddingTop: "4px",
        }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            fontWeight: 400,
            color: "var(--cr-text-dim)",
            margin: 0,
            lineHeight: 1.5,
          }}>
            Show your team the measurable impact of AI code review
          </p>
        </div>

        {/* Two-column layout */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "32px",
          alignItems: "start",
          paddingBottom: "60px",
        }}
          className="calc-grid"
        >
          {/* Left: Inputs */}
          <InputPanel
            inputs={inputs}
            onUpdate={updateInput}
            onReset={resetToDefaults}
          />

          {/* Right: Results — sticky on desktop */}
          <div style={{ position: "sticky", top: "24px" }}>
            <ResultsDashboard inputs={inputs} results={results} />
          </div>
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
