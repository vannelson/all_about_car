export const DEFAULT_DATE_PRESET = "year_to_date";

export const DATE_RANGE_PRESETS = [
  { value: "last_30_days", label: "Last 30 days" },
  { value: "quarter_to_date", label: "Quarter to date" },
  { value: "year_to_date", label: "Year to date" },
];

export const CHART_GRADIENT_ID = "tenant-dashboard-revenue-gradient";

export const STATUS_COLOR_MAP = {
  Confirmed: "green",
  Completed: "green",
  Pending: "yellow",
  Reserved: "blue",
  Scheduled: "blue",
  Maintenance: "purple",
  Cancelled: "red",
};

export const STATUS_VARIANT_MAP = {
  Confirmed: "solid",
  Completed: "solid",
  Pending: "subtle",
  Reserved: "subtle",
  Scheduled: "subtle",
  Maintenance: "outline",
  Cancelled: "outline",
};

export const BOOKING_ACCENT_MAP = {
  Confirmed: {
    gradient:
      "linear(to-br, rgba(37, 99, 235, 0.12), rgba(59, 130, 246, 0.05))",
    border: "rgba(37, 99, 235, 0.28)",
    highlight: "blue.500",
  },
  Reserved: {
    gradient:
      "linear(to-br, rgba(14, 116, 144, 0.12), rgba(8, 145, 178, 0.05))",
    border: "rgba(8, 145, 178, 0.28)",
    highlight: "teal.500",
  },
  Pending: {
    gradient:
      "linear(to-br, rgba(234, 179, 8, 0.14), rgba(250, 204, 21, 0.05))",
    border: "rgba(234, 179, 8, 0.32)",
    highlight: "yellow.500",
  },
  Scheduled: {
    gradient:
      "linear(to-br, rgba(30, 64, 175, 0.1), rgba(59, 130, 246, 0.04))",
    border: "rgba(59, 130, 246, 0.22)",
    highlight: "blue.400",
  },
  Maintenance: {
    gradient:
      "linear(to-br, rgba(147, 51, 234, 0.16), rgba(168, 85, 247, 0.05))",
    border: "rgba(147, 51, 234, 0.3)",
    highlight: "purple.500",
  },
  Completed: {
    gradient:
      "linear(to-br, rgba(34, 197, 94, 0.14), rgba(16, 185, 129, 0.05))",
    border: "rgba(34, 197, 94, 0.28)",
    highlight: "green.500",
  },
  Cancelled: {
    gradient:
      "linear(to-br, rgba(248, 113, 113, 0.16), rgba(248, 113, 113, 0.05))",
    border: "rgba(248, 113, 113, 0.28)",
    highlight: "red.500",
  },
  default: {
    gradient:
      "linear(to-br, rgba(15, 23, 42, 0.08), rgba(148, 163, 184, 0.05))",
    border: "rgba(148, 163, 184, 0.28)",
    highlight: "gray.500",
  },
};

export const PERFORMER_CARD_THEMES = [
  {
    gradient:
      "linear-gradient(130deg, rgba(37, 99, 235, 0.12), rgba(59, 130, 246, 0.05))",
    border: "rgba(37, 99, 235, 0.22)",
    badge: "blue",
    shadow: "0 18px 35px -22px rgba(37, 99, 235, 0.55)",
  },
  {
    gradient:
      "linear-gradient(130deg, rgba(109, 40, 217, 0.12), rgba(147, 51, 234, 0.05))",
    border: "rgba(147, 51, 234, 0.22)",
    badge: "purple",
    shadow: "0 18px 35px -22px rgba(147, 51, 234, 0.55)",
  },
  {
    gradient:
      "linear-gradient(130deg, rgba(13, 148, 136, 0.12), rgba(16, 185, 129, 0.05))",
    border: "rgba(13, 148, 136, 0.22)",
    badge: "teal",
    shadow: "0 18px 35px -22px rgba(13, 148, 136, 0.55)",
  },
];

export const ACTIVITY_ACCENT_MAP = {
  success: {
    icon: "success",
    color: "green.600",
    bg: "rgba(34, 197, 94, 0.1)",
    border: "rgba(34, 197, 94, 0.24)",
  },
  warning: {
    icon: "warning",
    color: "orange.600",
    bg: "rgba(249, 115, 22, 0.1)",
    border: "rgba(249, 115, 22, 0.24)",
  },
  info: {
    icon: "info",
    color: "blue.600",
    bg: "rgba(59, 130, 246, 0.08)",
    border: "rgba(59, 130, 246, 0.2)",
  },
};

export const DEFAULT_CURRENCY = "USD";

export const CURRENT_YEAR = new Date().getFullYear();
export const PREVIOUS_YEAR = CURRENT_YEAR - 1;
