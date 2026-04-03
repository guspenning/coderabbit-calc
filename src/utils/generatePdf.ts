import jsPDF from "jspdf";
import type { CalcInputs, CalcResults } from "../hooks/useCalculator";

/** Data passed to the PDF generator. */
export interface PdfData {
  inputs: CalcInputs;
  results: CalcResults;
  /** Optional company / prospect name to include in the header. */
  companyName?: string;
}

// ─── Colour palette (matches app dark theme) ────────────────────────────────
const C = {
  bg: [15, 15, 26] as [number, number, number],
  card: [26, 26, 46] as [number, number, number],
  cardBorder: [255, 87, 10] as [number, number, number], // orange at low opacity
  orange: [255, 107, 44] as [number, number, number],
  green: [34, 197, 94] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  muted: [160, 160, 184] as [number, number, number],
  dim: [107, 107, 128] as [number, number, number],
  divider: [50, 50, 70] as [number, number, number],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Formats a number as a compact USD currency string.
 * @param n - Numeric value
 * @returns Formatted string, e.g. "$3,136,000"
 */
function fmt$(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n));
}

/**
 * Formats a number with commas.
 * @param n - Numeric value
 * @param decimals - Decimal places
 * @returns Formatted string, e.g. "1,234"
 */
function fmtN(n: number, decimals = 0): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

/**
 * Formats a fraction as a percentage string.
 * @param f - Fraction (0–1)
 * @returns e.g. "20%"
 */
function fmtPct(f: number): string {
  return `${Math.round(f * 100)}%`;
}

/**
 * Sets the fill colour and draws a filled rounded-ish rectangle.
 * jsPDF rect() doesn't support border-radius, so we use plain rects.
 */
function fillRect(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  color: [number, number, number],
  alpha = 1
): void {
  const [r, g, b] = color;
  // Blend against bg to simulate alpha
  const br = C.bg[0],
    bg_ = C.bg[1],
    bb = C.bg[2];
  const blended: [number, number, number] = [
    Math.round(br + (r - br) * alpha),
    Math.round(bg_ + (g - bg_) * alpha),
    Math.round(bb + (b - bb) * alpha),
  ];
  doc.setFillColor(...blended);
  doc.rect(x, y, w, h, "F");
}

/**
 * Draws a 1pt horizontal divider line.
 */
function divider(doc: jsPDF, x: number, y: number, w: number): void {
  doc.setDrawColor(...C.divider);
  doc.setLineWidth(0.5);
  doc.line(x, y, x + w, y);
}

// ─── Logo drawing ────────────────────────────────────────────────────────────

/**
 * Draws the CodeRabbit logo icon (orange circle + simplified rabbit silhouette)
 * and the "CodeRabbit" wordmark at the given position.
 * @param doc - jsPDF document
 * @param x - Left edge of the logo
 * @param y - Centre Y of the logo icon
 * @param iconSize - Diameter of the orange circle in pt
 */
function drawLogo(doc: jsPDF, x: number, y: number, iconSize: number): void {
  const r = iconSize / 2;
  const cx = x + r;
  const cy = y;

  // Orange circle background
  doc.setFillColor(...C.orange);
  doc.circle(cx, cy, r, "F");

  // Simplified white rabbit shape: body ellipse + two ear rectangles
  doc.setFillColor(255, 255, 255);

  // Body
  const bw = iconSize * 0.45;
  const bh = iconSize * 0.38;
  doc.ellipse(cx + iconSize * 0.02, cy + iconSize * 0.08, bw / 2, bh / 2, "F");

  // Left ear
  const earW = iconSize * 0.11;
  const earH = iconSize * 0.3;
  doc.ellipse(cx - iconSize * 0.1, cy - iconSize * 0.22, earW / 2, earH / 2, "F");

  // Right ear
  doc.ellipse(cx + iconSize * 0.1, cy - iconSize * 0.24, earW / 2, earH / 2, "F");

  // Wordmark
  doc.setFont("helvetica", "bold");
  doc.setFontSize(iconSize * 0.65);
  doc.setTextColor(...C.white);
  doc.text("CodeRabbit", x + iconSize + 6, cy + iconSize * 0.22);
}

// ─── Main export ─────────────────────────────────────────────────────────────

/**
 * Generates and auto-downloads a branded CodeRabbit ROI PDF report.
 * Uses jsPDF drawing commands for precise dark-theme styling.
 *
 * @param data - Calculated inputs and results from useCalculator
 */
