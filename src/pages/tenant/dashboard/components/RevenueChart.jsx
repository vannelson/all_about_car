import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { CHART_GRADIENT_ID } from "../constants";

const DEFAULT_COLOR = "#2563eb";

const renderTooltip = (tooltipContent, props) =>
  tooltipContent ? tooltipContent(props) : null;

function RevenueAreaChart({
  data,
  currencyFormatter,
  compactCurrencyFormatter,
  tooltipContent,
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={CHART_GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={DEFAULT_COLOR} stopOpacity={0.25} />
            <stop offset="100%" stopColor={DEFAULT_COLOR} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" stroke="#94a3b8" />
        <YAxis
          stroke="#94a3b8"
          tickFormatter={(value) =>
            compactCurrencyFormatter?.format
              ? compactCurrencyFormatter.format(value)
              : value
          }
        />
        <RechartsTooltip
          content={(props) => renderTooltip(tooltipContent, props)}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="total"
          stroke={DEFAULT_COLOR}
          strokeWidth={3}
          fill={`url(#${CHART_GRADIENT_ID})`}
          name="Revenue"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function RevenueBarChart({
  data,
  currencyFormatter,
  compactCurrencyFormatter,
  tooltipContent,
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" stroke="#94a3b8" />
        <YAxis
          stroke="#94a3b8"
          tickFormatter={(value) =>
            compactCurrencyFormatter?.format
              ? compactCurrencyFormatter.format(value)
              : value
          }
        />
        <RechartsTooltip
          content={(props) => renderTooltip(tooltipContent, props)}
        />
        <Legend />
        <Bar
          dataKey="total"
          fill={DEFAULT_COLOR}
          name="Revenue"
          radius={[8, 8, 0, 0]}
          maxBarSize={36}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function RevenueChart(props) {
  const { chartType = "area" } = props;
  const sharedProps = {
    data: props.data,
    currencyFormatter: props.currencyFormatter,
    compactCurrencyFormatter: props.compactCurrencyFormatter,
    tooltipContent: props.tooltipContent,
  };

  if (chartType === "bar") {
    return <RevenueBarChart {...sharedProps} />;
  }

  return <RevenueAreaChart {...sharedProps} />;
}

export default RevenueChart;
