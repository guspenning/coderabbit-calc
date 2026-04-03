import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightLeft } from "lucide-react";
import type { CalcInputs, CalcResults } from "../../hooks/useCalculator";
import {
  type IndustryKey,
  INDUSTRY_BENCHMARKS,
  applyBenchmarkToInputs,
} from "../../data/industryBenchmarks";
import { WizardLayout } from "./WizardLayout";
import { StepTeamBasics } from "./StepTeamBasics";
import { StepCompanyProfile } from "./StepCompanyProfile";
import { StepFineTune } from "./StepFineTune";
import { ResultsDashboard } from "../ResultsDashboard";

const TOTAL_STEPS = 4;
const STEP_LABELS = ["Team Basics", "Company Profile", "Fine-Tune", "Results"];

interface GuidedWizardProps {
  inputs: CalcInputs;
  results: CalcResults;
  updateInput: (key: keyof CalcInputs, value: number) => void;
  /** Called when the user requests to switch to Full Calculator mode. */
  onSwitchToFull: () => void;
}

/** Framer Motion variants for step slide transitions. */
const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "55%" : "-55%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.32, ease: "easeOut" as const },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-55%" : "55%",
    opacity: 0,
    transition: { duration: 0.22, ease: "easeIn" as const },
  }),
};

/**
 * Self-contained guided wizard that walks users through 4 steps:
 * team basics → company profile → fine-tune benchmarks → results.
 * Manages step state, URL hash, and applies industry benchmarks to the
 * shared calculator inputs via updateInput.
 */
export function GuidedWizard({
  inputs,
  results,
  updateInput,
  onSwitchToFull,
}: GuidedWizardProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [industry, setIndustry] = useState<IndustryKey | null>(null);
  const [customFields, setCustomFields] = useState<Set<keyof CalcInputs>>(new Set());

  // Local string state for step 1 — fields start empty regardless of hook defaults
  const [devSeatsStr, setDevSeatsStr] = useState("");
  const [avgSalaryStr, setAvgSalaryStr] = useState("");

  /** Writes the current step to the URL hash. */
  useEffect(() => {
    window.location.hash = `guided/step/${step}`;
  }, [step]);

  /** Sync step with browser back/forward navigation. */
  useEffect(() => {
    const onPop = () => {
      const m = window.location.hash.match(/^#guided\/step\/(\d+)$/);
      if (m) {
        const n = parseInt(m[1]);
        if (n !== step) {
          setDirection(n < step ? -1 : 1);
          setStep(n);
        }
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [step]);

  const goTo = useCallback(
    (n: number) => {
      setDirection(n > step ? 1 : -1);
      setStep(n);
    },
    [step]
  );

  /** Applies the selected industry benchmark to the calculator inputs. */
  const handleIndustrySelect = (key: IndustryKey) => {
    setIndustry(key);
    const partial = applyBenchmarkToInputs(INDUSTRY_BENCHMARKS[key]);
    Object.entries(partial).forEach(([k, v]) =>
      updateInput(k as keyof CalcInputs, v as number)
    );
    setCustomFields(new Set());
  };

  const handleFineTuneChange = (key: keyof CalcInputs, value: number) => {
    updateInput(key, value);
    setCustomFields((prev) => new Set([...prev, key]));
  };

  const handleResetToEstimates = () => {
    if (!industry) return;
    const partial = applyBenchmarkToInputs(INDUSTRY_BENCHMARKS[industry]);
    Object.entries(partial).forEach(([k, v]) =>
      updateInput(k as keyof CalcInputs, v as number)
    );
    setCustomFields(new Set());
  };

  /** Flush step-1 string values into the calculator before advancing. */
  const flushStep1 = () => {
    const seats = parseInt(devSeatsStr);
    const salary = parseInt(avgSalaryStr.replace(/,/g, ""));
    if (seats > 0) updateInput("devSeats", seats);
    if (salary > 0) updateInput("avgSalary", salary);
  };

  const canGoNext = (): boolean => {
    if (step === 1) return parseInt(devSeatsStr) > 0;
    if (step === 2) return industry !== null;
    return true;
  };

  const handleNext = () => {
    if (!canGoNext()) return;
    if (step === 1) flushStep1();
    if (step < TOTAL_STEPS) goTo(step + 1);
  };

  const handleBack = () => {
    if (step > 1) goTo(step - 1);
  };

  const nextLabel =
    step === 3 ? "See Results" : step === 4 ? "" : "Next";

  return (
    <div>
      <WizardLayout
        step={step}
        totalSteps={TOTAL_STEPS}
        stepLabels={STEP_LABELS}
        canGoNext={canGoNext()}
        showBack={step > 1 && step < TOTAL_STEPS}
        showNext={step < TOTAL_STEPS}
        nextLabel={nextLabel}
        onNext={handleNext}
        onBack={handleBack}
        onStepClick={(n) => n < step && goTo(n)}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ width: "100%" }}
          >
            {step === 1 && (
              <StepTeamBasics
                devSeats={devSeatsStr}
                avgSalary={avgSalaryStr}
                onDevSeatsChange={setDevSeatsStr}
                onAvgSalaryChange={setAvgSalaryStr}
                onEnter={handleNext}
              />
            )}

            {step === 2 && (
              <StepCompanyProfile
                selectedIndustry={industry}
                onSelect={handleIndustrySelect}
                onEnter={handleNext}
              />
            )}

            {step === 3 && (
              <StepFineTune
                inputs={inputs}
                industry={industry}
                customFields={customFields}
                onChange={handleFineTuneChange}
                onReset={handleResetToEstimates}
              />
            )}

            {step === 4 && (
              <div>
                <ResultsDashboard inputs={inputs} results={results} />

                {/* Step 4 CTAs */}
                <div style={{
                  display: "flex",
                  gap: 12,
                  marginTop: 28,
                  flexWrap: "wrap" as const,
                }}>
                  <button
                    onClick={() => goTo(3)}
                    style={{
                      flex: 1,
                      background: "none",
                      border: "1px solid var(--cr-border)",
                      borderRadius: 8,
                      padding: "11px 20px",
                      color: "var(--cr-text-muted)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap" as const,
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
                    Adjust inputs
                  </button>
                  <button
                    onClick={onSwitchToFull}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      background: "rgba(255,107,44,0.08)",
                      border: "1px solid rgba(255,107,44,0.25)",
                      borderRadius: 8,
                      padding: "11px 20px",
                      color: "var(--cr-orange)",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap" as const,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,107,44,0.14)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,107,44,0.08)";
                    }}
                  >
                    <ArrowRightLeft size={14} />
                    Switch to Full Calculator
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </WizardLayout>
    </div>
  );
}
