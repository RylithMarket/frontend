export function formatUsdValue(
  value: number | string,
  maxDecimals: number = 6,
): string {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "$0.00";
  if (num === 0) return "$0.00";

  if (Math.abs(num) < 0.01) {
    return `$${num.toFixed(maxDecimals)}`;
  }

  return `$${num.toFixed(2)}`;
}

export function formatCompactUsdValue(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return "$0.00";
  if (num === 0) return "$0.00";

  if (Math.abs(num) < 0.01) {
    return `$${num.toFixed(6)}`;
  }

  if (Math.abs(num) >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  }

  if (Math.abs(num) >= 1_000) {
    return `$${(num / 1_000).toFixed(2)}K`;
  }

  return `$${num.toFixed(2)}`;
}

interface FormatNumberOptions {
  decimals?: number;
  maxDecimals?: number;
  currency?: boolean;
  compact?: boolean;
}

export function formatNumber(
  value: number | string,
  options: FormatNumberOptions = {},
): string {
  const {
    decimals = 2,
    maxDecimals = 6,
    currency = false,
    compact = false,
  } = options;

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return currency ? "$0.00" : "0.00";
  if (num === 0) return currency ? "$0.00" : "0.00";

  let formatted = "";

  if (Math.abs(num) < 0.01) {
    formatted = num.toFixed(maxDecimals);
  } else if (compact) {
    if (Math.abs(num) >= 1_000_000) {
      formatted = `${(num / 1_000_000).toFixed(decimals)}M`;
    } else if (Math.abs(num) >= 1_000) {
      formatted = `${(num / 1_000).toFixed(decimals)}K`;
    } else {
      formatted = num.toFixed(decimals);
    }
  } else {
    formatted = num.toFixed(decimals);
  }

  return currency ? `$${formatted}` : formatted;
}
