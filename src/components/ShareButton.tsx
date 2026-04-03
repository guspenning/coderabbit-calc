import { useState } from "react";
import { FileDown, Copy, Check, Loader } from "lucide-react";
import type { CalcInputs, CalcResults } from "../hooks/useCalculator";
import { formatCurrency, formatMultiple } from "../utils/formatters";
import { generateRoiPdf } from "../utils/generatePdf";

interface ShareButtonProps {
  inputs: CalcInputs;
  results: CalcResults;
}

/**
 * Provides two export actions for the ROI results:
 * - "Download PDF": generates and downloads a branded dark-theme PDF report
 * - "Copy to Clipboard": copies a plain-text summary to the clipboard
 */
export function ShareButton({ inputs, results }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

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
   * Generates and downloads a branded PDF report of the ROI results.
   * Shows a brief loading state while the PDF is being generated.
   */
  const handleDownloadPdf = async () => {
    if (pdfLoading) return;
    setPdfLoading(true);
    try {
      // Defer to next tick so the loading state renders before the
      // synchronous PDF generation blocks the main thread.
      await new Promise<void>((resolve) => setTimeout(resolve, 50));
      generateRoiPdf({ inputs, results });
    } finally {
      setPdfLoading(false);
    }
  };

  /**
   * Copies the ROI summary to the clipboard and shows confirmation feedback.
   */
  const handleCopy = async () => {
    const summary = generateSummary();
    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      // Fallback for environments where clipboard API is unavailable
      const el = document.createElement("textarea");
      el.value = summary;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      {/* Download PDF — primary action */}
      <button
        onClick={handleDownloadPdf}
        disabled={pdfLoading}
        style={{
          flex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "12px",
          background: pdfLoading
            ? "rgba(255, 107, 44, 0.5)"
            : "linear-gradient(135deg, var(--cr-orange), var(--cr-orange-light))",
          border: "none",
          borderRadius: "10px",
          color: "#fff",
          fontFamily: "'Inter', sans-serif",
          fontSize: "14px",
          fontWeight: 700,
          letterSpacing: "0.05em",
          cursor: pdfLoading ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 0 20px rgba(255, 107, 44, 0.3)",
        }}
      >
        {pdfLoading ? (
          <>
            <Loader size={15} style={{ animation: "spin 1s linear infinite" }} />
            Generating PDF…
          </>
        ) : (
          <>
            <FileDown size={15} />
            Download PDF
          </>
        )}
      </button>

      {/* Copy to Clipboard — secondary action */}
      <button
        onClick={handleCopy}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "12px",
          background: "transparent",
          border: copied
            ? "1px solid var(--cr-green)"
            : "1px solid rgba(255, 107, 44, 0.35)",
          borderRadius: "10px",
          color: copied ? "var(--cr-green)" : "var(--cr-text-muted)",
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.03em",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: copied ? "0 0 12px rgba(34, 197, 94, 0.2)" : "none",
          whiteSpace: "nowrap",
        }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
        {copied ? "Copied!" : "Copy Text"}
      </button>
    </div>
  );
}
