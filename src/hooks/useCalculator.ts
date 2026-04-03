import { useState, useMemo } from "react";

/** All user-configurable inputs for the ROI calculator. */
export interface CalcInputs {
  /** Average FTE annual salary in dollars */
  avgSalary: number;
  /** Number of developer seats */
  devSeats: number;
  /** CodeRabbit Pro price per developer per month */
  crPricePerDevMonth: number;
  /** Hours worked per week per developer */
  hoursPerWeek: number;
  /** Fraction of dev time spent on code reviews (0–1) */
  reviewTimeFraction: number;
  /** Fraction reduction in review time from CodeRabbit (0–1) */
  reviewReduction: number;
  /** Average bugs introduced per developer per week */
  bugsPerDevPerWeek: number;
  /** Fraction of critical bugs that reach production (0–1) */
  criticalBugFraction: number;
  /** Cost to fix a bug once it reaches production */
  bugCostProduction: number;
  /** Cost to fix a bug before QA / in review */
  bugCostPreQA: number;
  /** Fraction of bugs caught by CodeRabbit (0–1) */
  bugCatchFraction: number;
}

/** All derived results computed from CalcInputs. */
export interface CalcResults {
  hourlyRate: number;
  crCostPerDevYear: number;
  timeSavedPerDevPerWeek: number;
  devTimeSavedValue: number;
  totalBugsPerWeek: number;
  totalBugsPerYear: number;
  bugsSavedValue: number;
  totalSavings: number;
  crLicenseCostYear: number;
  roiMultiple: number;
  bugsCaughtPerYear: number;
  totalDevHoursSavedPerYear: number;
  costPerBugAvoided: number;
}

/** Default input values matching the spec */
export const DEFAULT_INPUTS: CalcInputs = {
  avgSalary: 100000,
  devSeats: 50,
  crPricePerDevMonth: 24,
  hoursPerWeek: 40,
  reviewTimeFraction: 0.2,
  reviewReduction: 0.25,
  bugsPerDevPerWeek: 0.5,
  criticalBugFraction: 0.1,
  bugCostProduction: 10000,
  bugCostPreQA: 1000,
  bugCatchFraction: 0.5,
};

/**
 * Validates and clamps a numeric input value within allowed bounds.
 * @param value - Raw input value
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value within bounds
 */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Core calculation engine. Computes all ROI metrics from input values.
 * Follows the exact formula specification from the product brief.
 * @param inputs - All user-configured input values
 * @returns All derived result metrics
 */
function calculate(inputs: CalcInputs): CalcResults {
  const {
    avgSalary, devSeats, crPricePerDevMonth, hoursPerWeek,
    reviewTimeFraction, reviewReduction,
    bugsPerDevPerWeek, criticalBugFraction,
    bugCostProduction, bugCostPreQA, bugCatchFraction,
  } = inputs;

  // Hourly rate
  const hourlyRate = avgSalary / (hoursPerWeek * 52);

  // CodeRabbit cost per dev per year
  const crCostPerDevYear = crPricePerDevMonth * 12;

  // Time saved per dev per week (hours)
  const timeSavedPerDevPerWeek = hoursPerWeek * reviewTimeFraction * reviewReduction;

  // Value of dev time saved per year
  const devTimeSavedValue = devSeats * timeSavedPerDevPerWeek * hourlyRate * 52;

  // Total hours saved per year across team
  const totalDevHoursSavedPerYear = devSeats * timeSavedPerDevPerWeek * 52;

  // Bug calculations — note: 48 weeks (not 52) for PTO/holidays
  const totalBugsPerWeek = bugsPerDevPerWeek * devSeats;
  const totalBugsPerYear = totalBugsPerWeek * 48;

  // Bugs caught by CodeRabbit per year
  const bugsCaughtPerYear = totalBugsPerYear * criticalBugFraction * bugCatchFraction;

  // Value of catching bugs early
  const bugsSavedValue =
    totalBugsPerYear * criticalBugFraction * bugCatchFraction *
    (bugCostProduction - bugCostPreQA);

  // Totals
  const totalSavings = devTimeSavedValue + bugsSavedValue;
  const crLicenseCostYear = crCostPerDevYear * devSeats;
  const roiMultiple = crLicenseCostYear > 0 ? totalSavings / crLicenseCostYear : 0;

  // Cost per bug avoided
  const costPerBugAvoided = bugsCaughtPerYear > 0 ? bugsSavedValue / bugsCaughtPerYear : 0;

  return {
    hourlyRate,
    crCostPerDevYear,
    timeSavedPerDevPerWeek,
    devTimeSavedValue,
    totalBugsPerWeek,
    totalBugsPerYear,
    bugsSavedValue,
    totalSavings,
    crLicenseCostYear,
    roiMultiple,
    bugsCaughtPerYear,
    totalDevHoursSavedPerYear,
    costPerBugAvoided,
  };
}

/**
 * Custom hook encapsulating all calculator state, input updates, and derived results.
 * Provides a single source of truth for the entire ROI calculator.
 * @returns inputs, results, update functions, and reset
 */
export function useCalculator() {
  const [inputs, setInputs] = useState<CalcInputs>(DEFAULT_INPUTS);

  const results = useMemo(() => calculate(inputs), [inputs]);

  /**
   * Updates a single input field by key.
   * @param key - The input field name
   * @param value - The new raw value
   */
  const updateInput = (key: keyof CalcInputs, value: number) => {
    setInputs((prev) => {
      const next = { ...prev, [key]: value };
      // Validation clamps
      next.avgSalary = clamp(next.avgSalary, 30000, 1000000);
      next.devSeats = clamp(Math.round(next.devSeats), 1, 5000);
      next.crPricePerDevMonth = clamp(next.crPricePerDevMonth, 1, 500);
      next.hoursPerWeek = clamp(Math.round(next.hoursPerWeek), 20, 60);
      next.reviewTimeFraction = clamp(next.reviewTimeFraction, 0.05, 0.5);
      next.reviewReduction = clamp(next.reviewReduction, 0.1, 0.75);
      next.bugsPerDevPerWeek = clamp(next.bugsPerDevPerWeek, 0.1, 5.0);
      next.criticalBugFraction = clamp(next.criticalBugFraction, 0.01, 0.5);
      next.bugCostProduction = clamp(next.bugCostProduction, 0, 10000000);
      next.bugCostPreQA = clamp(next.bugCostPreQA, 0, 1000000);
      next.bugCatchFraction = clamp(next.bugCatchFraction, 0.1, 0.9);
      return next;
    });
  };

  /** Resets all inputs to their default values. */
  const resetToDefaults = () => setInputs(DEFAULT_INPUTS);

  return { inputs, results, updateInput, resetToDefaults };
}
