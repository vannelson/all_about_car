import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Avatar,
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
  TagLabel,
  Text,
  Input,
  Tooltip,
  useDisclosure,
  CircularProgress,
  CircularProgressLabel,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import {
  FiActivity,
  FiBarChart2,
  FiCheckCircle,
  FiCalendar,
  FiAlertTriangle,
  FiArrowRight,
  FiDollarSign,
  FiChevronDown,
  FiClock,
  FiCreditCard,
  FiDownload,
  FiInfo,
  FiMapPin,
  FiTrendingDown,
  FiTrendingUp,
  FiUser,
  FiRefreshCw,
} from "react-icons/fi";
import { BsSpeedometer2 } from "react-icons/bs";
import { TbSteeringWheel } from "react-icons/tb";
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
import { format, parseISO } from "date-fns";
import { fetchDashboardSummary } from "../../services/dashboard";
import { fetchDashboardHighlights } from "../../services/highlights";
import { fetchFleetUtilization } from "../../services/fleetUtilization";
import { fetchMonthlySales } from "../../services/monthlySales";
import { fetchRevenueByClass } from "../../services/revenueByClass";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const compactCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-US");

const DEFAULT_CURRENT_YEAR = new Date().getFullYear();
const CURRENT_YEAR = DEFAULT_CURRENT_YEAR;
const PREVIOUS_YEAR = CURRENT_YEAR - 1;