export function generateRoiPdf(data: PdfData): void {
  const { inputs, results, companyName } = data;
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });

  const PW = doc.internal.pageSize.getWidth();   // 792
  const PH = doc.internal.pageSize.getHeight();  // 612
  const ML = 40; // left margin
  const MR = 40; // right margin
  const CW = PW - ML - MR; // content width = 712

  // ── Full dark background ──────────────────────────────────────────────────
  doc.setFillColor(...C.bg);
  doc.rect(0, 0, PW, PH, "F");

  // ── Header ───────────────────────────────────────────────────────────────
  const iconSize = 26;
  const headerCY = 52;
  drawLogo(doc, ML, headerCY, iconSize);

  // Right side: title + date
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const title = companyName ? `ROI Report: ${companyName}` : "ROI Report";
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...C.white);
  const titleW = doc.getTextWidth(title);
  doc.text(title, PW - MR - titleW, headerCY - 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.muted);
  const dateStr = `Generated ${today}`;
  const dateW = doc.getTextWidth(dateStr);
  doc.text(dateStr, PW - MR - dateW, headerCY + 10);

  // ── Divider 1 ─────────────────────────────────────────────────────────────
  const d1y = 76;
  divider(doc, ML, d1y, CW);

  // ── Top metrics row ───────────────────────────────────────────────────────
  const m1y = d1y + 16;

  // Total Annual Savings
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text("TOTAL ANNUAL SAVINGS", ML, m1y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.setTextColor(...C.green);
  doc.text(fmt$(results.totalSavings), ML, m1y + 26);

  // ROI Multiple badge
  const badgeX = ML + 240;
  const badgeY = m1y - 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text("ROI MULTIPLE", badgeX, m1y);

  // Orange badge background
  const roiText = `${results.roiMultiple.toFixed(1)}x return`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const roiW = doc.getTextWidth(roiText);
  fillRect(doc, badgeX - 4, badgeY + 12, roiW + 16, 22, C.orange, 0.18);
  doc.setDrawColor(...C.orange);
  doc.setLineWidth(0.5);
  doc.rect(badgeX - 4, badgeY + 12, roiW + 16, 22);
  doc.setTextColor(...C.orange);
  doc.text(roiText, badgeX + 4, badgeY + 27);

  // CR Annual Cost
  const costX = badgeX + 200;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text("CR ANNUAL COST", costX, m1y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...C.white);
  doc.text(`${fmt$(results.crLicenseCostYear)}/yr`, costX, m1y + 14);

  // ── Divider 2 ─────────────────────────────────────────────────────────────
  const d2y = m1y + 46;
  divider(doc, ML, d2y, CW);

  // ── Two-column section ────────────────────────────────────────────────────
  const col2y = d2y + 14;
  const leftW = 380;
  const rightX = ML + leftW + 24;
  const rightW = CW - leftW - 24;

  // Left column: Savings Breakdown
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text("SAVINGS BREAKDOWN", ML, col2y);

  // Card background
  fillRect(doc, ML - 8, col2y + 6, leftW + 8, 120, C.card, 0.7);
  doc.setDrawColor(C.cardBorder[0], C.cardBorder[1], C.cardBorder[2]);
  doc.setLineWidth(0.5);
  doc.setGState(doc.GState({ opacity: 0.15 }));
  doc.rect(ML - 8, col2y + 6, leftW + 8, 120);
  doc.setGState(doc.GState({ opacity: 1 }));

  // Stacked bar
  const barX = ML + 4;
  const barY = col2y + 20;
  const barH = 28;
  const barW = leftW - 12;
  const total = results.totalSavings;
  const devFrac = total > 0 ? results.devTimeSavedValue / total : 0.5;
  const bugFrac = 1 - devFrac;

  // Bar background
  fillRect(doc, barX, barY, barW, barH, C.card, 1);

  // Dev time segment (orange)
  const devBarW = barW * devFrac;
  doc.setFillColor(...C.orange);
  doc.rect(barX, barY, devBarW, barH, "F");

  // Bug savings segment (green)
  doc.setFillColor(...C.green);
  doc.rect(barX + devBarW, barY, barW * bugFrac, barH, "F");

  // Legend row
  const legY = barY + barH + 16;

  // Dev time legend item
  doc.setFillColor(...C.orange);
  doc.rect(barX, legY - 7, 8, 8, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.muted);
  doc.text("Dev Time Saved", barX + 12, legY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.white);
  doc.text(fmt$(results.devTimeSavedValue), barX + 12, legY + 12);

  // Bug savings legend item
  const bugLegX = barX + barW * 0.52;
  doc.setFillColor(...C.green);
  doc.rect(bugLegX, legY - 7, 8, 8, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.muted);
  doc.text("Early Bug Detection", bugLegX + 12, legY);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...C.white);
  doc.text(fmt$(results.bugsSavedValue), bugLegX + 12, legY + 12);

  // Right column: Key Metrics
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text("KEY METRICS", rightX, col2y);

  fillRect(doc, rightX - 8, col2y + 6, rightW + 8, 120, C.card, 0.7);
  doc.setDrawColor(C.cardBorder[0], C.cardBorder[1], C.cardBorder[2]);
  doc.setLineWidth(0.5);
  doc.setGState(doc.GState({ opacity: 0.15 }));
  doc.rect(rightX - 8, col2y + 6, rightW + 8, 120);
  doc.setGState(doc.GState({ opacity: 1 }));

  const metrics = [
    {
      label: "Hours saved / dev / week",
      value: `${results.timeSavedPerDevPerWeek.toFixed(1)} hrs`,
    },
    {
      label: "Total dev hours saved / year",
      value: fmtN(results.totalDevHoursSavedPerYear),
    },
    {
      label: "Critical bugs caught / year",
      value: fmtN(results.bugsCaughtPerYear),
    },
    {
      label: "Cost per bug avoided",
      value: fmt$(results.costPerBugAvoided),
    },
  ];

  metrics.forEach((m, i) => {
    const rowY = col2y + 24 + i * 24;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...C.muted);
    doc.text(m.label, rightX, rowY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...C.white);
    doc.text(m.value, rightX + rightW - doc.getTextWidth(m.value), rowY);
  });

  // ── Divider 3 ─────────────────────────────────────────────────────────────
  const d3y = col2y + 142;
  divider(doc, ML, d3y, CW);

  // ── Assumptions row ───────────────────────────────────────────────────────
  const assY = d3y + 14;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...C.muted);
  doc.text("ASSUMPTIONS", ML, assY);

  const assumptions = [
    { label: "Developers", value: fmtN(inputs.devSeats) },
    { label: "Avg Salary", value: fmt$(inputs.avgSalary) },
    { label: "Review Time", value: fmtPct(inputs.reviewTimeFraction) },
    { label: "Review Reduction", value: fmtPct(inputs.reviewReduction) },
    { label: "Bugs/dev/wk", value: inputs.bugsPerDevPerWeek.toFixed(1) },
    { label: "Prod Bug Cost", value: fmt$(inputs.bugCostProduction) },
    { label: "CR Catch Rate", value: fmtPct(inputs.bugCatchFraction) },
  ];

  const colCount = assumptions.length;
  const colW = CW / colCount;

  assumptions.forEach((a, i) => {
    const ax = ML + i * colW;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...C.muted);
    doc.text(a.label, ax, assY + 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...C.white);
    doc.text(a.value, ax, assY + 26);
  });

  // Separator pipes between assumptions
  doc.setDrawColor(...C.divider);
  doc.setLineWidth(0.5);
  for (let i = 1; i < colCount; i++) {
    const px = ML + i * colW - colW * 0.1;
    doc.line(px, assY + 6, px, assY + 30);
  }

  // ── Divider 4 ─────────────────────────────────────────────────────────────
  const d4y = assY + 38;
  divider(doc, ML, d4y, CW);

  // ── Footer ────────────────────────────────────────────────────────────────
  const footerY = d4y + 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...C.dim);
  const footerLeft = "Generated by CodeRabbit Calc";
  doc.text(footerLeft, ML, footerY);

  doc.setTextColor(...C.orange);
  const footerUrl = "coderabbit.ai";
  const dotSep = "  •  ";
  const dotW = doc.getTextWidth(dotSep);
  const leftW2 = doc.getTextWidth(footerLeft);
  doc.setTextColor(...C.dim);
  doc.text(dotSep, ML + leftW2, footerY);
  doc.setTextColor(...C.orange);
  doc.text(footerUrl, ML + leftW2 + dotW, footerY);

  // ── Save ──────────────────────────────────────────────────────────────────
  doc.save("CodeRabbit_ROI_Report.pdf");
}
