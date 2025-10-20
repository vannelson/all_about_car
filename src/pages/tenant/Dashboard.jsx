import { useEffect, useMemo, useState } from "react";
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

const monthlySalesData = [
  { month: "Jan", total: 18200, bookings: 62 },
  { month: "Feb", total: 21500, bookings: 70 },
  { month: "Mar", total: 19800, bookings: 64 },
  { month: "Apr", total: 22500, bookings: 72 },
  { month: "May", total: 24100, bookings: 79 },
  { month: "Jun", total: 26000, bookings: 85 },
  { month: "Jul", total: 27600, bookings: 91 },
  { month: "Aug", total: 26800, bookings: 88 },
  { month: "Sep", total: 25200, bookings: 84 },
  { month: "Oct", total: 23800, bookings: 77 },
  { month: "Nov", total: 24500, bookings: 81 },
  { month: "Dec", total: 28900, bookings: 95 },
];

const lastYearSalesData = [
  { month: "Jan", total: 16500, bookings: 58 },
  { month: "Feb", total: 18900, bookings: 63 },
  { month: "Mar", total: 18400, bookings: 60 },
  { month: "Apr", total: 20100, bookings: 66 },
  { month: "May", total: 21200, bookings: 70 },
  { month: "Jun", total: 22500, bookings: 73 },
  { month: "Jul", total: 23800, bookings: 78 },
  { month: "Aug", total: 23100, bookings: 76 },
  { month: "Sep", total: 21800, bookings: 71 },
  { month: "Oct", total: 20500, bookings: 68 },
  { month: "Nov", total: 21400, bookings: 72 },
  { month: "Dec", total: 25500, bookings: 85 },
];

const revenueByClassData = [
  { label: "Premium SUV", revenue: 38250, share: 36 },
  { label: "Executive Sedan", revenue: 27480, share: 26 },
  { label: "Family Van", revenue: 19800, share: 19 },
  { label: "Compact City", revenue: 14640, share: 14 },
  { label: "Luxury Signature", revenue: 9050, share: 9 },
];

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

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const dataPoint = payload[0]?.payload;

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
        {currencyFormatter.format(dataPoint?.total || 0)}
      </Text>
      <HStack spacing={2} fontSize="xs" color="gray.500">
        <Icon as={FiCalendar} boxSize="12px" />
        <Text>{dataPoint?.bookings ?? 0} bookings</Text>
      </HStack>
    </Stack>
  );
}

function RevenueChart({ data, chartType }) {
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
              tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
            />
            <RechartsTooltip
              cursor={{
                fill: "rgba(37, 99, 235, 0.08)",
              }}
              content={<RevenueTooltip />}
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
              tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
            />
            <RechartsTooltip
              cursor={{
                stroke: "#2563eb",
                strokeWidth: 1,
                strokeDasharray: "6 6",
              }}
              content={<RevenueTooltip />}
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

function YearComparisonTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const current = payload.find((p) => p.dataKey === "currentYear");
  const previous = payload.find((p) => p.dataKey === "previousYear");

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
        <Text color="gray.500">{CURRENT_YEAR}</Text>
        <Text fontWeight="semibold" color="blue.600">
          {currencyFormatter.format(current?.value ?? 0)}
        </Text>
      </HStack>
      <HStack justify="space-between" fontSize="sm">
        <Text color="gray.500">{PREVIOUS_YEAR}</Text>
        <Text fontWeight="semibold" color="gray.600">
          {currencyFormatter.format(previous?.value ?? 0)}
        </Text>
      </HStack>
    </Stack>
  );
}

