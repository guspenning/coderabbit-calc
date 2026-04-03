import "./index.css";
import { useCalculator } from "./hooks/useCalculator";
import { InputPanel } from "./components/InputPanel";
import { ResultsDashboard } from "./components/ResultsDashboard";

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
          marginBottom: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Logo wordmark */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              {/* Rabbit icon SVG */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="8" fill="#7C3AED" fillOpacity="0.15" />
                <path d="M10 8 C10 5, 8 4, 8 6 L8 11 C6 12, 5 14, 5 16 C5 21, 9 25, 16 25 C23 25, 27 21, 27 16 C27 14, 26 12, 24 11 L24 6 C24 4, 22 5, 22 8 L22 10 C20.5 9, 18.5 8.5, 16 8.5 C13.5 8.5, 11.5 9, 10 10 Z" fill="#7C3AED" fillOpacity="0.8"/>
                <circle cx="12" cy="17" r="1.5" fill="#E8E4F0"/>
                <circle cx="20" cy="17" r="1.5" fill="#E8E4F0"/>
                <path d="M13 21 C14 22.5, 18 22.5, 19 21" stroke="#E8E4F0" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              </svg>
              <span style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "22px",
                fontWeight: 800,
                color: "var(--cr-purple-light)",
                letterSpacing: "-0.02em",
              }}>
                CodeRabbit
              </span>
            </div>
            <div style={{
              width: "1px",
              height: "24px",
              background: "var(--cr-border)",
            }} />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              fontWeight: 400,
              color: "var(--cr-text-muted)",
              letterSpacing: "0.01em",
            }}>
              ROI Calculator
            </span>
          </div>

          <div style={{
            fontSize: "12px",
            color: "var(--cr-text-dim)",
            fontFamily: "'Inter', sans-serif",
          }}>
            Real-time estimates · No form submission required
          </div>
        </header>

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
