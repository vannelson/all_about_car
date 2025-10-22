import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import { safeNumber } from "../formatters";

function SummaryStat({ label, value, sublabel }) {
  return (
    <Box
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.100"
      bg="gray.50"
      p={4}
    >
      <Text fontSize="xs" textTransform="uppercase" color="gray.500" mb={1}>
        {label}
      </Text>
      <Text fontWeight="semibold" color="gray.800">
        {value ?? "--"}
      </Text>
      {sublabel ? (
        <Text fontSize="xs" color="gray.500" mt={1}>
          {sublabel}
        </Text>
      ) : null}
    </Box>
  );
}

const defaultCurrencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatCurrencyValue = (value, formatter) => {
  if (value === null || value === undefined) return "--";
  try {
    return (formatter?.format || defaultCurrencyFormatter.format)(value);
  } catch {
    return defaultCurrencyFormatter.format(value);
  }
};

const formatPercentValue = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) return "--";
  return `${value.toFixed(1)}%`;
};

const tooltipRenderer = (formatter) => ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="gray.100"
      borderRadius="md"
      px={3}
      py={2}
      boxShadow="lg"
    >
      <Text fontWeight="semibold" color="gray.800" mb={1}>
        {label}
      </Text>
      <Stack spacing={1}>
        {payload.map((entry) => (
          <HStack key={entry.dataKey} spacing={2}>
            <Box boxSize="10px" borderRadius="full" bg={entry.color} />
            <Text fontSize="sm" color="gray.600">
              {entry.name}: {formatCurrencyValue(entry.value, formatter)}
            </Text>
          </HStack>
        ))}
      </Stack>
    </Box>
  );
};

function YearComparisonModal({
  isOpen,
  onClose,
  data = [],
  summary = {},
  currencyFormatter,
  compactCurrencyFormatter,
  currentLabel,
  previousLabel,
}) {
  const formattedData = Array.isArray(data)
    ? data.map((item) => ({
        month: item?.month || "",
        current: safeNumber(item?.currentYear) ?? 0,
        previous: safeNumber(item?.previousYear) ?? 0,
      }))
    : [];

  const currentRevenue = formatCurrencyValue(
    safeNumber(summary.currentRevenue),
    currencyFormatter
  );
  const previousRevenue = formatCurrencyValue(
    safeNumber(summary.previousRevenue),
    currencyFormatter
  );
  const revenueDelta = formatPercentValue(safeNumber(summary.revenueDelta));

  const currentBookings =
    summary.currentBookings != null
      ? summary.currentBookings.toLocaleString()
      : "--";
  const previousBookings =
    summary.previousBookings != null
      ? summary.previousBookings.toLocaleString()
      : "--";
  const bookingDelta = formatPercentValue(safeNumber(summary.bookingDelta));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Year comparison</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={6}>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
              <SummaryStat
                label="Current revenue"
                value={currentRevenue}
                sublabel={currentLabel ? `Period: ${currentLabel}` : undefined}
              />
              <SummaryStat
                label="Previous revenue"
                value={previousRevenue}
                sublabel={
                  previousLabel ? `Period: ${previousLabel}` : undefined
                }
              />
              <SummaryStat
                label="Revenue change"
                value={revenueDelta}
              />
              <SummaryStat
                label="Bookings change"
                value={bookingDelta}
              />
              <SummaryStat
                label="Bookings (current)"
                value={currentBookings}
              />
              <SummaryStat
                label="Bookings (previous)"
                value={previousBookings}
              />
            </SimpleGrid>

            {formattedData.length ? (
              <Box height="320px">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formattedData}>
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
                      content={tooltipRenderer(currencyFormatter)}
                    />
                    <Legend />
                    <Bar
                      dataKey="current"
                      name={currentLabel || "Current"}
                      fill="#2563eb"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={36}
                    />
                    <Bar
                      dataKey="previous"
                      name={previousLabel || "Previous"}
                      fill="#94a3b8"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={36}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box
                borderRadius="lg"
                borderWidth="1px"
                borderColor="gray.100"
                bg="gray.50"
                p={6}
                textAlign="center"
              >
                <Text fontSize="sm" color="gray.500">
                  No comparison data available.
                </Text>
              </Box>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default YearComparisonModal;