function YearComparisonModal({ isOpen, onClose, data, summary }) {
  const revenueDeltaColor = summary.revenueDelta >= 0 ? "green.500" : "red.500";
  const bookingDeltaColor = summary.bookingDelta >= 0 ? "green.500" : "red.500";

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
              {CURRENT_YEAR} vs {PREVIOUS_YEAR}
            </Heading>
          </Stack>
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody bg="gray.50" py={6}>
          <Stack spacing={6}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <ComparisonStatCard
                label={`${CURRENT_YEAR} revenue`}
                value={currencyFormatter.format(summary.currentRevenue)}
                sublabel="Bookings"
                subvalue={numberFormatter.format(summary.currentBookings)}
                accent="blue"
              />
              <ComparisonStatCard
                label="Revenue change"
                value={`${summary.revenueDelta >= 0 ? "+" : ""}${summary.revenueDelta.toFixed(
                  1
                )}%`}
                sublabel={`${PREVIOUS_YEAR} revenue`}
                subvalue={currencyFormatter.format(summary.previousRevenue)}
                accent={summary.revenueDelta >= 0 ? "green" : "red"}
                valueColor={revenueDeltaColor}
              />
              <ComparisonStatCard
                label="Bookings change"
                value={`${summary.bookingDelta >= 0 ? "+" : ""}${summary.bookingDelta.toFixed(
                  1
                )}%`}
                sublabel={`${PREVIOUS_YEAR} bookings`}
                subvalue={numberFormatter.format(summary.previousBookings)}
                accent={summary.bookingDelta >= 0 ? "green" : "red"}
                valueColor={bookingDeltaColor}
              />
            </SimpleGrid>

            <Box bg="white" borderRadius="xl" borderWidth="1px" p={4} boxShadow="sm">
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
                      tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                    />
                    <RechartsTooltip content={<YearComparisonTooltip />} />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ paddingTop: 12, fontSize: 12 }}
                    />
                    <defs>
                      <linearGradient id="currentYearGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="previousYearGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#64748b" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#64748b" stopOpacity={0.04} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="currentYear"
                      name={CURRENT_YEAR}
                      stroke="#2563eb"
                      strokeWidth={3}
                      fill="url(#currentYearGradient)"
                      dot={{ r: 3, stroke: "#fff", strokeWidth: 1.5 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="previousYear"
                      name={PREVIOUS_YEAR}
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
        <Text fontSize="xs" textTransform="uppercase" color="gray.500" fontWeight="semibold">
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

function StatCard({ label, value, delta, deltaType, icon, subtitle, accent }) {
  const DeltaIcon =
    deltaType === "increase"
      ? FiTrendingUp
      : deltaType === "decrease"
      ? FiTrendingDown
      : FiActivity;

  const accentStyles = {
    gradient:
      accent?.gradient ||
      "linear(to-br, rgba(59, 130, 246, 0.18), rgba(59, 130, 246, 0.03))",
    spot: accent?.spot || "rgba(59, 130, 246, 0.35)",
    iconBg: accent?.iconBg || "rgba(59, 130, 246, 0.12)",
    iconColor: accent?.iconColor || "#2563eb",
    border: accent?.border || "rgba(59, 130, 246, 0.18)",
    bar:
      accent?.bar || "linear(to-r, rgba(59, 130, 246, 0.6), rgba(59, 130, 246, 0))",
  };

  return (
    <Box
      position="relative"
      bg="white"
      borderRadius="2xl"
      p={{ base: 5, md: 6 }}
      borderWidth="1px"
      borderColor={accentStyles.border}
      boxShadow="md"
      transition="all 0.2s ease"
      overflow="hidden"
      _hover={{ boxShadow: "xl", transform: "translateY(-4px)" }}
      _before={{
        content: '""',
        position: "absolute",
        inset: 0,
        bgGradient: accentStyles.gradient,
        opacity: 1,
      }}
      _after={{
        content: '""',
        position: "absolute",
        width: "220px",
        height: "220px",
        top: "-130px",
        right: "-80px",
        bg: accentStyles.spot,
        filter: "blur(90px)",
        opacity: 0.9,
      }}
    >
      <Stack spacing={6} position="relative" zIndex={1}>
        <Flex align="center" justify="space-between" gap={4}>
          <Stack spacing={1}>
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
              {label}
            </Text>
            <Heading size="lg" color="gray.900">
              {value}
            </Heading>
          </Stack>
          <Flex
            align="center"
            justify="center"
            bg={accentStyles.iconBg}
            color={accentStyles.iconColor}
            borderRadius="full"
            boxSize="50px"
            backdropFilter="blur(6px)"
            borderWidth="1px"
            borderColor="rgba(255, 255, 255, 0.4)"
          >
            <Icon as={icon} boxSize="22px" />
          </Flex>
        </Flex>

        <Flex align="center" justify="space-between" gap={4}>
          {delta && (
            <HStack spacing={2}>
              <Flex
                align="center"
                gap={1}
                fontWeight="semibold"
                color={deltaColorMap[deltaType]}
                fontSize="sm"
              >
                <Icon as={DeltaIcon} boxSize="16px" />
                <Text>{delta}</Text>
              </Flex>
              {subtitle && (
                <Tag
                  size="sm"
                  variant="subtle"
                  colorScheme="gray"
                  borderRadius="full"
                  px={3}
                >
                  {subtitle}
                </Tag>
              )}
            </HStack>
          )}
        </Flex>

        <Box
          h="3px"
          borderRadius="full"
          bgGradient={accentStyles.bar}
          opacity={0.85}
        />
      </Stack>
    </Box>
  );
}

function RevenueByClass({ data }) {
  const maxRevenue = Math.max(...data.map((item) => item.revenue));
  return (
    <Stack spacing={4}>
      {data.map((item) => (
        <Stack key={item.label} spacing={3}>
          <Flex justify="space-between" align="center">
            <Stack spacing={0}>
              <Text fontWeight="semibold" color="gray.800">
                {item.label}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {item.share}% of monthly revenue
              </Text>
            </Stack>
            <Tag variant="subtle" colorScheme="blue" borderRadius="full">
              {compactCurrencyFormatter.format(item.revenue)}
            </Tag>
          </Flex>
          <Progress
            value={(item.revenue / maxRevenue) * 100}
            colorScheme="blue"
            size="sm"
            borderRadius="full"
            bg="rgba(37, 99, 235, 0.12)"
          />
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
    gradient: "linear(to-br, rgba(37, 99, 235, 0.12), rgba(59, 130, 246, 0.05))",
    border: "rgba(37, 99, 235, 0.28)",
    highlight: "blue.500",
  },
  Pending: {
    gradient: "linear(to-br, rgba(234, 179, 8, 0.14), rgba(250, 204, 21, 0.05))",
    border: "rgba(234, 179, 8, 0.32)",
    highlight: "yellow.500",
  },
  Maintenance: {
    gradient: "linear(to-br, rgba(147, 51, 234, 0.16), rgba(168, 85, 247, 0.05))",
    border: "rgba(147, 51, 234, 0.3)",
    highlight: "purple.500",
  },
  default: {
    gradient: "linear(to-br, rgba(15, 23, 42, 0.08), rgba(148, 163, 184, 0.05))",
    border: "rgba(148, 163, 184, 0.28)",
    highlight: "gray.500",
  },
};

function UpcomingBookings({ items }) {
  return (
    <Stack spacing={4}>
      {items.map((item) => {
        const accent = bookingAccentMap[item.status] || bookingAccentMap.default;
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
                    <Tag size="sm" variant="subtle" colorScheme="gray" borderRadius="full">
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
                <Stack spacing={2} align={{ base: "flex-start", sm: "flex-end" }}>
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
                    {item.value ? currencyFormatter.format(item.value) : "Awaiting quote"}
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

  const buildSubtitle = (valueLabel) => {
    if (valueLabel && previousPeriodLabel) {
      return `${valueLabel} | ${previousPeriodLabel}`;
    }
    return valueLabel || previousPeriodLabel || undefined;
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

  const revenueSubtitle = buildSubtitle(
    previousRevenue != null
      ? `Prev ${summaryCompactCurrencyFormatter.format(previousRevenue)}`
      : null
  );
  const bookingsSubtitle = buildSubtitle(
    previousBookings != null
      ? `Prev ${numberFormatter.format(previousBookings)}`
      : null
  );
  const averageBookingValueSubtitle = buildSubtitle(
    previousAverageBookingValue != null
      ? `Prev ${summaryCurrencyFormatter.format(previousAverageBookingValue)}`
      : null
  );

  const comparisonData = useMemo(
    () =>
      monthlySalesData.map((item, index) => ({
        month: item.month,
        currentYear: item.total,
        previousYear: lastYearSalesData[index]?.total ?? 0,
        currentBookings: item.bookings,
        previousBookings: lastYearSalesData[index]?.bookings ?? 0,
      })),
    []
  );

  const comparisonSummary = useMemo(() => {
    const currentRevenue = monthlySalesData.reduce(
      (sum, item) => sum + item.total,
      0
    );
    const previousRevenue = lastYearSalesData.reduce(
      (sum, item) => sum + item.total,
      0
    );
    const currentBookingsCount = monthlySalesData.reduce(
      (sum, item) => sum + item.bookings,
      0
    );
    const previousBookingsCount = lastYearSalesData.reduce(
      (sum, item) => sum + item.bookings,
      0
    );

    const revenueDelta =
      previousRevenue === 0
        ? 0
        : ((currentRevenue - previousRevenue) / previousRevenue) * 100;
    const bookingDelta =
      previousBookingsCount === 0
        ? 0
        : ((currentBookingsCount - previousBookingsCount) /
            previousBookingsCount) *
          100;

    return {
      currentRevenue,
      previousRevenue,
      currentBookings: currentBookingsCount,
      previousBookings: previousBookingsCount,
      revenueDelta,
      bookingDelta,
    };
  }, []);

  const fleetUtilization = 0.82;
  const utilizationTrend = -2.4;
  const utilizationDegrees = Math.round(fleetUtilization * 360);
  const occupancyGradient = `conic-gradient(from 90deg, #1d4ed8 0deg, #2563eb ${utilizationDegrees}deg, #e5e7eb ${utilizationDegrees}deg, #e5e7eb 360deg)`;

  const metricCards = [
    {
      label: "Annual Revenue",
      value: revenueValueDisplay,
      delta: revenueDeltaLabel,
      deltaType: revenueDeltaType,
      icon: FiTrendingUp,
      subtitle: revenueSubtitle,
      accent: {
        gradient: "linear(to-br, rgba(37, 99, 235, 0.18), rgba(59, 130, 246, 0.05))",
        spot: "rgba(59, 130, 246, 0.45)",
        iconBg: "rgba(37, 99, 235, 0.15)",
        iconColor: "#1d4ed8",
        border: "rgba(37, 99, 235, 0.24)",
        bar: "linear(to-r, rgba(37, 99, 235, 0.7), rgba(59, 130, 246, 0))",
      },
    },
    {
      label: "Bookings YTD",
      value: bookingsValueDisplay,
      delta: bookingsDeltaLabel,
      deltaType: bookingsDeltaType,
      icon: FiCalendar,
      subtitle: bookingsSubtitle,
      accent: {
        gradient: "linear(to-br, rgba(109, 40, 217, 0.18), rgba(124, 58, 237, 0.05))",
        spot: "rgba(124, 58, 237, 0.42)",
        iconBg: "rgba(124, 58, 237, 0.14)",
        iconColor: "#6d28d9",
        border: "rgba(124, 58, 237, 0.24)",
        bar: "linear(to-r, rgba(124, 58, 237, 0.7), rgba(244, 114, 182, 0))",
      },
    },
    {
      label: "Avg Booking Value",
      value: averageBookingValueDisplay,
      delta: averageBookingValueDeltaLabel,
      deltaType: averageValueDeltaType,
      icon: FiCreditCard,
      subtitle: averageBookingValueSubtitle,
      accent: {
        gradient: "linear(to-br, rgba(13, 148, 136, 0.18), rgba(16, 185, 129, 0.06))",
        spot: "rgba(45, 212, 191, 0.4)",
        iconBg: "rgba(16, 185, 129, 0.16)",
        iconColor: "#0f766e",
        border: "rgba(13, 148, 136, 0.24)",
        bar: "linear(to-r, rgba(13, 148, 136, 0.7), rgba(45, 212, 191, 0))",
      },
    },
    {
      label: "Fleet Utilization",
      value: `${Math.round(fleetUtilization * 100)}%`,
      delta: `${utilizationTrend > 0 ? "+" : ""}${utilizationTrend.toFixed(
        1
      )}%`,
      deltaType: utilizationTrend >= 0 ? "increase" : "decrease",
      icon: TbSteeringWheel,
      subtitle: "Active rentals today",
      accent: {
        gradient: "linear(to-br, rgba(249, 115, 22, 0.18), rgba(245, 158, 11, 0.05))",
        spot: "rgba(251, 191, 36, 0.48)",
        iconBg: "rgba(251, 146, 60, 0.16)",
        iconColor: "#b45309",
        border: "rgba(251, 146, 60, 0.24)",
        bar: "linear(to-r, rgba(251, 146, 60, 0.7), rgba(253, 224, 71, 0))",
      },
    },
  ];

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
                    fontWeight={datePreset === preset.value ? "semibold" : "normal"}
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
            <Button
              leftIcon={<FiDownload />}
              colorScheme="blue"
              size="sm"
            >
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
          {metricCards.map((card) => (
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
              h="100%"
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
                    <Tag size="sm" variant="subtle" colorScheme="blue">
                      Updated 5 minutes ago
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
                    >
                      Compare years
                    </Button>
                  </HStack>
                </Flex>

                <RevenueChart data={monthlySalesData} chartType={chartType} />
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
                  <RevenueByClass data={revenueByClassData} />
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
                      <Icon as={FiActivity} />
                      <Text fontSize="sm" fontWeight="medium">
                        Utilization pulse
                      </Text>
                    </HStack>
                    <Heading size="sm" color="gray.800">
                      Live occupancy snapshot
                    </Heading>
                  </Stack>
                  <Flex
                    align={{ base: "flex-start", sm: "center" }}
                    justify="space-between"
                    gap={4}
                    wrap="wrap"
                  >
                    <Stack spacing={1}>
                      <Text fontSize="sm" color="gray.500">
                        Vehicles out
                      </Text>
                      <Heading size="lg" color="gray.800">
                        34 / 42
                      </Heading>
                      <Text fontSize="xs" color="gray.500">
                        4 returns scheduled before noon
                      </Text>
                    </Stack>
                    <Flex
                      align="center"
                      justify="center"
                      borderRadius="full"
                      boxSize="88px"
                      backgroundImage={occupancyGradient}
                      position="relative"
                    >
                      <Flex
                        align="center"
                        justify="center"
                        boxSize="66px"
                        borderRadius="full"
                        bg="white"
                        color="blue.600"
                        fontWeight="bold"
                        fontSize="lg"
                      >
                        {Math.round(fleetUtilization * 100)}%
                      </Flex>
                    </Flex>
                  </Flex>
                  <Stack spacing={2}>
                    <HStack spacing={3} fontSize="xs" color="gray.500">
                      <Box boxSize="10px" borderRadius="full" bg="blue.500" />
                      <Text>Active bookings</Text>
                      <Box boxSize="10px" borderRadius="full" bg="gray.200" />
                      <Text>Available inventory</Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      Utilization is{" "}
                      <Text as="span" color="red.500" fontWeight="semibold">
                        {utilizationTrend.toFixed(1)}%
                      </Text>{" "}
                      vs last week. Consider upselling returns scheduled today.
                    </Text>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </GridItem>
        </Grid>

        <Grid
          templateColumns={{ base: "1fr", xl: "3fr 2fr" }}
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

        <YearComparisonModal
          isOpen={isComparisonOpen}
          onClose={onComparisonClose}
          data={comparisonData}
          summary={comparisonSummary}
        />
      </Stack>
    </Box>
  );
};

export default Dashboard;
