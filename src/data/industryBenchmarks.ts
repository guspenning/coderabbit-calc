import type { CalcInputs } from "../hooks/useCalculator";

/** Supported industry profile keys. */
export type IndustryKey =
  | "fintech"
  | "saas"
  | "enterprise"
  | "ecommerce"
  | "healthcare"
  | "other";

/** Benchmark values for a specific industry vertical. */
export interface IndustryBenchmark {
  reviewTimePct: number;
  bugsPerDevPerWeek: number;
  criticalBugPct: number;
  prodBugCost: number;
  preQaBugCost: number;
  coderabbitCatchRate: number;
  reductionInReviewTime: number;
}

/** Display metadata for an industry profile card. */
export interface IndustryProfile {
  key: IndustryKey;
  label: string;
  icon: string;
  description: string;
}

/** Industry-specific benchmark presets. */
export const INDUSTRY_BENCHMARKS: Record<IndustryKey, IndustryBenchmark> = {
  fintech: {
    reviewTimePct: 0.25,
    bugsPerDevPerWeek: 0.4,
    criticalBugPct: 0.15,
    prodBugCost: 15000,
    preQaBugCost: 1500,
    coderabbitCatchRate: 0.5,
    reductionInReviewTime: 0.3,
  },
  saas: {
    reviewTimePct: 0.2,
    bugsPerDevPerWeek: 0.6,
    criticalBugPct: 0.1,
    prodBugCost: 8000,
    preQaBugCost: 800,
    coderabbitCatchRate: 0.5,
    reductionInReviewTime: 0.25,
  },
  enterprise: {
    reviewTimePct: 0.25,
    bugsPerDevPerWeek: 0.4,
    criticalBugPct: 0.08,
    prodBugCost: 12000,
    preQaBugCost: 1200,
    coderabbitCatchRate: 0.45,
    reductionInReviewTime: 0.3,
  },
  ecommerce: {
    reviewTimePct: 0.18,
    bugsPerDevPerWeek: 0.5,
    criticalBugPct: 0.12,
    prodBugCost: 10000,
    preQaBugCost: 1000,
    coderabbitCatchRate: 0.5,
    reductionInReviewTime: 0.25,
  },
  healthcare: {
    reviewTimePct: 0.28,
    bugsPerDevPerWeek: 0.3,
    criticalBugPct: 0.12,
    prodBugCost: 20000,
    preQaBugCost: 2000,
    coderabbitCatchRate: 0.45,
    reductionInReviewTime: 0.25,
  },
  other: {
    reviewTimePct: 0.2,
    bugsPerDevPerWeek: 0.5,
    criticalBugPct: 0.1,
    prodBugCost: 10000,
    preQaBugCost: 1000,
    coderabbitCatchRate: 0.5,
    reductionInReviewTime: 0.25,
  },
};

/** Ordered list of industry profiles for the card selector UI. */
export const INDUSTRY_PROFILES: IndustryProfile[] = [
  {
    key: "fintech",
    label: "Fintech / Banking",
    icon: "🏦",
    description: "Regulated, high cost of bugs in production",
  },
  {
    key: "saas",
    label: "SaaS / Cloud",
    icon: "☁️",
    description: "Fast release cycles, high PR volume",
  },
  {
    key: "enterprise",
    label: "Enterprise Software",
    icon: "🏢",
    description: "Large codebase, complex review processes",
  },
  {
    key: "ecommerce",
    label: "E-Commerce / Retail",
    icon: "🛒",
    description: "Revenue-impacting bugs, seasonal pressure",
  },
  {
    key: "healthcare",
    label: "Healthcare / Biotech",
    icon: "🏥",
    description: "Compliance-heavy, high cost of defects",
  },
  {
    key: "other",
    label: "Other",
    icon: "⚙️",
    description: "General software development",
  },
];

/**
 * Maps an IndustryBenchmark to the corresponding CalcInputs fields.
 * @param benchmark - Industry benchmark to apply
 * @returns Partial CalcInputs with benchmark-derived values
 */
export function applyBenchmarkToInputs(
  benchmark: IndustryBenchmark
): Partial<CalcInputs> {
  return {
    reviewTimeFraction: benchmark.reviewTimePct,
    bugsPerDevPerWeek: benchmark.bugsPerDevPerWeek,
    criticalBugFraction: benchmark.criticalBugPct,
    bugCostProduction: benchmark.prodBugCost,
    bugCostPreQA: benchmark.preQaBugCost,
    bugCatchFraction: benchmark.coderabbitCatchRate,
    reviewReduction: benchmark.reductionInReviewTime,
  };
}
