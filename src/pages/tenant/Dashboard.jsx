import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Alert,
  AlertIcon,
  Divider,
  FormControl,
  FormLabel,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  SimpleGrid,
  Stack,
  Tag,
  Text,
  Input,
  Tooltip,
  useDisclosure,
  CircularProgress,
  CircularProgressLabel,
  Skeleton,
} from "@chakra-ui/react";
import {
  FiActivity,
  FiBarChart2,
  FiCalendar,
  FiChevronDown,
  FiClock,
  FiDownload,
  FiDollarSign,
  FiInfo,
  FiRefreshCw,
  FiTrendingUp,
  FiTrendingDown,
  FiCreditCard,
  FiUser,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import { BsSpeedometer2 } from "react-icons/bs";
import { TbSteeringWheel } from "react-icons/tb";
import { format, parseISO } from "date-fns";
import { fetchDashboardSummary } from "../../services/dashboard";
import { fetchDashboardHighlights } from "../../services/highlights";
import { fetchFleetUtilization } from "../../services/fleetUtilization";
import { fetchMonthlySales } from "../../services/monthlySales";
import { fetchRevenueByClass } from "../../services/revenueByClass";
import { fetchUpcomingBookings } from "../../services/upcomingBookings";
import { fetchTopPerformers } from "../../services/topPerformers";

import {
  CURRENT_YEAR,
  DATE_RANGE_PRESETS,
  DEFAULT_DATE_PRESET,
  PREVIOUS_YEAR,
} from "./dashboard/constants";
import {
  createCurrencyFormatter,
  numberFormatter,
  safeNumber,
  formatPeriodRange,
  resolveMonthLabel,
  resolveSeriesYearLabel,
  ensureDateOnly,
} from "./dashboard/formatters";
import StatCard, {
  StatCardSkeleton,
} from "./dashboard/components/StatCards";
import {
  HighlightStatCard,
  HighlightStatCardSkeleton,
} from "./dashboard/components/HighlightCards";
import RevenueChart from "./dashboard/components/RevenueChart";
import UpcomingBookingsSection from "./dashboard/components/UpcomingBookings";
import TopPerformersSection from "./dashboard/components/TopPerformers";
import ActivityTimeline from "./dashboard/components/ActivityTimeline";
import YearComparisonModal from "./dashboard/components/YearComparisonModal";

const activityTimelineData = [
  {
    time: "10:24 AM",
    title: "New corporate reservation",
    description: "5-day booking confirmed for BMW 530e Hybrid",
    type: "success",
  },
  {
    time: "09:15 AM",
    title: "Payment collected",
    description: "$690 partial payment from Siena Group",
    type: "info",
  },
  {
    time: "Yesterday",
    title: "Maintenance completed",
    description: "Oil change and detailing for Alphard Executive",
    type: "success",
  },
  {
    time: "2 days ago",
    title: "Booking declined",
    description: "Schedule conflict for Camry Business",
    type: "warning",
  },
];

const currencyFormatter = createCurrencyFormatter();
const compactCurrencyFormatter = createCurrencyFormatter(undefined, {
  notation: "compact",
  maximumFractionDigits: 1,
});

function RevenueTooltip({ active, payload, label, currencyFormatter: fmt }) {
  if (!active || !payload?.length) return null;

  const dataPoint = payload[0]?.payload;
  const formatter = fmt || currencyFormatter;

  return (
    <Stack
      spacing={1}
      px={3}
      py={2}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.100"
      boxShadow="lg"
    >
      <Text fontWeight="semibold" color="gray.800">
        {label}
      </Text>
      <Text fontSize="sm" color="blue.600" fontWeight="semibold">
        {formatter.format(dataPoint?.total || 0)}
      </Text>
      <HStack spacing={2} fontSize="xs" color="gray.500">
        <Icon as={FiCalendar} boxSize="12px" />
        <Text>{dataPoint?.bookings ?? 0} bookings</Text>
      </HStack>
    </Stack>
  );
}

function RevenueByClass({ data, currencyFormatter }) {
  const safeData = Array.isArray(data) ? data : [];
  if (!safeData.length) {
    return (
      <Box
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.100"
        bg="gray.50"
        p={5}
        textAlign="center"
        color="gray.500"
      >
        No revenue distribution available for this period.
      </Box>
    );
  }
  const maxRevenue = Math.max(
    0,
    ...safeData.map((item) => Number(item.revenue) || 0)
  );
  const formatter =
    currencyFormatter ||
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    });
  return (
    <Stack spacing={4}>
      {safeData.map((item) => {
        const revenueValue = Number(item.revenue) || 0;
        const percentOfMax =
          maxRevenue > 0 ? (revenueValue / maxRevenue) * 100 : 0;
        return (
          <Stack key={item.label} spacing={3}>
            <Flex justify="space-between" align="center">
              <Stack spacing={0}>
                <Text fontWeight="semibold" color="gray.800">
                  {item.label}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {Number(item.share || 0).toFixed(2)}% of revenue
                </Text>
              </Stack>
              <Tag variant="subtle" colorScheme="blue" borderRadius="full">
                {formatter.format(revenueValue)}
              </Tag>
            </Flex>
            <Progress
              value={percentOfMax}
              colorScheme="blue"
              size="sm"
              borderRadius="full"
              bg="rgba(37, 99, 235, 0.12)"
            />
          </Stack>
        );
      })}
    </Stack>
  );
}

function RevenueByClassSkeleton({ rows = 5 }) {
  return (
    <Stack spacing={4}>
      {Array.from({ length: rows }).map((_, idx) => (
        <Stack key={`revenue-skeleton-${idx}`} spacing={3}>
          <Flex justify="space-between" align="center">
            <Stack spacing={1} flex="1">
              <Skeleton height="14px" width="45%" />
              <Skeleton height="10px" width="35%" />
            </Stack>
            <Skeleton height="16px" width="60px" borderRadius="full" />
          </Flex>
          <Skeleton height="8px" borderRadius="full" />
        </Stack>
      ))}
    </Stack>
  );
}

const Dashboard = () => {
  const [chartType, setChartType] = useState("area");
  const [datePreset, setDatePreset] = useState(DEFAULT_DATE_PRESET);
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [customRangeDraft, setCustomRangeDraft] = useState({
    start: "",
    end: "",
  });
  const [summaryData, setSummaryData] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);
  const [monthlySalesSeries, setMonthlySalesSeries] = useState([]);
  const [monthlySalesPrevious, setMonthlySalesPrevious] = useState([]);
  const [monthlySalesTotals, setMonthlySalesTotals] = useState(null);
  const [monthlySalesRange, setMonthlySalesRange] = useState(null);
  const [monthlySalesCurrency, setMonthlySalesCurrency] = useState(null);
  const [isMonthlySalesLoading, setIsMonthlySalesLoading] = useState(false);
  const [monthlySalesError, setMonthlySalesError] = useState(null);
  const [highlights, setHighlights] = useState(null);
  const [isHighlightsLoading, setIsHighlightsLoading] = useState(false);
  const [highlightsError, setHighlightsError] = useState(null);
  const [revenueByClass, setRevenueByClass] = useState([]);
  const [revenueByClassCurrency, setRevenueByClassCurrency] = useState(null);
  const [isRevenueByClassLoading, setIsRevenueByClassLoading] = useState(false);
  const [revenueByClassError, setRevenueByClassError] = useState(null);
  const [utilizationData, setUtilizationData] = useState(null);
  const [isUtilizationLoading, setIsUtilizationLoading] = useState(false);
  const [utilizationError, setUtilizationError] = useState(null);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [upcomingWindow, setUpcomingWindow] = useState(null);
  const [upcomingTotals, setUpcomingTotals] = useState(null);
  const [isUpcomingBookingsLoading, setIsUpcomingBookingsLoading] =
    useState(false);
  const [upcomingBookingsError, setUpcomingBookingsError] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);
  const [topPerformersMeta, setTopPerformersMeta] = useState(null);
  const [isTopPerformersLoading, setIsTopPerformersLoading] = useState(false);
  const [topPerformersError, setTopPerformersError] = useState(null);
  const {
    isOpen: isComparisonOpen,
    onOpen: onComparisonOpen,
    onClose: onComparisonClose,
  } = useDisclosure();
  const {
    isOpen: isCustomRangeOpen,
    onOpen: onCustomRangeOpen,
    onClose: onCustomRangeClose,
  } = useDisclosure();
  const {
    isOpen: isUtilizationModalOpen,
    onOpen: onUtilizationModalOpen,
    onClose: onUtilizationModalClose,
  } = useDisclosure();

const browserTimezone = useMemo(
  () => Intl.DateTimeFormat().resolvedOptions().timeZone,
  []
);

