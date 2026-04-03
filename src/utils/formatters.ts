/**
 * Utility functions for formatting currency, percentages, and numbers
 * used throughout the CodeRabbit Calc dashboard.
 */

/**
 * Formats a number as a USD currency string with commas and $ sign.
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default 0)
 * @returns Formatted currency string, e.g. "$1,234,567"
 */
export function formatCurrency(value: number, decimals = 0): string {
  if (!isFinite(value)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats a number as a percentage string.
 * @param value - The decimal value (e.g. 0.25 for 25%)
 * @param decimals - Number of decimal places (default 0)
 * @returns Formatted percentage string, e.g. "25%"
 */
export function formatPercent(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formats a plain number with commas for thousands separators.
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default 0)
 * @returns Formatted number string, e.g. "1,234"
 */
export function formatNumber(value: number, decimals = 0): string {
  if (!isFinite(value)) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formats an ROI multiple as a string with one decimal place.
 * @param value - The ROI multiple (e.g. 54.9)
 * @returns Formatted string, e.g. "54.9x"
 */
export function formatMultiple(value: number): string {
  if (!isFinite(value) || value <= 0) return "0x";
  return `${value.toFixed(1)}x`;
}

/**
 * Formats hours with one decimal place and unit.
 * @param hours - Number of hours
 * @returns Formatted string, e.g. "2.0 hrs"
 */
export function formatHours(hours: number): string {
  return `${hours.toFixed(1)} hrs`;
}
