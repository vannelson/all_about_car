import { format, parseISO } from "date-fns";

import { DEFAULT_CURRENCY } from "./constants";

export const numberFormatter = new Intl.NumberFormat("en-US");

export const createCurrencyFormatter = (
  currency = DEFAULT_CURRENCY,
  options = {}
) => {
  const resolvedCurrency = currency || DEFAULT_CURRENCY;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: resolvedCurrency,
    maximumFractionDigits: 0,
    ...options,
  });
};

export const formatCurrency = (
  value,
  currency = DEFAULT_CURRENCY,
  options = {}
) => {
  if (value === null || value === undefined) return null;
  try {
    return createCurrencyFormatter(currency, options).format(value);
  } catch {
    return createCurrencyFormatter(DEFAULT_CURRENCY, options).format(value);
  }
};

export function safeNumber(value) {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatPeriodRange(period) {
  if (!period?.start || !period?.end) return null;
  try {
    const startLabel = format(parseISO(period.start), "MMM d");
    const endLabel = format(parseISO(period.end), "MMM d, yyyy");
    return `${startLabel} - ${endLabel}`;
  } catch {
    return null;
  }
}

export function resolveMonthLabel(item) {
  if (!item) return "";
  if (item.label) return item.label;
  if (!item.month) return "";
  try {
    return format(parseISO(item.month), "MMM");
  } catch {
    return "";
  }
}

export function resolveSeriesYearLabel(series) {
  if (!Array.isArray(series) || series.length === 0) return null;
  const first = series[0];
  const last = series[series.length - 1];

  const extractYear = (entry) => {
    if (!entry) return null;
    if (typeof entry.year === "number") return entry.year;
    if (entry.month) {
      try {
        return parseISO(entry.month).getFullYear();
      } catch {
        return null;
      }
    }
    return null;
  };

  const startYear = extractYear(first);
  const endYear = extractYear(last);

  if (startYear && endYear) {
    return startYear === endYear ? `${endYear}` : `${startYear}-${endYear}`;
  }
  return startYear || endYear ? String(startYear || endYear) : null;
}

export function ensureDateOnly(input) {
  if (!input) return null;
  if (input instanceof Date && !Number.isNaN(input.valueOf())) {
    return format(input, "yyyy-MM-dd");
  }
  try {
    const parsed = parseISO(String(input));
    if (parsed instanceof Date && !Number.isNaN(parsed.valueOf())) {
      return format(parsed, "yyyy-MM-dd");
    }
  } catch {
    // ignore
  }
  const str = String(input);
  return str.length >= 10 ? str.slice(0, 10) : null;
}