const formatCurrencyForDisplay = useCallback((value, code) => {
  if (value === null || value === undefined) return null;
  const currencyCode = code || "USD";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return currencyFormatter.format(value);
  }
}, []);

const ensureDateOnly = useCallback((input) => {
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
    // ignore parse failure
  }
  const str = String(input);
  return str.length >= 10 ? str.slice(0, 10) : null;
}, []);

  const selectedRangeLabel = useMemo(() => {
    if (datePreset === "custom") {
      if (customRange.start && customRange.end) {
        const startLabel = format(parseISO(customRange.start), "MMM d, yyyy");
        const endLabel = format(parseISO(customRange.end), "MMM d, yyyy");
        return `${startLabel} - ${endLabel}`;
      }
      return "Custom range";
    }

    return (
      DATE_RANGE_PRESETS.find((preset) => preset.value === datePreset)?.label ??
      DATE_RANGE_PRESETS.find((preset) => preset.value === DEFAULT_DATE_PRESET)
        ?.label ??
      "Year to date"
    );
  }, [datePreset, customRange.end, customRange.start]);

  const handlePresetSelect = (value) => {
    setDatePreset(value);
  };

  const handleCustomRangeMenuClick = () => {
    const today = new Date();
    const defaultEnd = format(today, "yyyy-MM-dd");
    const defaultStart = format(
      new Date(today.getFullYear(), today.getMonth(), 1),
      "yyyy-MM-dd"
    );

    setCustomRangeDraft({
      start: customRange.start || defaultStart,
      end: customRange.end || defaultEnd,
    });
    onCustomRangeOpen();
  };

  const handleCustomRangeDraftChange = (field) => (event) => {
    const { value } = event.target;
    setCustomRangeDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyCustomRange = () => {
    if (!customRangeDraft.start || !customRangeDraft.end) {
      return;
    }

    setCustomRange({
      start: customRangeDraft.start,
      end: customRangeDraft.end,
    });
    setDatePreset("custom");
    onCustomRangeClose();
  };

  const handleCancelCustomRange = () => {
    onCustomRangeClose();
  };

  const isCustomRangeReady =
    Boolean(customRangeDraft.start) &&
    Boolean(customRangeDraft.end) &&
    customRangeDraft.start <= customRangeDraft.end;
  const showCustomRangeError =
    Boolean(customRangeDraft.start) &&
    Boolean(customRangeDraft.end) &&
    customRangeDraft.start > customRangeDraft.end;

  const shouldFetchSummary = useMemo(() => {
    if (datePreset !== "custom") return true;
    return Boolean(customRange.start) && Boolean(customRange.end);
  }, [customRange.end, customRange.start, datePreset]);

  const effectiveAsOf = useMemo(() => {
    const todayIso = format(new Date(), "yyyy-MM-dd");
    if (datePreset === "custom" && customRange.end) {
      return customRange.end;
    }
    if (summaryData?.resolvedRange?.end) {
      return summaryData.resolvedRange.end;
    }
    return todayIso;
  }, [customRange.end, datePreset, summaryData?.resolvedRange?.end]);

  const upcomingStartDate = useMemo(
    () => ensureDateOnly(effectiveAsOf),
    [ensureDateOnly, effectiveAsOf]
  );

  const topPerformersAsOfDate = useMemo(
    () => ensureDateOnly(effectiveAsOf),
    [ensureDateOnly, effectiveAsOf]
  );

  useEffect(() => {
    if (!shouldFetchSummary) {
      setIsSummaryLoading(false);
      return;
    }
    let active = true;
    async function loadSummary() {
      setIsSummaryLoading(true);
      try {
        const payload = {
          preset: datePreset,
          includeTrend: true,
        };
        if (datePreset === "custom") {
          payload.startDate = customRange.start;
          payload.endDate = customRange.end;
        }
        const response = await fetchDashboardSummary(payload);
        if (!active) return;
        setSummaryData(response);
        setSummaryError(null);
      } catch (error) {
        if (!active) return;
        setSummaryError(
          error?.message || "Failed to load dashboard summary data."
        );
      } finally {
        if (active) {
          setIsSummaryLoading(false);
        }
      }
    }
    loadSummary();
    return () => {
      active = false;
    };
  }, [shouldFetchSummary, effectiveAsOf]);

  useEffect(() => {
    if (!shouldFetchSummary) {
      setIsHighlightsLoading(false);
      return;
    }
    let active = true;
    async function loadHighlights() {
      setIsHighlightsLoading(true);
      try {
        const response = await fetchDashboardHighlights({
          asOf: effectiveAsOf,
        });
        if (!active) return;
        setHighlights(response || null);
        setHighlightsError(null);
      } catch (error) {
        if (!active) return;
        setHighlights(null);
        setHighlightsError(
          error?.message || "Failed to load dashboard highlights."
        );
      } finally {
        if (active) {
          setIsHighlightsLoading(false);
        }
      }
    }
    loadHighlights();
    return () => {
      active = false;
    };
  }, [effectiveAsOf, shouldFetchSummary]);

  useEffect(() => {
    if (!shouldFetchSummary) {
      setIsMonthlySalesLoading(false);
      return;
    }
    let active = true;
    async function loadMonthlySales() {
      setIsMonthlySalesLoading(true);
      try {
        const payload = {
          includePrevious: true,
        };
        if (effectiveAsOf) {
          payload.asOf = effectiveAsOf;
        }

        if (datePreset === "year_to_date") {
          const refDate = effectiveAsOf ? parseISO(effectiveAsOf) : new Date();
          if (refDate instanceof Date && !Number.isNaN(refDate.valueOf())) {
            payload.year = refDate.getFullYear();
            payload.asOf = format(refDate, "yyyy-MM-dd");
          }
        } else if (
          datePreset === "custom" &&
          customRange.start &&
          customRange.end
        ) {
          const startDate = parseISO(customRange.start);
          const endDate = parseISO(customRange.end);
          if (
            startDate instanceof Date &&
            !Number.isNaN(startDate.valueOf()) &&
            endDate instanceof Date &&
            !Number.isNaN(endDate.valueOf())
          ) {
            payload.startYear = startDate.getFullYear();
            payload.endYear = endDate.getFullYear();
            payload.asOf = format(endDate, "yyyy-MM-dd");
          }
        }

        const response = await fetchMonthlySales(payload);
        if (!active) return;
        setMonthlySalesSeries(response?.series ?? []);
        setMonthlySalesPrevious(response?.previous ?? []);
        setMonthlySalesTotals(response?.totals ?? null);
        setMonthlySalesRange(response?.range ?? null);
        setMonthlySalesCurrency(response?.currency ?? null);
        setMonthlySalesError(null);
      } catch (error) {
        if (!active) return;
        setMonthlySalesSeries([]);
        setMonthlySalesPrevious([]);
        setMonthlySalesTotals(null);
        setMonthlySalesRange(null);
        setMonthlySalesCurrency(null);
        setMonthlySalesError(
          error?.message || "Failed to load monthly sales data."
        );
      } finally {
        if (active) {
          setIsMonthlySalesLoading(false);
        }
      }
    }
    loadMonthlySales();
    return () => {
      active = false;
    };
  }, [
    shouldFetchSummary,
    datePreset,
    customRange.start,
    customRange.end,
    effectiveAsOf,
  ]);

  useEffect(() => {
    if (!shouldFetchSummary) {
      setIsRevenueByClassLoading(false);
      return;
    }
    let active = true;
    async function loadRevenueByClass() {
      setIsRevenueByClassLoading(true);
      try {
        const payload = {
          preset: datePreset === "custom" ? "custom" : "year_to_date",
          includeOthers: true,
          limit: 10,
          asOf: effectiveAsOf,
        };
        if (payload.preset === "custom") {
          payload.startDate = customRange.start;
          payload.endDate = customRange.end;
        }
        const response = await fetchRevenueByClass(payload);
        if (!active) return;
        setRevenueByClass(response?.items ?? []);
        setRevenueByClassCurrency(response?.currency ?? null);
        setRevenueByClassError(null);
      } catch (error) {
        if (!active) return;
        setRevenueByClass([]);
        setRevenueByClassCurrency(null);
        setRevenueByClassError(
          error?.message || "Failed to load revenue by vehicle class."
        );
      } finally {
        if (active) {
          setIsRevenueByClassLoading(false);
        }
      }
    }
    loadRevenueByClass();
    return () => {
      active = false;
    };
  }, [
    shouldFetchSummary,
    datePreset,
    customRange.start,
    customRange.end,
    effectiveAsOf,
  ]);

  useEffect(() => {
    if (!shouldFetchSummary) {
      setIsUtilizationLoading(false);
      return;
    }
    let active = true;
    async function loadUtilization() {
      setIsUtilizationLoading(true);
      try {
        const payload = {
          includeTrend: true,
          includeBreakdown: true,
          asOf: effectiveAsOf,
        };
        const response = await fetchFleetUtilization(payload);
        if (!active) return;
        setUtilizationData(response);
        setUtilizationError(null);
      } catch (error) {
        if (!active) return;
        setUtilizationError(
          error?.message || "Failed to load fleet utilisation data."
        );
      } finally {
        if (active) {
          setIsUtilizationLoading(false);
        }
      }
    }
    loadUtilization();
    return () => {
      active = false;
    };
  }, [customRange.end, customRange.start, datePreset, shouldFetchSummary]);

  useEffect(() => {
    if (!upcomingStartDate) return;
    let active = true;

    async function loadUpcomingBookings() {
      setIsUpcomingBookingsLoading(true);
      try {
        const response = await fetchUpcomingBookings({
          startDate: upcomingStartDate,
          limit: 6,
          includeWaitlist: true,
          timezone: browserTimezone,
        });
        if (!active) return;
        setUpcomingBookings(response?.items ?? []);
        setUpcomingWindow(response?.window ?? null);
        setUpcomingTotals(response?.totals ?? null);
        setUpcomingBookingsError(null);
      } catch (error) {
        if (!active) return;
        setUpcomingBookings([]);
        setUpcomingWindow(null);
        setUpcomingTotals(null);
        setUpcomingBookingsError(
          error?.message || "Failed to load upcoming bookings."
        );
      } finally {
        if (active) {
          setIsUpcomingBookingsLoading(false);
        }
      }
    }

    loadUpcomingBookings();

    return () => {
      active = false;
    };
  }, [browserTimezone, upcomingStartDate]);

  useEffect(() => {
    if (!topPerformersAsOfDate) return;
    let active = true;

    async function loadTopPerformers() {
      setIsTopPerformersLoading(true);
      try {
        const response = await fetchTopPerformers({
          preset: "rolling_30",
          metric: "revenue",
          limit: 5,
          includeTotals: true,
          timezone: browserTimezone,
          asOf: topPerformersAsOfDate,
        });
        if (!active) return;
        setTopPerformers(response?.leaders ?? []);
        setTopPerformersMeta({
          currency: response?.currency ?? null,
          range: response?.range ?? null,
          totals: response?.totals ?? null,
          metric: response?.metric ?? "revenue",
          preset: response?.preset ?? "rolling_30",
        });
        setTopPerformersError(null);
      } catch (error) {
        if (!active) return;
        setTopPerformers([]);
        setTopPerformersMeta(null);
        setTopPerformersError(
          error?.message || "Failed to load top performers."
        );
      } finally {
        if (active) {
          setIsTopPerformersLoading(false);
        }
      }
    }

    loadTopPerformers();

    return () => {
      active = false;
    };
  }, [browserTimezone, topPerformersAsOfDate]);

  const resolvedCurrency = summaryData?.period?.currency || "PHP";

  const summaryCurrencyFormatter = useMemo(
    () => createCurrencyFormatter(resolvedCurrency, { maximumFractionDigits: 2 }),
    [resolvedCurrency]
  );

  const summaryCompactCurrencyFormatter = useMemo(
    () =>
      createCurrencyFormatter(resolvedCurrency, {
        notation: "compact",
        maximumFractionDigits: 1,
      }),
    [resolvedCurrency]
  );

  const salesCurrencyCode = monthlySalesCurrency || resolvedCurrency;
  const monthlyCurrencyFormatter = useMemo(
    () => createCurrencyFormatter(salesCurrencyCode, { maximumFractionDigits: 2 }),
    [salesCurrencyCode]
  );
  const monthlyCompactCurrencyFormatter = useMemo(
    () =>
      createCurrencyFormatter(salesCurrencyCode, {
        notation: "compact",
        maximumFractionDigits: 1,
      }),
    [salesCurrencyCode]
  );
  const highlightsCurrency =
    highlights?.totals?.sales?.currency || salesCurrencyCode;
  const highlightsCurrencyFormatter = useMemo(
    () => createCurrencyFormatter(highlightsCurrency, { maximumFractionDigits: 2 }),
    [highlightsCurrency]
  );
  const revenueByClassCurrencyFormatter = useMemo(
    () =>
      createCurrencyFormatter(revenueByClassCurrency || salesCurrencyCode, {
        notation: "compact",
        maximumFractionDigits: 1,
      }),
    [revenueByClassCurrency, salesCurrencyCode]
  );
  const salesChartData = useMemo(
    () =>
      (monthlySalesSeries || []).map((item) => {
        const total = safeNumber(item?.actual_return) ?? 0;
        const bookings = safeNumber(item?.completed_bookings) ?? 0;
        return {
          month: resolveMonthLabel(item),
          total,
          bookings,
          monthIso: item?.month ?? null,
          averageBookingValue: safeNumber(item?.average_booking_value),
        };
      }),
    [monthlySalesSeries]
  );

  const salesComparisonData = useMemo(() => {
    const previous = monthlySalesPrevious || [];
    return (monthlySalesSeries || []).map((item, index) => {
      const previousItem = previous[index] ?? null;
      return {
        month: resolveMonthLabel(item),
        currentYear: safeNumber(item?.actual_return) ?? 0,
        previousYear: safeNumber(previousItem?.actual_return) ?? 0,
        currentBookings: safeNumber(item?.completed_bookings) ?? 0,
        previousBookings: safeNumber(previousItem?.completed_bookings) ?? 0,
      };
    });
  }, [monthlySalesSeries, monthlySalesPrevious]);

  const currentComparisonLabel = useMemo(
    () => resolveSeriesYearLabel(monthlySalesSeries),
    [monthlySalesSeries]
  );
  const previousComparisonLabel = useMemo(
    () => resolveSeriesYearLabel(monthlySalesPrevious),
    [monthlySalesPrevious]
  );

  const utilizationRateRaw = safeNumber(utilizationData?.utilization?.rate);
  const fleetUtilizationRate =
    utilizationRateRaw != null
      ? Math.min(Math.max(utilizationRateRaw, 0), 1)
      : null;
  const fleetPercent =
    fleetUtilizationRate != null
      ? Math.round(fleetUtilizationRate * 100)
      : null;
  const utilizationTrendRaw = safeNumber(
    utilizationData?.utilization?.trend?.percent_change
  );
  const utilizationDeltaLabel =
    utilizationTrendRaw != null
      ? `${utilizationTrendRaw >= 0 ? "+" : ""}${utilizationTrendRaw.toFixed(
          1
        )}%`
      : null;
  const utilizationDeltaType =
    utilizationTrendRaw == null
      ? "neutral"
      : utilizationTrendRaw >= 0
      ? "increase"
      : "decrease";
  const activeRentals = safeNumber(utilizationData?.totals?.active_rentals);
  const totalFleet = safeNumber(utilizationData?.totals?.fleet);
  const availableUnits = safeNumber(utilizationData?.totals?.available);
  const unavailableUnits = safeNumber(utilizationData?.totals?.unavailable);
  const utilizationSubtitle =
    activeRentals != null && totalFleet != null
      ? `${activeRentals} of ${totalFleet} vehicles on rent`
      : "Active rentals today";
  const fleetPercentDisplay =
    fleetPercent != null
      ? `${fleetPercent}%`
      : isUtilizationLoading && !utilizationData
      ? "Loading..."
      : "--";
  const utilizationAsOfRaw = utilizationData?.as_of ?? null;
  const utilizationAsOfDate = useMemo(() => {
    if (!utilizationAsOfRaw) return null;
    try {
      return parseISO(utilizationAsOfRaw);
    } catch {
      return null;
    }
  }, [utilizationAsOfRaw]);
  const utilizationAsOfLabel = useMemo(() => {
    if (!utilizationAsOfDate) return null;
    try {
      return format(utilizationAsOfDate, "MMM d, yyyy h:mm a");
    } catch {
      return null;
    }
  }, [utilizationAsOfDate]);
  const utilizationPreviousPeriod =
    utilizationData?.utilization?.trend?.previous?.period;
  const utilizationPreviousPeriodLabel =
    utilizationPreviousPeriod?.start && utilizationPreviousPeriod?.end
      ? formatPeriodRange(utilizationPreviousPeriod)
      : null;

  const highlightsSales = highlights?.totals?.sales ?? null;
  const highlightsAvailability = highlights?.totals?.availability ?? null;
  const highlightsMonthProgress = highlights?.totals?.month_progress ?? null;
  const highlightsAsOfRaw = highlights?.as_of ?? null;
  const highlightsAsOfDate = useMemo(() => {
    if (!highlightsAsOfRaw) return null;
    try {
      return parseISO(highlightsAsOfRaw);
    } catch {
      return null;
    }
  }, [highlightsAsOfRaw]);
  const highlightsAsOfLabel = useMemo(() => {
    if (!highlightsAsOfDate) return null;
    try {
      return format(highlightsAsOfDate, "MMM d, yyyy h:mm a");
    } catch {
      return null;
    }
  }, [highlightsAsOfDate]);

  const highlightsSalesAmount = safeNumber(highlightsSales?.amount);
  const highlightsSalesValueLabel =
    highlightsSalesAmount != null
      ? highlightsCurrencyFormatter.format(highlightsSalesAmount)
      : isHighlightsLoading
      ? "Loading..."
      : "--";
  const highlightsSalesSubtitle = (() => {
    if (highlightsSales?.period_start && highlightsSales?.period_end) {
      try {
        const start = format(parseISO(highlightsSales.period_start), "MMM d");
        const end = format(parseISO(highlightsSales.period_end), "MMM d, yyyy");
        return `${start} - ${end}`;
      } catch {
        // ignore and fall through
      }
    }
    if (highlightsAsOfDate) {
      return format(highlightsAsOfDate, "MMM yyyy");
    }
    return "Current period";
  })();
  const highlightsSalesBookingsLabel =
    highlightsSales != null
      ? `${numberFormatter.format(highlightsSales?.bookings ?? 0)} bookings`
      : isHighlightsLoading
      ? "Fetching bookings..."
      : "Bookings data unavailable";
  const highlightsSalesFooter =
    highlightsSales?.period_end != null
      ? "Latest reported month"
      : highlightsAsOfLabel
      ? `As of ${highlightsAsOfLabel}`
      : null;

  const highlightsAvailableValue =
    highlightsAvailability?.available != null
      ? numberFormatter.format(highlightsAvailability.available)
      : isHighlightsLoading
      ? "Loading..."
      : "--";
  const highlightsAvailabilitySubtitle =
    highlightsAvailability?.fleet_total != null
      ? `of ${numberFormatter.format(
          highlightsAvailability.fleet_total
        )} vehicles`
      : "Available right now";
  const highlightsAvailabilityMeta =
    highlightsAvailability?.active_rentals != null ||
    highlightsAvailability?.unavailable != null ? (
      <HStack spacing={2}>
        <Tag size="sm" colorScheme="blue" variant="subtle" borderRadius="full">
          Active{" "}
          {numberFormatter.format(highlightsAvailability?.active_rentals ?? 0)}
        </Tag>
        <Tag size="sm" colorScheme="gray" variant="subtle" borderRadius="full">
          Unavailable{" "}
          {numberFormatter.format(highlightsAvailability?.unavailable ?? 0)}
        </Tag>
      </HStack>
    ) : null;
  const highlightsAvailabilityFooter = highlightsAsOfLabel
    ? `Snapshot captured ${highlightsAsOfLabel}`
    : null;

  const highlightsDaysElapsed = safeNumber(
    highlightsMonthProgress?.days_elapsed
  );
  const highlightsDaysRemaining = safeNumber(
    highlightsMonthProgress?.days_remaining
  );
  const highlightsDaysTotal = safeNumber(highlightsMonthProgress?.total_days);
  const highlightsMonthReference = useMemo(() => {
    if (!highlightsMonthProgress?.month) return highlightsAsOfDate;
    try {
      return parseISO(highlightsMonthProgress.month);
    } catch {
      return highlightsAsOfDate;
    }
  }, [highlightsMonthProgress?.month, highlightsAsOfDate]);
  const highlightsDaysValue =
    highlightsDaysElapsed != null && highlightsDaysTotal != null
      ? `${highlightsDaysElapsed}/${highlightsDaysTotal} days`
      : isHighlightsLoading
      ? "Loading..."
      : "--";
  const highlightsDaysSubtitle = highlightsMonthReference
    ? `Progress through ${format(highlightsMonthReference, "MMMM yyyy")}`
    : "Current month progress";
  const highlightsDaysMeta =
    highlightsDaysElapsed != null || highlightsDaysRemaining != null ? (
      <HStack spacing={2}>
        <Tag size="sm" colorScheme="green" variant="subtle" borderRadius="full">
          {highlightsDaysElapsed != null
            ? `${highlightsDaysElapsed} days passed`
            : "Days passed unavailable"}
        </Tag>
        <Tag
          size="sm"
          colorScheme="orange"
          variant="subtle"
          borderRadius="full"
        >
          {highlightsDaysRemaining != null
            ? `${highlightsDaysRemaining} remaining`
            : "Remaining unavailable"}
        </Tag>
      </HStack>
    ) : null;
  const highlightsDaysFooter = highlightsAsOfLabel
    ? `As of ${highlightsAsOfLabel}`
    : null;

  const summaryTotals = summaryData?.totals ?? {};
  const summaryTrend = summaryData?.trend ?? null;
  const percentChange = summaryTrend?.percentChange ?? {};
  const previousTotals = summaryTrend?.previous ?? null;

  const annualRevenue = safeNumber(summaryTotals?.annualRevenue);
  const bookingsYtd = safeNumber(summaryTotals?.bookingsYtd);
  const averageBookingValue = safeNumber(summaryTotals?.averageBookingValue);

  const revenueChange = safeNumber(percentChange?.annualRevenue);
  const bookingsChange = safeNumber(percentChange?.bookingsYtd);
  const averageValueChange = safeNumber(percentChange?.averageBookingValue);

  const previousRevenue = safeNumber(previousTotals?.annualRevenue);
  const previousBookings = safeNumber(previousTotals?.bookingsYtd);
  const previousAverageBookingValue = safeNumber(
    previousTotals?.averageBookingValue
  );
  const previousPeriodLabel = previousTotals?.period
    ? formatPeriodRange(previousTotals.period)
    : null;
  const resolvedRangeLabel = summaryData?.resolvedRange
    ? formatPeriodRange(summaryData.resolvedRange)
    : null;

  const buildPreviousLine = (valueLabel) => {
    if (!valueLabel && !previousPeriodLabel) return undefined;
    const pieces = [];
    if (valueLabel) {
      pieces.push(valueLabel);
    }
    if (previousPeriodLabel) {
      pieces.push(previousPeriodLabel);
    }
    return `Previous: ${pieces.join(" / ")}`;
  };

  const revenueValueDisplay =
    annualRevenue != null
      ? summaryCompactCurrencyFormatter.format(annualRevenue)
      : isSummaryLoading && !summaryData
      ? "Loading..."
      : "--";
  const bookingsValueDisplay =
    bookingsYtd != null
      ? numberFormatter.format(bookingsYtd)
      : isSummaryLoading && !summaryData
      ? "Loading..."
      : "--";
  const averageBookingValueDisplay =
    averageBookingValue != null
      ? summaryCurrencyFormatter.format(averageBookingValue)
      : isSummaryLoading && !summaryData
      ? "Loading..."
      : "--";

  const revenueDeltaType =
    revenueChange == null
      ? "neutral"
      : revenueChange > 0
      ? "increase"
      : revenueChange < 0
      ? "decrease"
      : "neutral";
  const bookingsDeltaType =
    bookingsChange == null
      ? "neutral"
      : bookingsChange > 0
      ? "increase"
      : bookingsChange < 0
      ? "decrease"
      : "neutral";
  const averageValueDeltaType =
    averageValueChange == null
      ? "neutral"
      : averageValueChange > 0
      ? "increase"
      : averageValueChange < 0
      ? "decrease"
      : "neutral";

  const revenueDeltaLabel =
    revenueChange == null
      ? null
      : `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(2)}%`;
  const bookingsDeltaLabel =
    bookingsChange == null
      ? null
      : `${bookingsChange >= 0 ? "+" : ""}${bookingsChange.toFixed(2)}%`;
  const averageBookingValueDeltaLabel =
    averageValueChange == null
      ? null
      : `${averageValueChange >= 0 ? "+" : ""}${averageValueChange.toFixed(
          2
        )}%`;

  const revenueSubtitle = buildPreviousLine(
    previousRevenue != null
      ? summaryCompactCurrencyFormatter.format(previousRevenue)
      : null
  );
  const bookingsSubtitle = buildPreviousLine(
    previousBookings != null
      ? numberFormatter.format(previousBookings)
      : null
  );
  const averageBookingValueSubtitle = buildPreviousLine(
    previousAverageBookingValue != null
      ? summaryCurrencyFormatter.format(previousAverageBookingValue)
      : null
  );

  const comparisonData = salesComparisonData;

  const comparisonSummary = useMemo(() => {
    const totals = monthlySalesTotals ?? {};
    const currentTotals = totals.current ?? null;
    const previousTotals = totals.previous ?? null;
    const percent = totals.percent_change ?? {};

    const currentRevenue =
      safeNumber(currentTotals?.actual_return) ??
      salesChartData.reduce((sum, item) => sum + (item.total || 0), 0);
    const previousRevenue =
      safeNumber(previousTotals?.actual_return) ??
      (monthlySalesPrevious || []).reduce(
        (sum, item) => sum + (safeNumber(item?.actual_return) ?? 0),
        0
      );
    const currentBookingsCount =
      safeNumber(currentTotals?.completed_bookings) ??
      salesChartData.reduce((sum, item) => sum + (item.bookings || 0), 0);
    const previousBookingsCount =
      safeNumber(previousTotals?.completed_bookings) ??
      (monthlySalesPrevious || []).reduce(
        (sum, item) => sum + (safeNumber(item?.completed_bookings) ?? 0),
        0
      );

    const revenueDeltaRaw = safeNumber(percent?.actual_return);
    const bookingDeltaRaw = safeNumber(percent?.completed_bookings);

    const revenueDelta =
      revenueDeltaRaw != null && !Number.isNaN(revenueDeltaRaw)
        ? revenueDeltaRaw
        : previousRevenue === 0
        ? 0
        : ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    const bookingDelta =
      bookingDeltaRaw != null && !Number.isNaN(bookingDeltaRaw)
        ? bookingDeltaRaw
        : previousBookingsCount === 0
        ? 0
        : ((currentBookingsCount - previousBookingsCount) /
            (previousBookingsCount || 1)) *
          100;

    return {
      currentRevenue,
      previousRevenue,
      currentBookings: currentBookingsCount,
      previousBookings: previousBookingsCount,
      revenueDelta,
      bookingDelta,
    };
  }, [monthlySalesTotals, salesChartData, monthlySalesPrevious]);

  const upcomingWindowLabel = useMemo(() => {
    if (!upcomingWindow?.start || !upcomingWindow?.end) return null;
    try {
      const start = format(parseISO(upcomingWindow.start), "MMM d");
      const end = format(parseISO(upcomingWindow.end), "MMM d");
      if (start === end) return start;
      return `${start} - ${end}`;
    } catch {
      return null;
    }
  }, [upcomingWindow?.end, upcomingWindow?.start]);

  const upcomingGeneratedAtLabel = useMemo(() => {
    if (!upcomingWindow?.generated_at) return null;
    try {
      return format(parseISO(upcomingWindow.generated_at), "MMM d, yyyy h:mm a");
    } catch {
      return null;
    }
  }, [upcomingWindow?.generated_at]);

  const upcomingBookingItems = useMemo(() => {
    return (upcomingBookings || []).map((item, index) => {
      const pickupAt = item?.pickup_at ? parseISO(item.pickup_at) : null;
      const dropoffAt = item?.dropoff_at ? parseISO(item.dropoff_at) : null;
      const pickupLabel = pickupAt
        ? format(pickupAt, "MMM d, h:mm a")
        : item?.pickup_at || null;
      const dropoffLabel = dropoffAt
        ? format(dropoffAt, "MMM d, h:mm a")
        : item?.dropoff_at || null;
      const amountTotal = safeNumber(item?.amount?.total);
      const unitLabel = [item?.vehicle?.name, item?.vehicle?.plate_no]
        .filter(Boolean)
        .join(" • ");
      return {
        id: item?.booking_id || item?.id || `booking-${index}`,
        status: item?.status || "Scheduled",
        guest: item?.renter?.name || "Guest pending",
        guestPhone: item?.renter?.phone || null,
        unit: unitLabel || "Vehicle to be confirmed",
        value: amountTotal,
        currency: item?.amount?.currency || null,
        pickup: item?.pickup_location || null,
        pickupLabel,
        dropoff: item?.dropoff_location || null,
        dropoffLabel,
        date: pickupLabel,
        pickupTime: pickupLabel,
        instructions: item?.notes || null,
        raw: item,
      };
    });
  }, [upcomingBookings]);

  const topPerformersItems = useMemo(() => {
    return (topPerformers || []).map((leader, index) => {
      const metrics = leader?.metrics ?? {};
      const trend = leader?.trend ?? {};
      const revenue = safeNumber(metrics.revenue) ?? 0;
      const bookings = safeNumber(metrics.bookings);
      const occupancyRate = safeNumber(metrics.occupancy_rate);
      const utilizationRate = safeNumber(metrics.utilization_rate);
      return {
        rank: index + 1,
        name: leader?.name || "Unnamed unit",
        plate: leader?.plate_no || "",
        class: leader?.class || null,
        imageUrl: leader?.image_url || null,
        revenue,
        bookings,
        occupancyRate,
        utilizationRate,
        avgDailyRate: safeNumber(metrics.avg_daily_rate),
        revenueChangePct: safeNumber(trend.revenue_change_pct),
        occupancyChangePct: safeNumber(trend.occupancy_change_pct),
        utilizationChangePct: safeNumber(trend.utilization_change_pct),
      };
    });
  }, [topPerformers]);

  const topPerformersRangeLabel = useMemo(() => {
    const range = topPerformersMeta?.range;
    if (!range?.start || !range?.end) return null;
    try {
      const start = format(parseISO(range.start), "MMM d");
      const end = format(parseISO(range.end), "MMM d, yyyy");
      return `${start} - ${end}`;
    } catch {
      return null;
    }
  }, [topPerformersMeta?.range]);

  const topPerformersMetricLabel = useMemo(() => {
    const metric = topPerformersMeta?.metric || "revenue";
    switch (metric) {
      case "occupancy":
        return "Vehicles leading by occupancy";
      case "utilization":
        return "Vehicles leading by utilisation";
      default:
        return "Vehicles driving revenue";
    }
  }, [topPerformersMeta?.metric]);

  const topPerformersTotalsRevenueLabel = useMemo(() => {
    const total = safeNumber(topPerformersMeta?.totals?.leaders_revenue);
    return total != null
      ? formatCurrencyForDisplay(total, topPerformersMeta?.currency)
      : null;
  }, [
    formatCurrencyForDisplay,
    topPerformersMeta?.currency,
    topPerformersMeta?.totals?.leaders_revenue,
  ]);

  const topPerformersShareLabel = useMemo(() => {
    const share = safeNumber(topPerformersMeta?.totals?.leaders_share_pct);
    return share != null ? `${share.toFixed(1)}%` : null;
  }, [topPerformersMeta?.totals?.leaders_share_pct]);

  const fleetPercentValue = fleetPercent ?? 0;
  const utilizationNarrative =
    utilizationDeltaLabel && utilizationPreviousPeriodLabel
      ? `Utilisation is ${Math.abs(utilizationTrendRaw).toFixed(1)}% ${
          utilizationTrendRaw >= 0 ? "higher" : "lower"
        } than ${utilizationPreviousPeriodLabel}.`
      : utilizationDeltaLabel
      ? `Utilisation changed by ${utilizationDeltaLabel.replace(
          "+",
          ""
        )} from the previous period.`
      : "Trend comparison is not available.";

  const primaryPeriodLabel = resolvedRangeLabel || selectedRangeLabel;

  const makeInfoBadge = (label, icon, colorScheme = "gray") => (
    <Badge
      px={2.5}
      py={0.5}
      borderRadius="full"
      colorScheme={colorScheme}
      variant="subtle"
      display="inline-flex"
      alignItems="center"
      gap={1}
      textTransform="none"
    >
      {icon ? <Icon as={icon} boxSize="10px" /> : null}
      <Text fontSize="xs" fontWeight="semibold" color="gray.700">
        {label}
      </Text>
    </Badge>
  );

  const previousComparisonHint = previousPeriodLabel
    ? "Compared to previous window"
    : null;

  const metricCards = [
    {
      label: "Annual Revenue",
      badge: primaryPeriodLabel || "Current window",
      badgeColorScheme: "blue",
      badgeIcon: FiCalendar,
      value: revenueValueDisplay,
      delta: revenueDeltaLabel,
      deltaType: revenueDeltaType,
      icon: FiTrendingUp,
      subtitle: revenueSubtitle,
      description: `Gross collections in ${resolvedCurrency}.`,
      deltaCaption: previousComparisonHint,
      meta: (
        <HStack spacing={2} flexWrap="wrap">
          {makeInfoBadge("Paid bookings", FiCreditCard, "blue")}
          {resolvedCurrency
            ? makeInfoBadge(resolvedCurrency, FiDollarSign, "gray")
            : null}
        </HStack>
      ),
      tooltip: `Total confirmed rental revenue in ${resolvedCurrency} for the selected window.`,
      footer: "Includes confirmed payments only.",
      accent: "blue",
    },
    {
      label: "Bookings YTD",
      badge: primaryPeriodLabel || "Current window",
      badgeColorScheme: "purple",
      badgeIcon: FiCheckCircle,
      value: bookingsValueDisplay,
      delta: bookingsDeltaLabel,
      deltaType: bookingsDeltaType,
      icon: FiCalendar,
      subtitle: bookingsSubtitle,
      description: "Completed and live trips across the selected companies.",
      deltaCaption: previousComparisonHint,
      meta: (
        <HStack spacing={2} flexWrap="wrap">
          {makeInfoBadge("Live & completed", FiCheckCircle, "purple")}
          {makeInfoBadge("Tenant-wide scope", FiUser, "gray")}
        </HStack>
      ),
      tooltip:
        "Count of confirmed bookings captured year-to-date for your active company.",
      footer: "Includes live and completed booking statuses.",
      accent: "purple",
    },
    {
      label: "Avg Booking Value",
      badge: primaryPeriodLabel || "Current window",
      badgeColorScheme: "green",
      badgeIcon: FiCreditCard,
      value: averageBookingValueDisplay,
      delta: averageBookingValueDeltaLabel,
      deltaType: averageValueDeltaType,
      icon: FiCreditCard,
      subtitle: averageBookingValueSubtitle,
      description: `Average revenue per completed booking in ${resolvedCurrency}.`,
      deltaCaption: previousComparisonHint,
      meta: (
        <HStack spacing={2} flexWrap="wrap">
          {makeInfoBadge("Net of discounts", FiCreditCard, "green")}
          {resolvedCurrency
            ? makeInfoBadge(resolvedCurrency, FiDollarSign, "gray")
            : null}
        </HStack>
      ),
      tooltip: `Average amount collected per completed booking in ${resolvedCurrency}.`,
      footer: "Net of discounts and adjustments.",
      accent: "mint",
    },
    {
      label: "Fleet Utilization",
      badge: utilizationAsOfLabel ? `As of ${utilizationAsOfLabel}` : "Live snapshot",
      badgeColorScheme: "orange",
      badgeIcon: FiClock,
      value: fleetPercentDisplay,
      delta: utilizationDeltaLabel,
      deltaType: utilizationDeltaType,
      icon: BsSpeedometer2,
      subtitle: utilizationSubtitle,
      tooltip: utilizationAsOfLabel
        ? `Share of units on rent as of ${utilizationAsOfLabel}.`
        : "Share of units currently on rent compared with your total fleet size.",
      customContent: (
        <Flex align="center" gap={4}>
          <CircularProgress
            value={fleetPercentValue}
            size="76px"
            thickness="10px"
            color="orange.400"
            trackColor="orange.100"
            isIndeterminate={fleetPercent == null && isUtilizationLoading}
          >
            {fleetPercent != null ? (
              <CircularProgressLabel>
                <Text fontWeight="bold" color="gray.800">
                  {fleetPercent}%
                </Text>
              </CircularProgressLabel>
            ) : null}
          </CircularProgress>
          <Stack spacing={2}>
            <Heading size="md" color="gray.900">
              {fleetPercent != null
                ? `${fleetPercent}% utilized`
                : isUtilizationLoading
                ? "Loading utilisation..."
                : "Utilisation unavailable"}
            </Heading>
            <Text fontSize="sm" color="gray.600">
              {activeRentals != null && totalFleet != null
                ? `${activeRentals} active of ${totalFleet} vehicles right now.`
                : "Active rentals vs. total inventory right now."}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {utilizationNarrative}
            </Text>
            {utilizationDeltaLabel ? (
              <Badge
                px={2}
                py={0.5}
                borderRadius="full"
                variant="subtle"
                colorScheme={
                  utilizationDeltaType === "increase"
                    ? "green"
                    : utilizationDeltaType === "decrease"
                    ? "red"
                    : "gray"
                }
                display="inline-flex"
                alignItems="center"
                gap={1}
                textTransform="none"
              >
                <Icon
                  as={
                    utilizationDeltaType === "increase"
                      ? FiTrendingUp
                      : utilizationDeltaType === "decrease"
                      ? FiTrendingDown
                      : FiActivity
                  }
                  boxSize="10px"
                />
                <Text fontSize="xs" fontWeight="semibold" color="gray.700">
                  {utilizationDeltaLabel}
                </Text>
                {utilizationPreviousPeriodLabel ? (
                  <Text fontSize="xs" color="gray.600">
                    {`vs ${utilizationPreviousPeriodLabel}`}
                  </Text>
                ) : null}
              </Badge>
            ) : null}
            {utilizationError && !isUtilizationLoading ? (
              <Text fontSize="xs" color="red.500">
                {utilizationError}
              </Text>
            ) : null}
            {!utilizationError && (
              <Text fontSize="xs" color="gray.500">
                Includes live bookings and excludes units marked unavailable.
              </Text>
            )}
          </Stack>
        </Flex>
      ),
      meta: (
        <HStack spacing={2} flexWrap="wrap">
          {activeRentals != null
            ? makeInfoBadge(
                `${numberFormatter.format(activeRentals)} active`,
                FiActivity,
                "orange"
              )
            : null}
          {availableUnits != null
            ? makeInfoBadge(
                `${numberFormatter.format(availableUnits)} available`,
                FiCheckCircle,
                "green"
              )
            : null}
          {unavailableUnits != null
            ? makeInfoBadge(
                `${numberFormatter.format(unavailableUnits)} unavailable`,
                FiAlertTriangle,
                "red"
              )
            : null}
        </HStack>
      ),
      footer: (
        <Flex
          align="center"
          justify="space-between"
          fontSize="xs"
          color="gray.500"
        >
          <HStack spacing={1.5}>
            <Icon as={FiClock} boxSize="12px" />
            <Text fontWeight="medium">
              {utilizationAsOfLabel
                ? `As of ${utilizationAsOfLabel}`
                : "Live snapshot"}
            </Text>
          </HStack>
          {availableUnits != null || unavailableUnits != null ? (
            <Text>
              {availableUnits != null
                ? `${availableUnits} available`
                : "-- available"}
              {" | "}
              {unavailableUnits != null
                ? `${unavailableUnits} unavailable`
                : "-- unavailable"}
            </Text>
          ) : (
            <Text>Inventory insight</Text>
          )}
        </Flex>
      ),
      onDoubleClick: utilizationData ? onUtilizationModalOpen : undefined,
      accent: "amber",
    },
  ];

  const heroCardSkeletonAccents = ["blue", "purple", "mint", "amber"];
  const isHeroCardsLoading = isSummaryLoading && !summaryData;

  return (
    <Box
      bg="gray.50"
      minH="100%"
      px={{ base: 4, md: 6, xl: 8 }}
      py={{ base: 6, md: 8 }}
    >
      <Stack spacing={8}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          gap={4}
        >
          <Stack spacing={2}>
            <Heading size="lg" color="gray.800">
              Sales Performance
            </Heading>
            <HStack spacing={3}>
              <Tag size="sm" colorScheme="blue" borderRadius="full">
                Live overview
              </Tag>
              <Text fontSize="sm" color="gray.500">
                Track how your fleet is earning for {selectedRangeLabel}.
              </Text>
            </HStack>
            {resolvedRangeLabel ? (
              <Text fontSize="xs" color="gray.400">
                Data window: {resolvedRangeLabel}
              </Text>
            ) : null}
          </Stack>

          <HStack spacing={3}>
            <Menu>
              <MenuButton
                as={Button}
                variant="outline"
                rightIcon={<FiChevronDown />}
                size="sm"
              >
                {selectedRangeLabel}
              </MenuButton>
              <MenuList>
                {DATE_RANGE_PRESETS.map((preset) => (
                  <MenuItem
                    key={preset.value}
                    onClick={() => handlePresetSelect(preset.value)}
                    fontWeight={
                      datePreset === preset.value ? "semibold" : "normal"
                    }
                  >
                    {preset.label}
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={handleCustomRangeMenuClick}
                  fontWeight={datePreset === "custom" ? "semibold" : "normal"}
                >
                  Custom range...
                </MenuItem>
              </MenuList>
            </Menu>
            <Button leftIcon={<FiDownload />} colorScheme="blue" size="sm">
              Export report
            </Button>
          </HStack>
        </Flex>

        {summaryError ? (
          <Alert status="error" variant="subtle" borderRadius="lg">
            <AlertIcon />
            {summaryError}
          </Alert>
        ) : null}

        <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} spacing={5}>
          {isHeroCardsLoading
            ? heroCardSkeletonAccents.map((accent, index) => (
                <StatCardSkeleton
                  key={`stat-card-skeleton-${accent}-${index}`}
                  accent={accent}
                />
              ))
            : metricCards.map((card) => (
                <StatCard key={card.label} {...card} />
              ))}
        </SimpleGrid>

        <Grid
          templateColumns={{ base: "1fr", xl: "2fr 1fr" }}
          gap={5}
          alignItems="stretch"
        >
          <GridItem>
            <Box
              bg="white"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="gray.100"
              boxShadow="sm"
              p={{ base: 4, md: 6 }}
            >
              <Stack spacing={6}>
                <Flex
                  direction={{ base: "column", md: "row" }}
                  justify="space-between"
                  align={{ base: "flex-start", md: "center" }}
                  gap={4}
                  flexWrap="wrap"
                >
                  <Stack spacing={1}>
                    <HStack spacing={2} color="gray.500">
                      <Icon as={FiBarChart2} />
                      <Text fontSize="sm" fontWeight="medium">
                        Revenue trend
                      </Text>
                    </HStack>
                    <Heading size="md" color="gray.800">
                      Monthly sales
                    </Heading>
                  </Stack>

                  <HStack spacing={3} flexWrap="wrap">
                    <Tag
                      size="sm"
                      variant="subtle"
                      colorScheme={isMonthlySalesLoading ? "gray" : "blue"}
                    >
                      {isMonthlySalesLoading
                        ? "Refreshing..."
                        : monthlySalesRange?.mode === "single_year"
                        ? `Year ${
                            currentComparisonLabel || new Date().getFullYear()
                          }`
                        : monthlySalesRange?.mode === "range"
                        ? formatPeriodRange(monthlySalesRange) || "Custom range"
                        : currentComparisonLabel
                        ? `Window: ${currentComparisonLabel}`
                        : "Last 12 months"}
                    </Tag>
                    <ButtonGroup size="sm" isAttached variant="ghost">
                      <Tooltip label="Line chart view" hasArrow>
                        <IconButton
                          aria-label="Line chart view"
                          icon={<FiActivity />}
                          variant={chartType === "area" ? "solid" : "ghost"}
                          colorScheme="blue"
                          onClick={() => setChartType("area")}
                        />
                      </Tooltip>
                      <Tooltip label="Bar chart view" hasArrow>
                        <IconButton
                          aria-label="Bar chart view"
                          icon={<FiBarChart2 />}
                          variant={chartType === "bar" ? "solid" : "ghost"}
                          colorScheme="blue"
                          onClick={() => setChartType("bar")}
                        />
                      </Tooltip>
                    </ButtonGroup>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<FiRefreshCw />}
                      onClick={onComparisonOpen}
                      isDisabled={!comparisonData.length}
                    >
                      Compare years
                    </Button>
                  </HStack>
                </Flex>

                {monthlySalesError ? (
                  <Alert status="error" variant="left-accent" borderRadius="md">
                    <AlertIcon />
                    {monthlySalesError}
                  </Alert>
                ) : null}

                <Box minH={{ base: "320px", md: "360px" }}>
                  <RevenueChart
                    data={salesChartData}
                    chartType={chartType}
                    currencyFormatter={monthlyCurrencyFormatter}
                    compactCurrencyFormatter={monthlyCompactCurrencyFormatter}
                    tooltipContent={(props) => (
                      <RevenueTooltip
                        {...props}
                        currencyFormatter={monthlyCurrencyFormatter}
                      />
                    )}
                  />
                </Box>

                {highlightsError ? (
                  <Alert
                    status="warning"
                    variant="left-accent"
                    borderRadius="md"
                  >
                    <AlertIcon />
                    {highlightsError}
                  </Alert>
                ) : null}

                <SimpleGrid
                  columns={{ base: 1, md: 2, xl: 3 }}
                  spacing={4}
                  mt={6}
                >
                  {isHighlightsLoading && !highlights ? (
                    <>
                      <HighlightStatCardSkeleton accent="blue" />
                      <HighlightStatCardSkeleton accent="purple" />
                      <HighlightStatCardSkeleton accent="amber" />
                    </>
                  ) : (
                    <>
                      <HighlightStatCard
                        title="Total sales this month"
                        value={highlightsSalesValueLabel}
                        subtitle={highlightsSalesSubtitle}
                        icon={FiTrendingUp}
                        meta={
                          <Tag
                            size="sm"
                            colorScheme="blue"
                            borderRadius="full"
                            variant="subtle"
                          >
                            {highlightsSalesBookingsLabel}
                          </Tag>
                        }
                        footer={highlightsSalesFooter}
                      />
                      <HighlightStatCard
                        title="Cars available"
                        value={highlightsAvailableValue}
                        subtitle={highlightsAvailabilitySubtitle}
                        icon={TbSteeringWheel}
                        accent="purple"
                        meta={highlightsAvailabilityMeta}
                        footer={highlightsAvailabilityFooter}
                      />
                      <HighlightStatCard
                        title="Month availability"
                        value={highlightsDaysValue}
                        subtitle={highlightsDaysSubtitle}
                        icon={FiClock}
                        accent="amber"
                        meta={highlightsDaysMeta}
                        footer={highlightsDaysFooter}
                      />
                    </>
                  )}
                </SimpleGrid>
              </Stack>
            </Box>
          </GridItem>

          <GridItem>
            <Stack spacing={5} h="100%">
              <Box
                bg="white"
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.100"
                boxShadow="sm"
                p={{ base: 4, md: 5 }}
              >
                <Stack spacing={4}>
                  <Stack spacing={1}>
                    <HStack spacing={2} color="gray.500">
                      <Icon as={BsSpeedometer2} />
                      <Text fontSize="sm" fontWeight="medium">
                        Fleet mix
                      </Text>
                    </HStack>
                    <Heading size="sm" color="gray.800">
                      Revenue by vehicle class
                    </Heading>
                  </Stack>
                  {revenueByClassError ? (
                    <Alert
                      status="error"
                      variant="left-accent"
                      borderRadius="md"
                    >
                      <AlertIcon />
                      {revenueByClassError}
                    </Alert>
                  ) : isRevenueByClassLoading ? (
                    <RevenueByClassSkeleton />
                  ) : (
                    <RevenueByClass
                      data={revenueByClass}
                      currencyFormatter={revenueByClassCurrencyFormatter}
                    />
                  )}
                </Stack>
              </Box>

              <Box
                bg="white"
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.100"
                boxShadow="sm"
                p={{ base: 4, md: 5 }}
              >
                <Stack spacing={5}>
                  <Stack spacing={1}>
                    <HStack spacing={2} color="gray.500">
                      <Icon as={FiActivity} />
                      <Text fontSize="sm" fontWeight="medium">
                        Utilization pulse
                      </Text>
                    </HStack>
                    <Heading size="sm" color="gray.800">
                      Live occupancy snapshot
                    </Heading>
                  </Stack>

                  {utilizationError && !isUtilizationLoading ? (
                    <Alert
                      status="warning"
                      variant="left-accent"
                      borderRadius="md"
                    >
                      <AlertIcon />
                      {utilizationError}
                    </Alert>
                  ) : null}

                  <Box
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="rgba(37, 99, 235, 0.15)"
                    bgGradient="linear(to-br, rgba(37, 99, 235, 0.15), rgba(59, 130, 246, 0.05))"
                    p={5}
                  >
                    <Flex
                      direction={{ base: "column", sm: "row" }}
                      justify="space-between"
                      align={{ base: "flex-start", sm: "center" }}
                      gap={6}
                    >
                      <Stack spacing={2}>
                        <Text
                          fontSize="sm"
                          color="blue.700"
                          fontWeight="medium"
                        >
                          Vehicles in use
                        </Text>
                        <Heading size="lg" color="blue.900">
                          {activeRentals != null && totalFleet != null
                            ? `${activeRentals} / ${totalFleet}`
                            : isUtilizationLoading
                            ? "Loading..."
                            : "--"}
                        </Heading>
                        <Text fontSize="xs" color="blue.700">
                          {utilizationAsOfLabel
                            ? `Snapshot as of ${utilizationAsOfLabel}`
                            : "Live utilisation snapshot"}
                        </Text>
                      </Stack>
                      <CircularProgress
                        value={fleetPercentValue}
                        size="110px"
                        thickness="10px"
                        color="blue.500"
                        trackColor="rgba(37, 99, 235, 0.15)"
                        capIsRound
                      >
                        <CircularProgressLabel>
                          <Text fontWeight="bold" color="blue.600">
                            {fleetPercent != null
                              ? `${fleetPercent}%`
                              : isUtilizationLoading
                              ? "..."
                              : fleetPercentDisplay}
                          </Text>
                        </CircularProgressLabel>
                      </CircularProgress>
                    </Flex>
                  </Box>

                  <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
                    <Box
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor="rgba(37, 99, 235, 0.18)"
                      bg="rgba(37, 99, 235, 0.08)"
                      p={3}
                    >
                      <Text
                        fontSize="xs"
                        color="blue.700"
                        fontWeight="semibold"
                      >
                        Active rentals
                      </Text>
                      <Heading size="md" color="blue.900">
                        {activeRentals != null
                          ? numberFormatter.format(activeRentals)
                          : "--"}
                      </Heading>
                    </Box>
                    <Box
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor="rgba(34, 197, 94, 0.2)"
                      bg="rgba(134, 239, 172, 0.15)"
                      p={3}
                    >
                      <Text
                        fontSize="xs"
                        color="green.700"
                        fontWeight="semibold"
                      >
                        Available
                      </Text>
                      <Heading size="md" color="green.800">
                        {availableUnits != null
                          ? numberFormatter.format(availableUnits)
                          : "--"}
                      </Heading>
                    </Box>
                    <Box
                      borderRadius="lg"
                      borderWidth="1px"
                      borderColor="rgba(248, 113, 113, 0.2)"
                      bg="rgba(248, 113, 113, 0.12)"
                      p={3}
                    >
                      <Text fontSize="xs" color="red.600" fontWeight="semibold">
                        Unavailable
                      </Text>
                      <Heading size="md" color="red.700">
                        {unavailableUnits != null
                          ? numberFormatter.format(unavailableUnits)
                          : "--"}
                      </Heading>
                    </Box>
                  </SimpleGrid>

                  <Box
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor="rgba(15, 23, 42, 0.08)"
                    bg="rgba(15, 23, 42, 0.02)"
                    p={3}
                  >
                    <HStack spacing={3} align="flex-start">
                      <Box
                        boxSize="8px"
                        borderRadius="full"
                        bg="blue.500"
                        mt={2}
                      />
                      <Text
                        fontSize="xs"
                        color={
                          utilizationError && !isUtilizationLoading
                            ? "red.500"
                            : "gray.600"
                        }
                      >
                        {utilizationError && !isUtilizationLoading
                          ? utilizationError
                          : utilizationNarrative}
                      </Text>
                    </HStack>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </GridItem>
        </Grid>

        <Grid templateColumns={{ base: "1fr", xl: "4fr 2fr" }} gap={5}>
          <GridItem>
            <Box
              bg="white"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="gray.100"
              boxShadow="sm"
              p={{ base: 4, md: 5 }}
              h="100%"
            >
              <UpcomingBookingsSection
                items={upcomingBookingItems}
                isLoading={isUpcomingBookingsLoading}
                error={upcomingBookingsError}
                windowLabel={upcomingWindowLabel}
                totals={upcomingTotals}
                generatedAtLabel={upcomingGeneratedAtLabel}
              />
            </Box>
          </GridItem>

          <GridItem>
            <Stack spacing={5} h="100%">
              <Box
                bg="white"
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.100"
                boxShadow="sm"
                p={{ base: 4, md: 5 }}
              >
                <TopPerformersSection
                  items={topPerformersItems}
                  isLoading={isTopPerformersLoading}
                  error={topPerformersError}
                  metricLabel={topPerformersMetricLabel}
                  rangeLabel={topPerformersRangeLabel}
                  totalsRevenueLabel={topPerformersTotalsRevenueLabel}
                  shareLabel={topPerformersShareLabel}
                  currency={topPerformersMeta?.currency}
                />
              </Box>

              <Box
                bg="white"
                borderRadius="xl"
                borderWidth="1px"
                borderColor="gray.100"
                boxShadow="sm"
                p={{ base: 4, md: 5 }}
              >
                <Stack spacing={4}>
                  <Stack spacing={1}>
                    <HStack spacing={2} color="gray.500">
                      <Icon as={FiClock} />
                      <Text fontSize="sm" fontWeight="medium">
                        Control center
                      </Text>
                    </HStack>
                    <Heading size="sm" color="gray.800">
                      Recent activity
                    </Heading>
                  </Stack>
                  <ActivityTimeline items={activityTimelineData} />
                </Stack>
              </Box>
            </Stack>
          </GridItem>
        </Grid>

        <Modal
          isOpen={isCustomRangeOpen}
          onClose={handleCancelCustomRange}
          size="sm"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select custom range</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>Start date</FormLabel>
                  <Input
                    type="date"
                    value={customRangeDraft.start}
                    onChange={handleCustomRangeDraftChange("start")}
                    max={customRangeDraft.end || undefined}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>End date</FormLabel>
                  <Input
                    type="date"
                    value={customRangeDraft.end}
                    onChange={handleCustomRangeDraftChange("end")}
                    min={customRangeDraft.start || undefined}
                  />
                </FormControl>
                {showCustomRangeError ? (
                  <Text fontSize="sm" color="red.500">
                    Start date must be on or before end date.
                  </Text>
                ) : null}
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={handleCancelCustomRange}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleApplyCustomRange}
                isDisabled={!isCustomRangeReady}
              >
                Apply
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isUtilizationModalOpen}
          onClose={onUtilizationModalClose}
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Fleet utilisation details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={4}>
                <Stack spacing={1}>
                  <Heading size="sm" color="gray.800">
                    Snapshot
                  </Heading>
                  <Text fontSize="sm" color="gray.500">
                    {utilizationAsOfLabel
                      ? `As of ${utilizationAsOfLabel}`
                      : "Latest captured snapshot."}
                  </Text>
                </Stack>

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                  <Box borderWidth="1px" borderRadius="lg" p={3} bg="gray.50">
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      color="gray.500"
                      fontWeight="semibold"
                    >
                      Active rentals
                    </Text>
                    <Heading size="md" color="gray.800">
                      {activeRentals != null ? activeRentals : "--"}
                    </Heading>
                  </Box>
                  <Box borderWidth="1px" borderRadius="lg" p={3} bg="gray.50">
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      color="gray.500"
                      fontWeight="semibold"
                    >
                      Total fleet
                    </Text>
                    <Heading size="md" color="gray.800">
                      {totalFleet != null ? totalFleet : "--"}
                    </Heading>
                  </Box>
                  <Box borderWidth="1px" borderRadius="lg" p={3} bg="gray.50">
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      color="gray.500"
                      fontWeight="semibold"
                    >
                      Available now
                    </Text>
                    <Heading size="md" color="gray.800">
                      {availableUnits != null ? availableUnits : "--"}
                    </Heading>
                  </Box>
                  <Box borderWidth="1px" borderRadius="lg" p={3} bg="gray.50">
                    <Text
                      fontSize="xs"
                      textTransform="uppercase"
                      color="gray.500"
                      fontWeight="semibold"
                    >
                      Unavailable
                    </Text>
                    <Heading size="md" color="gray.800">
                      {unavailableUnits != null ? unavailableUnits : "--"}
                    </Heading>
                  </Box>
                </SimpleGrid>

                {Array.isArray(utilizationData?.breakdown) &&
                utilizationData.breakdown.length > 0 ? (
                  <Stack spacing={2}>
                    <Heading
                      size="xs"
                      color="gray.700"
                      textTransform="uppercase"
                    >
                      By vehicle type
                    </Heading>
                    <Stack spacing={2}>
                      {utilizationData.breakdown.map((item, index) => {
                        const key = `${item?.label || "unspecified"}-${index}`;
                        const rate = safeNumber(item?.utilization);
                        const percent =
                          rate != null
                            ? `${Math.round(
                                Math.min(Math.max(rate, 0), 1) * 100
                              )}%`
                            : "--";
                        return (
                          <Flex
                            key={key}
                            align="center"
                            justify="space-between"
                            borderWidth="1px"
                            borderRadius="md"
                            p={3}
                          >
                            <Stack spacing={0}>
                              <Text fontWeight="semibold" color="gray.800">
                                {item?.label || "Unspecified"}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {item?.active ?? "--"} active /{" "}
                                {item?.fleet ?? "--"} total
                              </Text>
                            </Stack>
                            <Tag
                              variant="subtle"
                              colorScheme="orange"
                              borderRadius="full"
                            >
                              {percent}
                            </Tag>
                          </Flex>
                        );
                      })}
                    </Stack>
                  </Stack>
                ) : (
                  <Text fontSize="sm" color="gray.500">
                    No utilisation breakdown is available for this snapshot.
                  </Text>
                )}
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onUtilizationModalClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <YearComparisonModal
          isOpen={isComparisonOpen}
          onClose={onComparisonClose}
          data={comparisonData}
          summary={comparisonSummary}
          currencyFormatter={monthlyCurrencyFormatter}
          compactCurrencyFormatter={monthlyCompactCurrencyFormatter}
          currentLabel={currentComparisonLabel}
          previousLabel={previousComparisonLabel}
        />
      </Stack>
    </Box>
  );
};

export default Dashboard;