function safeNumber(value) {
  if (value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatPeriodRange(period) {
  if (!period?.start || !period?.end) return null;
  try {
    const startLabel = format(parseISO(period.start), "MMM d");
    const endLabel = format(parseISO(period.end), "MMM d, yyyy");
    return `${startLabel} - ${endLabel}`;
  } catch {
    return null;
  }
}

function resolveMonthLabel(item) {
  if (!item) return "";
  if (item.label) return item.label;
  if (item.month) {
    try {
      return format(parseISO(item.month), "MMM");
    } catch {
      return "";
    }
  }
  return "";
}

function resolveSeriesYearLabel(series) {
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

const topUnitsData = [
  {
    name: "Range Rover Sport SE",
    plate: "NDX-9182",
    revenue: 12800,
    occupancy: 94,
  },
  {
    name: "Toyota Alphard Executive",
    plate: "TRV-4221",
    revenue: 11250,
    occupancy: 88,
  },
  {
    name: "BMW 530e Hybrid",
    plate: "LUX-1403",
    revenue: 9850,
    occupancy: 86,
  },
  {
    name: "Ford Expedition Max",
    plate: "VAN-9320",
    revenue: 9420,
    occupancy: 82,
  },
];

const upcomingBookingsData = [
  {
    id: "BK-2389",
    guest: "Alyssa Cortez",
    date: "Oct 14, 10:30 AM",
    unit: "Range Rover Sport SE",
    status: "Confirmed",
    value: 780,
    pickup: "HQ Garage, Makati",
  },
  {
    id: "BK-2390",
    guest: "Luis Ramirez",
    date: "Oct 15, 8:00 AM",
    unit: "BMW 530e Hybrid",
    status: "Pending",
    value: 540,
    pickup: "Airport Terminal 3",
  },
  {
    id: "BK-2391",
    guest: "Jenna Young",
    date: "Oct 16, 6:45 AM",
    unit: "Toyota Alphard Executive",
    status: "Confirmed",
    value: 690,
    pickup: "HQ Garage, Makati",
  },
  {
    id: "BK-2392",
    guest: "Eliot Navarro",
    date: "Oct 16, 3:00 PM",
    unit: "Ford Expedition Max",
    status: "Maintenance",
    value: 0,
    pickup: "Service Bay 4",
  },
];

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

const DATE_RANGE_PRESETS = [
  { value: "last_30_days", label: "Last 30 days" },
  { value: "quarter_to_date", label: "Quarter to date" },
  { value: "year_to_date", label: "Year to date" },
];

const DEFAULT_DATE_PRESET = "year_to_date";

const chartGradientId = "tenant-dashboard-revenue-gradient";

const statusColorMap = {
  Confirmed: "green",
  Pending: "yellow",
  Maintenance: "purple",
};

const deltaColorMap = {
  increase: "green.500",
  decrease: "red.500",
  neutral: "gray.500",
};

const activityAccentMap = {
  success: {
    icon: FiCheckCircle,
    color: "green.600",
    bg: "rgba(34, 197, 94, 0.1)",
    border: "rgba(34, 197, 94, 0.24)",
  },
  warning: {
    icon: FiAlertTriangle,
    color: "orange.600",
    bg: "rgba(249, 115, 22, 0.1)",
    border: "rgba(249, 115, 22, 0.24)",
  },
  info: {
    icon: FiInfo,
    color: "blue.600",
    bg: "rgba(59, 130, 246, 0.08)",
    border: "rgba(59, 130, 246, 0.2)",
  },
};

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

function StatCardSkeleton({ accent = "blue" }) {
  const baseAccent =
    typeof accent === "string"
      ? cardAccentMap[accent] ?? cardAccentMap.blue
      : cardAccentMap.blue;
  const accentStyles =
    typeof accent === "object" ? { ...baseAccent, ...accent } : baseAccent;
  const overlayLayer =
    accentStyles.overlay ||
    accentStyles.gradient ||
    "linear-gradient(135deg, rgba(248,250,252,0.95), rgba(226,232,240,0.85))";
  const patternLayer = accentStyles.pattern
    ? accentStyles.pattern
    : accentStyles.spot
    ? `radial-gradient(circle at 90% 25%, ${accentStyles.spot} 0%, rgba(255,255,255,0) 60%)`
    : null;
  const backgroundLayers = [overlayLayer, patternLayer].filter(Boolean);
  const backgroundImage = backgroundLayers.join(", ");
  const overlayRepeat = "no-repeat";
  const patternRepeat = accentStyles.patternRepeat || "no-repeat";
  const backgroundRepeat =
    backgroundLayers.length > 1
      ? `${overlayRepeat}, ${patternRepeat}`
      : overlayRepeat;
  const backgroundSize =
    backgroundLayers.length > 1
      ? `100% 100%, ${accentStyles.patternSize || "160% 160%"}`
      : "100% 100%";
  const backgroundPosition =
    backgroundLayers.length > 1
      ? `center, ${accentStyles.patternPosition || "120% 60%"}`
      : "center";

  return (
    <Box
      position="relative"
      bg="white"
      borderRadius="xl"
      p={{ base: 4, md: 5 }}
      minH="170px"
      borderWidth="1px"
      borderColor={accentStyles.border}
      boxShadow="sm"
      backgroundImage={backgroundImage}
      backgroundRepeat={backgroundRepeat}
      backgroundSize={backgroundSize}
      backgroundPosition={backgroundPosition}
      overflow="hidden"
    >
      <Stack spacing={3}>
        <Flex align="flex-start" justify="space-between" gap={3}>
          <Stack spacing={2.5} flex="1">
            <Skeleton height="16px" width="36%" borderRadius="full" />
            <Skeleton height="12px" width="45%" />
            <Skeleton height="28px" width="65%" />
            <Skeleton height="10px" width="55%" />
          </Stack>
          <Skeleton boxSize="44px" borderRadius="full" />
        </Flex>
        <Stack spacing={2}>
          <Skeleton height="10px" width="70%" />
          <Skeleton height="10px" width="55%" />
          <Skeleton height="10px" width="60%" />
          <Skeleton height="10px" width="45%" />
        </Stack>
      </Stack>
    </Box>
  );
}

function RevenueChart({
  data,
  chartType,
  currencyFormatter: fmt,
  compactCurrencyFormatter,
}) {
  const formatter = fmt || currencyFormatter;
  const axisFormatter = compactCurrencyFormatter || formatter;
  const renderTooltip = useCallback(
    (props) => <RevenueTooltip {...props} currencyFormatter={formatter} />,
    [formatter]
  );
  const formatTick = useCallback(
    (value) => (axisFormatter ? axisFormatter.format(value) : value),
    [axisFormatter]
  );

  if (!data?.length) {
    return (
      <Flex
        align="center"
        justify="center"
        h="240px"
        borderRadius="xl"
        bg="gray.50"
        color="gray.500"
      >
        <Text fontSize="sm">No sales data available</Text>
      </Flex>
    );
  }

  return (
    <Box h={{ base: "240px", md: "260px" }}>
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "bar" ? (
          <BarChart
            data={data}
            margin={{ top: 20, right: 24, left: 0, bottom: 0 }}
            barSize={24}
          >
            <CartesianGrid
              strokeDasharray="4 6"
              stroke="#e5e7eb"
              strokeOpacity={0.7}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 600 }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={56}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={formatTick}
            />
            <RechartsTooltip
              cursor={{
                fill: "rgba(37, 99, 235, 0.08)",
              }}
              content={renderTooltip}
            />
            <Bar
              dataKey="total"
              radius={[12, 12, 0, 0]}
              fill="#2563eb"
              opacity={0.9}
            />
          </BarChart>
        ) : (
          <AreaChart
            data={data}
            margin={{ top: 20, right: 24, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={chartGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 6"
              stroke="#e5e7eb"
              strokeOpacity={0.7}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 600 }}
              dy={6}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={56}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={formatTick}
            />
            <RechartsTooltip
              cursor={{
                stroke: "#2563eb",
                strokeWidth: 1,
                strokeDasharray: "6 6",
              }}
              content={renderTooltip}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#2563eb"
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#${chartGradientId})`}
              dot={{ r: 4, stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
}

function YearComparisonTooltip({
  active,
  payload,
  label,
  currencyFormatter: fmt,
  currentLabel,
  previousLabel,
}) {
  if (!active || !payload?.length) return null;
  const current = payload.find((p) => p.dataKey === "currentYear");
  const previous = payload.find((p) => p.dataKey === "previousYear");
  const formatter = fmt || currencyFormatter;
  const currentText = currentLabel || `${CURRENT_YEAR}`;
  const previousText = previousLabel || `${PREVIOUS_YEAR}`;

  return (
    <Stack
      spacing={2}
      px={3}
      py={2}
      bg="white"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.100"
      boxShadow="lg"
      minW="180px"
    >
      <Text fontWeight="semibold" color="gray.800">
        {label}
      </Text>
      <HStack justify="space-between" fontSize="sm">
        <Text color="gray.500">{currentText}</Text>
        <Text fontWeight="semibold" color="blue.600">
          {formatter.format(current?.value ?? 0)}
        </Text>
      </HStack>
      <HStack justify="space-between" fontSize="sm">
        <Text color="gray.500">{previousText}</Text>
        <Text fontWeight="semibold" color="gray.600">
          {formatter.format(previous?.value ?? 0)}
        </Text>
      </HStack>
    </Stack>
  );
}

function YearComparisonModal({
  isOpen,
  onClose,
  data,
  summary,
  currencyFormatter: fmt,
  compactCurrencyFormatter: compactFmt,
  currentLabel,
  previousLabel,
}) {
  const revenueDeltaColor = summary.revenueDelta >= 0 ? "green.500" : "red.500";
  const bookingDeltaColor = summary.bookingDelta >= 0 ? "green.500" : "red.500";
  const formatter = fmt || currencyFormatter;
  const axisFormatter = compactFmt || formatter;
  const currentText = currentLabel || `${CURRENT_YEAR}`;
  const previousText = previousLabel || `${PREVIOUS_YEAR}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="2xl" overflow="hidden">
        <ModalHeader bg="gray.900" color="white" py={4}>
          <Stack spacing={1}>
            <Text fontSize="xs" textTransform="uppercase" opacity={0.7}>
              Year-over-year insights
            </Text>
            <Heading size="md" color="white">
              {currentText} vs {previousText}
            </Heading>
          </Stack>
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody bg="gray.50" py={6}>
          <Stack spacing={6}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <ComparisonStatCard
                label={`${currentText} revenue`}
                value={formatter.format(summary.currentRevenue)}
                sublabel="Bookings"
                subvalue={numberFormatter.format(summary.currentBookings)}
                accent="blue"
              />
              <ComparisonStatCard
                label="Revenue change"
                value={`${
                  summary.revenueDelta >= 0 ? "+" : ""
                }${summary.revenueDelta.toFixed(1)}%`}
                sublabel={`${previousText} revenue`}
                subvalue={formatter.format(summary.previousRevenue)}
                accent={summary.revenueDelta >= 0 ? "green" : "red"}
                valueColor={revenueDeltaColor}
              />
              <ComparisonStatCard
                label="Bookings change"
                value={`${
                  summary.bookingDelta >= 0 ? "+" : ""
                }${summary.bookingDelta.toFixed(1)}%`}
                sublabel={`${previousText} bookings`}
                subvalue={numberFormatter.format(summary.previousBookings)}
                accent={summary.bookingDelta >= 0 ? "green" : "red"}
                valueColor={bookingDeltaColor}
              />
            </SimpleGrid>

            <Box
              bg="white"
              borderRadius="xl"
              borderWidth="1px"
              p={4}
              boxShadow="sm"
            >
              <Heading size="sm" color="gray.700" mb={4}>
                Month-by-month trend
              </Heading>
              <Box h={{ base: "220px", md: "260px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data}
                    margin={{ top: 10, right: 24, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="4 6"
                      stroke="#e5e7eb"
                      strokeOpacity={0.7}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 600 }}
                      dy={6}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      width={64}
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      tickFormatter={(value) =>
                        axisFormatter ? axisFormatter.format(value) : value
                      }
                    />
                    <RechartsTooltip
                      content={
                        <YearComparisonTooltip
                          currencyFormatter={formatter}
                          currentLabel={currentText}
                          previousLabel={previousText}
                        />
                      }
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ paddingTop: 12, fontSize: 12 }}
                    />
                    <defs>
                      <linearGradient
                        id="currentYearGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#2563eb"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="100%"
                          stopColor="#2563eb"
                          stopOpacity={0.05}
                        />
                      </linearGradient>
                      <linearGradient
                        id="previousYearGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#64748b"
                          stopOpacity={0.35}
                        />
                        <stop
                          offset="100%"
                          stopColor="#64748b"
                          stopOpacity={0.04}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="currentYear"
                      name={currentText}
                      stroke="#2563eb"
                      strokeWidth={3}
                      fill="url(#currentYearGradient)"
                      dot={{ r: 3, stroke: "#fff", strokeWidth: 1.5 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="previousYear"
                      name={previousText}
                      stroke="#64748b"
                      strokeWidth={2}
                      fill="url(#previousYearGradient)"
                      dot={{ r: 3, stroke: "#fff", strokeWidth: 1.5 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Stack>
        </ModalBody>
        <ModalFooter bg="gray.50">
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="blue" leftIcon={<FiDownload />}>
            Export comparison
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function ComparisonStatCard({
  label,
  value,
  sublabel,
  subvalue,
  accent = "blue",
  valueColor,
}) {
  const accentPalette = {
    blue: {
      bg: "rgba(37, 99, 235, 0.08)",
      dot: "blue.400",
      border: "rgba(37, 99, 235, 0.15)",
    },
    green: {
      bg: "rgba(16, 185, 129, 0.12)",
      dot: "green.400",
      border: "rgba(16, 185, 129, 0.2)",
    },
    red: {
      bg: "rgba(239, 68, 68, 0.1)",
      dot: "red.400",
      border: "rgba(239, 68, 68, 0.2)",
    },
  }[accent] || {
    bg: "rgba(15, 23, 42, 0.08)",
    dot: "gray.500",
    border: "rgba(148, 163, 184, 0.25)",
  };

  return (
    <Box
      borderRadius="xl"
      borderWidth="1px"
      borderColor={accentPalette.border}
      bg={accentPalette.bg}
      px={4}
      py={5}
    >
      <Stack spacing={3}>
        <Text
          fontSize="xs"
          textTransform="uppercase"
          color="gray.500"
          fontWeight="semibold"
        >
          {label}
        </Text>
        <HStack spacing={2} align="baseline">
          <Box boxSize="10px" borderRadius="full" bg={accentPalette.dot} />
          <Heading size="md" color={valueColor || "gray.900"}>
            {value}
          </Heading>
        </HStack>
        <Divider borderColor="rgba(148, 163, 184, 0.35)" />
        <HStack justify="space-between" fontSize="sm" color="gray.600">
          <Text>{sublabel}</Text>
          <Text fontWeight="semibold">{subvalue}</Text>
        </HStack>
      </Stack>
    </Box>
  );
}

function StatCard({
  label,
  value,
  delta,
  deltaType,
  icon,
  subtitle,
  accent = "blue",
  tooltip,
  description,
  deltaCaption,
  customContent,
  footer,
  onDoubleClick,
  badge,
  badgeColorScheme = "blue",
  badgeVariant = "subtle",
  badgeIcon,
  meta,
}) {
  const DeltaIcon =
    deltaType === "increase"
      ? FiTrendingUp
      : deltaType === "decrease"
      ? FiTrendingDown
      : FiActivity;

  const baseAccent =
    typeof accent === "string"
      ? cardAccentMap[accent] ?? cardAccentMap.blue
      : cardAccentMap.blue;
  const accentStyles =
    typeof accent === "object" ? { ...baseAccent, ...accent } : baseAccent;
  const overlayLayer =
    accentStyles.overlay ||
    accentStyles.gradient ||
    "linear-gradient(135deg, rgba(248,250,252,0.95), rgba(226,232,240,0.85))";
  const patternLayer = accentStyles.pattern
    ? accentStyles.pattern
    : accentStyles.spot
    ? `radial-gradient(circle at 90% 25%, ${accentStyles.spot} 0%, rgba(255,255,255,0) 60%)`
    : null;
  const backgroundLayers = [overlayLayer, patternLayer].filter(Boolean);
  const backgroundImage = backgroundLayers.join(", ");
  const overlayRepeat = "no-repeat";
  const patternRepeat = accentStyles.patternRepeat || "no-repeat";
  const backgroundRepeat =
    backgroundLayers.length > 1
      ? `${overlayRepeat}, ${patternRepeat}`
      : overlayRepeat;

  const backgroundSize =
    backgroundLayers.length > 1
      ? `100% 100%, ${accentStyles.patternSize || "160% 160%"}`
      : "100% 100%";

  const backgroundPosition =
    backgroundLayers.length > 1
      ? `center, ${accentStyles.patternPosition || "120% 60%"}`
      : "center";

  const badgeNode = badge ? (
    <Badge
      px={2.5}
      py={0.5}
      borderRadius="full"
      colorScheme={badgeColorScheme}
      variant={badgeVariant}
      display="inline-flex"
      alignItems="center"
      gap={1}
      fontSize="xs"
      fontWeight="semibold"
      textTransform="none"
    >
      {badgeIcon ? <Icon as={badgeIcon} boxSize="11px" /> : null}
      {badge}
    </Badge>
  ) : null;

  const labelNode = (
    <HStack spacing={1.5}>
      <Text fontSize="sm" color="gray.500" fontWeight="medium">
        {label}
      </Text>
      {tooltip ? <Icon as={FiInfo} boxSize="14px" color="gray.400" /> : null}
    </HStack>
  );

  const labelContent = tooltip ? (
    <Tooltip label={tooltip} hasArrow placement="top-start" openDelay={200}>
      <Box cursor="help">{labelNode}</Box>
    </Tooltip>
  ) : (
    labelNode
  );

  return (
    <Box
      position="relative"
      bg="white"
      borderRadius="xl"
      p={{ base: 4, md: 5 }}
      minH="170px"
      borderWidth="1px"
      borderColor={accentStyles.border}
      boxShadow="sm"
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      overflow="hidden"
      cursor={onDoubleClick ? "zoom-in" : "default"}
      _hover={{ boxShadow: "lg", transform: "translateY(-3px)" }}
      backgroundImage={backgroundImage}
      backgroundRepeat={backgroundRepeat}
      backgroundSize={backgroundSize}
      backgroundPosition={backgroundPosition}
      onDoubleClick={onDoubleClick}
    >
      <Stack spacing={customContent ? 3 : 4} position="relative" zIndex={1}>
        <Flex align="flex-start" justify="space-between" gap={3}>
          <Stack spacing={customContent ? 1.5 : 2} pr={2}>
            {badgeNode}
            {labelContent}
            {!customContent ? (
              <>
                <Heading size="lg" color="gray.900">
                  {value}
                </Heading>
                {description ? (
                  <Text fontSize="xs" color="gray.600">
                    {description}
                  </Text>
                ) : null}
                {meta
                  ? typeof meta === "string"
                    ? (
                        <Text fontSize="xs" color="gray.500">
                          {meta}
                        </Text>
                      )
                    : (
                        <Box fontSize="xs" color="gray.500">
                          {meta}
                        </Box>
                      )
                  : null}
              </>
            ) : null}
          </Stack>

          {icon && (
            <Flex
              align="center"
              justify="center"
              boxSize="44px"
              borderRadius="full"
              bgGradient={`linear(to-br, ${accentStyles.iconBg}, rgba(255,255,255,0.65))`}
              color={accentStyles.iconColor}
              borderWidth="1px"
              borderColor="rgba(255,255,255,0.6)"
              boxShadow="0 6px 16px rgba(15, 23, 42, 0.12)"
            >
              <Icon as={icon} boxSize="20px" />
            </Flex>
          )}
        </Flex>

        {customContent ? (
          <>
            <Box>{customContent}</Box>
            {meta
              ? typeof meta === "string"
                ? (
                    <Text fontSize="xs" color="gray.500">
                      {meta}
                    </Text>
                  )
                : (
                    <Box fontSize="xs" color="gray.500">
                      {meta}
                    </Box>
                  )
              : null}
          </>
        ) : (
          <Stack spacing={2}>
            {subtitle ? (
              <Text fontSize="xs" color="gray.600">
                {subtitle}
              </Text>
            ) : null}
            {(delta || deltaCaption) && (
              <HStack spacing={2} align="center" flexWrap="wrap">
                {delta ? (
                  <Tag
                    size="sm"
                    borderRadius="full"
                    px={3}
                    py={1}
                    bg={accentStyles.deltaBg}
                    color={accentStyles.deltaColor}
                    fontWeight="semibold"
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon as={DeltaIcon} boxSize="12px" />
                    <Text>{delta}</Text>
                  </Tag>
                ) : null}
                {deltaCaption ? (
                  <Text fontSize="xs" color="gray.600">
                    {deltaCaption}
                  </Text>
                ) : null}
              </HStack>
            )}
            {footer ? (
              typeof footer === "string" ? (
                <Text fontSize="xs" color="gray.500">
                  {footer}
                </Text>
              ) : (
                <Box fontSize="xs" color="gray.500">
                  {footer}
                </Box>
              )
            ) : null}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

const cardAccentMap = {
  blue: {
    border: "rgba(37, 99, 235, 0.18)",
    iconBg: "rgba(37, 99, 235, 0.18)",
    iconColor: "#1d4ed8",
    overlay:
      "linear-gradient(135deg, rgba(238, 244, 255, 0.92) 0%, rgba(212, 233, 255, 0.88) 50%, rgba(59, 130, 246, 0.24) 100%)",
    pattern: "url('/card/bg_blue_card.png')",
    patternSize: "145% 145%",
    patternPosition: "110% 40%",
    patternRepeat: "no-repeat",
    deltaBg: "rgba(37, 99, 235, 0.15)",
    deltaColor: "#1d4ed8",
  },
  purple: {
    border: "rgba(139, 92, 246, 0.2)",
    iconBg: "rgba(139, 92, 246, 0.18)",
    iconColor: "#6d28d9",
    overlay:
      "linear-gradient(135deg, rgba(248, 243, 255, 0.94) 0%, rgba(236, 221, 255, 0.88) 50%, rgba(168, 85, 247, 0.25) 100%)",
    pattern: "url('/card/bg_purple_card.png')",
    patternSize: "150% 150%",
    patternPosition: "108% 45%",
    patternRepeat: "no-repeat",
    deltaBg: "rgba(139, 92, 246, 0.15)",
    deltaColor: "#6d28d9",
  },
  mint: {
    border: "rgba(16, 185, 129, 0.2)",
    iconBg: "rgba(16, 185, 129, 0.2)",
    iconColor: "#047857",
    overlay:
      "linear-gradient(135deg, rgba(236, 253, 245, 0.95) 0%, rgba(209, 250, 229, 0.88) 48%, rgba(52, 211, 153, 0.24) 100%)",
    pattern: "url('/card/bg_green_card.png')",
    patternSize: "148% 148%",
    patternPosition: "108% 45%",
    patternRepeat: "no-repeat",
    deltaBg: "rgba(16, 185, 129, 0.15)",
    deltaColor: "#047857",
  },
  amber: {
    border: "rgba(251, 191, 36, 0.24)",
    iconBg: "rgba(251, 191, 36, 0.18)",
    iconColor: "#b45309",
    overlay:
      "linear-gradient(135deg, rgba(255, 250, 235, 0.95) 0%, rgba(253, 241, 178, 0.88) 48%, rgba(250, 204, 21, 0.22) 100%)",
    pattern:
      "radial-gradient(circle at 88% 28%, rgba(251, 191, 36, 0.28) 0%, rgba(251, 191, 36, 0) 60%), radial-gradient(circle at 12% 110%, rgba(253, 230, 138, 0.22) 0%, rgba(253, 230, 138, 0) 60%)",
    patternSize: "200% 200%",
    patternPosition: "120% 70%",
    patternRepeat: "no-repeat",
    deltaBg: "rgba(251, 191, 36, 0.18)",
    deltaColor: "#b45309",
  },
};

function HighlightStatCard({
  title,
  value,
  subtitle,
  icon,
  accent = "blue",
  meta,
  footer,
}) {
  const accentStyles = cardAccentMap[accent] ?? cardAccentMap.blue;
  const overlayLayer =
    accentStyles.overlay ||
    accentStyles.gradient ||
    "linear-gradient(135deg, rgba(248,250,252,0.95), rgba(226,232,240,0.85))";
  const patternLayer = accentStyles.pattern
    ? accentStyles.pattern
    : accentStyles.spot
    ? `radial-gradient(circle at 90% 25%, ${accentStyles.spot} 0%, rgba(255,255,255,0) 60%)`
    : null;
  const backgroundLayers = [overlayLayer, patternLayer].filter(Boolean);
  const backgroundImage = backgroundLayers.join(", ");
  const overlayRepeat = "no-repeat";
  const patternRepeat = accentStyles.patternRepeat || "no-repeat";
  const backgroundRepeat =
    backgroundLayers.length > 1
      ? `${overlayRepeat}, ${patternRepeat}`
      : overlayRepeat;
  const backgroundSize =
    backgroundLayers.length > 1
      ? `100% 100%, ${accentStyles.patternSize || "180% 180%"}`
      : "100% 100%";
  const backgroundPosition =
    backgroundLayers.length > 1
      ? `center, ${accentStyles.patternPosition || "120% 60%"}`
      : "center";

  return (
    <Box
      position="relative"
      p={{ base: 4, md: 5 }}
      borderRadius="xl"
      bg="white"
      borderWidth="1px"
      borderColor={accentStyles.border}
      boxShadow="sm"
      overflow="hidden"
      minH="165px"
      backgroundImage={backgroundImage}
      backgroundRepeat={backgroundRepeat}
      backgroundSize={backgroundSize}
      backgroundPosition={backgroundPosition}
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{ transform: "translateY(-3px)", boxShadow: "lg" }}
    >
      <Stack spacing={4} position="relative" zIndex={1}>
        <Flex justify="space-between" align="flex-start">
          <Stack spacing={2} pr={4}>
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
              {title}
            </Text>
            <Heading size="lg" color="gray.900">
              {value}
            </Heading>
            {subtitle ? (
              <Text fontSize="xs" color="gray.500">
                {subtitle}
              </Text>
            ) : null}
          </Stack>
          {icon ? (
            <Flex
              align="center"
              justify="center"
              boxSize="50px"
              borderRadius="full"
              bgGradient={`linear(to-br, ${accentStyles.iconBg}, rgba(255,255,255,0.6))`}
              color={accentStyles.iconColor}
              borderWidth="1px"
              borderColor="rgba(255,255,255,0.4)"
              boxShadow="0 8px 20px rgba(15, 23, 42, 0.12)"
            >
              <Icon as={icon} boxSize="22px" />
            </Flex>
          ) : null}
        </Flex>

        {meta ? <Box>{meta}</Box> : null}

        {footer ? (
          <Text fontSize="xs" color="gray.500">
            {footer}
          </Text>
        ) : null}
      </Stack>
    </Box>
  );
}

function HighlightStatCardSkeleton({ accent = "blue" }) {
  const accentStyles = cardAccentMap[accent] ?? cardAccentMap.blue;
  const overlayLayer =
    accentStyles.overlay ||
    accentStyles.gradient ||
    "linear-gradient(135deg, rgba(248,250,252,0.95), rgba(226,232,240,0.85))";
  const patternLayer = accentStyles.pattern
    ? accentStyles.pattern
    : accentStyles.spot
    ? `radial-gradient(circle at 90% 25%, ${accentStyles.spot} 0%, rgba(255,255,255,0) 60%)`
    : null;
  const backgroundLayers = [overlayLayer, patternLayer].filter(Boolean);
  const backgroundImage = backgroundLayers.join(", ");
  const overlayRepeat = "no-repeat";
  const patternRepeat = accentStyles.patternRepeat || "no-repeat";
  const backgroundRepeat =
    backgroundLayers.length > 1
      ? `${overlayRepeat}, ${patternRepeat}`
      : overlayRepeat;
  const backgroundSize =
    backgroundLayers.length > 1
      ? `100% 100%, ${accentStyles.patternSize || "180% 180%"}`
      : "100% 100%";
  const backgroundPosition =
    backgroundLayers.length > 1
      ? `center, ${accentStyles.patternPosition || "120% 60%"}`
      : "center";
  return (
    <Box
      position="relative"
      p={{ base: 4, md: 5 }}
      borderRadius="xl"
      bg="white"
      borderWidth="1px"
      borderColor={accentStyles.border}
      boxShadow="sm"
      overflow="hidden"
      minH="165px"
      backgroundImage={backgroundImage}
      backgroundRepeat={backgroundRepeat}
      backgroundSize={backgroundSize}
      backgroundPosition={backgroundPosition}
    >
      <Stack spacing={4} position="relative" zIndex={1}>
        <Flex justify="space-between" align="flex-start">
          <Stack spacing={2} flex="1">
            <Skeleton height="10px" width="40%" />
            <Skeleton height="20px" width="60%" />
            <Skeleton height="10px" width="50%" />
          </Stack>
          <Skeleton boxSize="48px" borderRadius="full" />
        </Flex>
        <SkeletonText mt={2} noOfLines={2} spacing="3" />
      </Stack>
    </Box>
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

const statusVariantMap = {
  Confirmed: "subtle",
  Pending: "subtle",
  Maintenance: "outline",
};

const bookingAccentMap = {
  Confirmed: {
    gradient:
      "linear(to-br, rgba(37, 99, 235, 0.12), rgba(59, 130, 246, 0.05))",
    border: "rgba(37, 99, 235, 0.28)",
    highlight: "blue.500",
  },
  Pending: {
    gradient:
      "linear(to-br, rgba(234, 179, 8, 0.14), rgba(250, 204, 21, 0.05))",
    border: "rgba(234, 179, 8, 0.32)",
    highlight: "yellow.500",
  },
  Maintenance: {
    gradient:
      "linear(to-br, rgba(147, 51, 234, 0.16), rgba(168, 85, 247, 0.05))",
    border: "rgba(147, 51, 234, 0.3)",
    highlight: "purple.500",
  },
  default: {
    gradient:
      "linear(to-br, rgba(15, 23, 42, 0.08), rgba(148, 163, 184, 0.05))",
    border: "rgba(148, 163, 184, 0.28)",
    highlight: "gray.500",
  },
};

function UpcomingBookings({ items }) {
  return (
    <Stack spacing={4}>
      {items.map((item) => {
        const accent =
          bookingAccentMap[item.status] || bookingAccentMap.default;
        return (
          <Box
            key={item.id}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={accent.border}
            bgGradient={accent.gradient}
            boxShadow="sm"
            p={{ base: 4, md: 5 }}
            transition="all 0.25s ease"
            _hover={{
              boxShadow: "lg",
              transform: "translateY(-2px)",
            }}
          >
            <Stack spacing={3}>
              <Flex
                direction={{ base: "column", sm: "row" }}
                justify="space-between"
                align={{ base: "flex-start", sm: "center" }}
                gap={3}
              >
                <Stack spacing={2}>
                  <HStack spacing={2}>
                    <Tag
                      size="sm"
                      variant="subtle"
                      colorScheme="gray"
                      borderRadius="full"
                    >
                      {item.id}
                    </Tag>
                    <Badge
                      colorScheme={statusColorMap[item.status] || "gray"}
                      variant={statusVariantMap[item.status] || "subtle"}
                      borderRadius="full"
                    >
                      {item.status}
                    </Badge>
                  </HStack>
                  <Heading size="sm" color="gray.900">
                    {item.guest}
                  </Heading>
                  <Text fontSize="sm" color="gray.600">
                    {item.unit}
                  </Text>
                </Stack>
                <Stack
                  spacing={2}
                  align={{ base: "flex-start", sm: "flex-end" }}
                >
                  <Text fontSize="xs" color="gray.500">
                    Est. value
                  </Text>
                  <Heading size="sm" color="gray.900">
                    {item.value ? currencyFormatter.format(item.value) : "—"}
                  </Heading>
                  <HStack fontSize="xs" color="gray.500">
                    <Icon as={FiMapPin} />
                    <Text>{item.pickup}</Text>
                  </HStack>
                </Stack>
              </Flex>

              <Divider borderColor="rgba(148, 163, 184, 0.35)" />

              <Flex
                direction={{ base: "column", sm: "row" }}
                justify="space-between"
                align={{ base: "flex-start", sm: "center" }}
                gap={3}
                fontSize="sm"
                color="gray.600"
              >
                <HStack spacing={2}>
                  <Icon as={FiClock} />
                  <Text>{item.date}</Text>
                </HStack>
                <HStack spacing={2}>
                  <Icon as={FiDollarSign} />
                  <Text>
                    {item.value
                      ? currencyFormatter.format(item.value)
                      : "Awaiting quote"}
                  </Text>
                </HStack>
                <HStack
                  spacing={1}
                  color="blue.600"
                  fontWeight="semibold"
                  cursor="pointer"
                >
                  <Icon as={FiArrowRight} />
                  <Text>Prepare handoff</Text>
                </HStack>
              </Flex>
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}

function TopPerformers({ items }) {
  if (!items?.length) {
    return (
      <Box
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.100"
        p={6}
        textAlign="center"
        color="gray.500"
        bg="gray.50"
      >
        No performance data yet.
      </Box>
    );
  }

  const maxRevenue = Math.max(...items.map((item) => item.revenue));

  return (
    <Stack spacing={4}>
      {items.map((unit) => {
        const revenueShare = Math.round((unit.revenue / maxRevenue) * 100);

        return (
          <Box
            key={unit.plate}
            borderRadius="xl"
            borderWidth="1px"
            borderColor="rgba(37, 99, 235, 0.12)"
            bg="rgba(37, 99, 235, 0.05)"
            px={4}
            py={4}
          >
            <Stack spacing={3}>
              <Flex justify="space-between" align="center" gap={4} wrap="wrap">
                <HStack spacing={3}>
                  <Avatar
                    name={unit.name}
                    size="sm"
                    color="white"
                    bg="blue.500"
                  />
                  <Stack spacing={0}>
                    <Text fontWeight="semibold" color="gray.800">
                      {unit.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {unit.plate}
                    </Text>
                  </Stack>
                </HStack>

                <Stack spacing={0} align="flex-end">
                  <Text fontSize="xs" color="gray.500">
                    Revenue
                  </Text>
                  <Heading size="sm" color="gray.900">
                    {currencyFormatter.format(unit.revenue)}
                  </Heading>
                </Stack>
              </Flex>

              <Progress
                value={unit.occupancy}
                colorScheme="blue"
                size="sm"
                borderRadius="full"
                bg="rgba(37, 99, 235, 0.12)"
              />

              <Flex justify="space-between" fontSize="xs" color="gray.600">
                <HStack spacing={1}>
                  <Icon as={FiActivity} />
                  <Text>{unit.occupancy}% occupancy</Text>
                </HStack>
                <HStack spacing={1}>
                  <Icon as={FiTrendingUp} />
                  <Text>{revenueShare}% of top-unit revenue</Text>
                </HStack>
              </Flex>
            </Stack>
          </Box>
        );
      })}
    </Stack>
  );
}

function ActivityTimeline({ items }) {
  return (
    <Stack spacing={4}>
      {items.map((item, idx) => {
        const accent = activityAccentMap[item.type] || activityAccentMap.info;
        return (
          <Box
            key={`${item.title}-${idx}`}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={accent.border}
            bg={accent.bg}
            px={4}
            py={4}
          >
            <HStack spacing={3} align="flex-start">
              <Flex
                align="center"
                justify="center"
                boxSize="36px"
                borderRadius="full"
                bg="white"
                borderWidth="1px"
                borderColor={accent.border}
              >
                <Icon as={accent.icon} color={accent.color} />
              </Flex>
              <Stack spacing={1} flex={1}>
                <HStack justify="space-between" align="baseline">
                  <Text fontWeight="semibold" color="gray.900">
                    {item.title}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {item.time}
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  {item.description}
                </Text>
              </Stack>
            </HStack>
          </Box>
        );
      })}
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

  const resolvedCurrency = summaryData?.period?.currency || "PHP";

  const summaryCurrencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: resolvedCurrency,
        maximumFractionDigits: 2,
      }),
    [resolvedCurrency]
  );

  const summaryCompactCurrencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: resolvedCurrency,
        notation: "compact",
        maximumFractionDigits: 1,
      }),
    [resolvedCurrency]
  );

  const salesCurrencyCode = monthlySalesCurrency || resolvedCurrency;
  const monthlyCurrencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: salesCurrencyCode,
        maximumFractionDigits: 2,
      }),
    [salesCurrencyCode]
  );
  const monthlyCompactCurrencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: salesCurrencyCode,
        notation: "compact",
        maximumFractionDigits: 1,
      }),
    [salesCurrencyCode]
  );
  const highlightsCurrency =
    highlights?.totals?.sales?.currency || salesCurrencyCode;
  const highlightsCurrencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: highlightsCurrency,
        maximumFractionDigits: 2,
      }),
    [highlightsCurrency]
  );
  const revenueByClassCurrencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: revenueByClassCurrency || salesCurrencyCode,
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
                <TagLabel>Live overview</TagLabel>
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
              <Flex justify="space-between" align="center" mb={5}>
                <Stack spacing={1}>
                  <HStack spacing={2} color="gray.500">
                    <Icon as={FiClock} />
                    <Text fontSize="sm" fontWeight="medium">
                      Next up
                    </Text>
                  </HStack>
                  <Heading size="sm" color="gray.800">
                    Upcoming booking schedule
                  </Heading>
                </Stack>
                <Button size="xs" variant="outline">
                  See calendar
                </Button>
              </Flex>

              <UpcomingBookings items={upcomingBookingsData} />
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
                      <Icon as={FiTrendingUp} />
                      <Text fontSize="sm" fontWeight="medium">
                        Top performers
                      </Text>
                    </HStack>
                    <Heading size="sm" color="gray.800">
                      Vehicles driving revenue
                    </Heading>
                  </Stack>
                  <TopPerformers items={topUnitsData} />
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



