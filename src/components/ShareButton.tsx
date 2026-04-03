import { useState } from "react";
import { Share2, Check } from "lucide-react";
import type { CalcInputs, CalcResults } from "../hooks/useCalculator";
import { formatCurrency, formatMultiple } from "../utils/formatters";

interface ShareButtonProps {
  inputs: CalcInputs;
  results: CalcResults;
}

/**
 * Generates a plain-text ROI summary and copies it to the clipboard.
 * Shows a brief confirmation state after copying.
 */
export function ShareButton({ inputs, results }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  /**
   * Builds a human-readable ROI summary string for clipboard sharing.
   * @returns Formatted multi-line text summary
   */
  const generateSummary = () => {
    const lines = [
      "CodeRabbit ROI Summary",
      "---------------------",
      `Team: ${inputs.devSeats} developer${inputs.devSeats !== 1 ? "s" : ""}`,
      `Annual Savings: ${formatCurrency(results.totalSavings)}`,
      `  - Dev Time Saved: ${formatCurrency(results.devTimeSavedValue)}`,
      `  - Early Bug Detection: ${formatCurrency(results.bugsSavedValue)}`,
      `CodeRabbit Cost: ${formatCurrency(results.crLicenseCostYear)}/yr`,
      `ROI: ${formatMultiple(results.roiMultiple)} return`,
    ];
    return lines.join("\n");
  };

  /**
   * Copies the ROI summary to the clipboard and shows confirmation feedback.
   */
  const handleShare = async () => {
    const summary = generateSummary();
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for environments where clipboard API is unavailable
      const el = document.createElement("textarea");
      el.value = summary;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="share-btn"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        width: "100%",
        padding: "12px",
        background: copied
          ? "linear-gradient(135deg, var(--cr-green), var(--cr-green-light))"
          : "linear-gradient(135deg, var(--cr-orange), var(--cr-orange-light))",
        border: "none",
        borderRadius: "10px",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        fontSize: "14px",
        fontWeight: 700,
        letterSpacing: "0.05em",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: copied
          ? "0 0 20px rgba(34, 197, 94, 0.4)"
          : "0 0 20px rgba(255, 107, 44, 0.3)",
      }}
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? "Copied to Clipboard!" : "Share Results"}
    </button>
  );
}
