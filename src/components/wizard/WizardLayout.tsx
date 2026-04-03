import { ChevronLeft, ChevronRight } from "lucide-react";

interface WizardLayoutProps {
  step: number;
  totalSteps: number;
  stepLabels: string[];
  canGoNext: boolean;
  /** Whether to show the Back button (steps 2+). */
  showBack: boolean;
  /** Whether to show the Next/CTA button. */
  showNext: boolean;
  nextLabel: string;
  onNext: () => void;
  onBack: () => void;
  /** Called when a completed step pill is clicked; allows jumping back. */
  onStepClick: (step: number) => void;
  children: React.ReactNode;
}

/**
 * Outer shell for all wizard steps. Renders the progress bar, step pills,
 * and Back / Next navigation. Step content is injected as children.
 */
export function WizardLayout({
  step,
  totalSteps,
  stepLabels,
  canGoNext,
  showBack,
  showNext,
  nextLabel,
  onNext,
  onBack,
  onStepClick,
  children,
}: WizardLayoutProps) {
  const progressPct = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 20px" }}>
      {/* ── Progress bar ─────────────────────────────── */}
      <div style={{ marginBottom: 36 }}>
        {/* Step labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          {stepLabels.map((label, i) => {
            const n = i + 1;
            const completed = n < step;
            const current = n === step;
            const clickable = completed;
            return (
              <button
                key={n}
                onClick={() => clickable && onStepClick(n)}
                disabled={!clickable}
                style={{
                  background: "none",
                  border: "none",
                  padding: "2px 4px",
                  cursor: clickable ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  fontWeight: current ? 600 : 400,
                  color: current
                    ? "var(--cr-orange)"
                    : completed
                      ? "var(--cr-text-muted)"
                      : "var(--cr-text-dim)",
                  transition: "color 0.2s ease",
                  whiteSpace: "nowrap" as const,
                }}
              >
                {/* Number pill */}
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: current
                    ? "var(--cr-orange)"
                    : completed
                      ? "rgba(255,107,44,0.18)"
                      : "var(--cr-bg-elevated-solid)",
                  border: `1px solid ${current
                    ? "var(--cr-orange)"
                    : completed
                      ? "rgba(255,107,44,0.35)"
                      : "var(--cr-border)"}`,
                  fontSize: 10,
                  fontWeight: 700,
                  color: current ? "#fff" : completed ? "var(--cr-orange)" : "var(--cr-text-dim)",
                  flexShrink: 0,
                  transition: "all 0.25s ease",
                }}>
                  {completed ? "✓" : n}
                </span>
                <span className="wizard-step-label">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Orange fill track */}
        <div style={{
          height: 3,
          background: "var(--cr-bg-elevated-solid)",
          borderRadius: 2,
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${progressPct}%`,
            background: "var(--cr-orange)",
            borderRadius: 2,
            transition: "width 0.45s ease",
            boxShadow: "0 0 10px rgba(255,107,44,0.55)",
          }} />
        </div>

        {/* Step counter */}
        <div style={{
          marginTop: 8,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: "var(--cr-text-dim)",
          letterSpacing: "0.05em",
        }}>
          Step {step} of {totalSteps}
        </div>
      </div>

      {/* ── Step content ─────────────────────────────── */}
      <div style={{ overflow: "hidden", minHeight: 360 }}>
        {children}
      </div>

      {/* ── Navigation ───────────────────────────────── */}
      {(showBack || showNext) && (
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 36,
          paddingTop: 24,
          borderTop: "1px solid var(--cr-border)",
        }}>
          {showBack ? (
            <button
              onClick={onBack}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "none",
                border: "1px solid var(--cr-border)",
                borderRadius: 8,
                padding: "10px 18px",
                color: "var(--cr-text-muted)",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.15)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--cr-text)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--cr-border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--cr-text-muted)";
              }}
            >
              <ChevronLeft size={15} />
              Back
            </button>
          ) : <div />}

          {showNext && (
            <button
              onClick={onNext}
              disabled={!canGoNext}
              className="wizard-next-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: canGoNext ? "var(--cr-orange)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${canGoNext ? "transparent" : "var(--cr-border)"}`,
                borderRadius: 8,
                padding: "10px 24px",
                color: canGoNext ? "#fff" : "var(--cr-text-dim)",
                fontFamily: "'Inter', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                cursor: canGoNext ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                boxShadow: canGoNext ? "0 4px 18px rgba(255,107,44,0.35)" : "none",
              }}
            >
              {nextLabel}
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 520px) {
          .wizard-step-label { display: none; }
        }
      `}</style>
    </div>
  );
}
