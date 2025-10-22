import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { FiActivity, FiTrendingUp } from "react-icons/fi";

import { PERFORMER_CARD_THEMES } from "../constants";
import { formatCurrency } from "../formatters";
import TopPerformersSkeleton from "./TopPerformersSkeleton";

function MetricPill({ label, value, sublabel }) {
  return (
    <Stack
      spacing={1}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="rgba(255,255,255,0.35)"
      bg="whiteAlpha.700"
      backdropFilter="blur(4px)"
      p={3}
    >
      <Text fontWeight="semibold" color="gray.600">
        {label}
      </Text>
      <Text fontWeight="semibold" color="gray.800">
        {value ?? "--"}
      </Text>
      {sublabel ? (
        <Text fontSize="xs" color="gray.500">
          {sublabel}
        </Text>
      ) : null}
    </Stack>
  );
}

function TopPerformerCard({ performer, currency, maxRevenue }) {
  const theme =
    PERFORMER_CARD_THEMES[(performer.rank - 1) % PERFORMER_CARD_THEMES.length];
  const occupancyPercent =
    performer.occupancyRate != null
      ? Math.round(
          Math.min(
            Math.max(
              performer.occupancyRate <= 1
                ? performer.occupancyRate * 100
                : performer.occupancyRate,
              0
            ),
            100
          )
        )
      : null;
  const utilizationPercent =
    performer.utilizationRate != null
      ? Math.round(
          Math.min(
            Math.max(
              performer.utilizationRate <= 1
                ? performer.utilizationRate * 100
                : performer.utilizationRate,
              0
            ),
            100
          )
        )
      : null;
  const revenueShare =
    maxRevenue > 0
      ? Math.round(((performer.revenue || 0) / maxRevenue) * 100)
      : 0;
  const revenueLabel = formatCurrency(performer.revenue, currency);
  const avgDailyRateLabel = performer.avgDailyRate
    ? formatCurrency(performer.avgDailyRate, currency)
    : null;

  return (
    <Box
      borderRadius="xl"
      borderWidth="1px"
      borderColor={theme.border}
      bgGradient={theme.gradient}
      boxShadow={theme.shadow}
      px={4}
      py={5}
      overflow="hidden"
      position="relative"
    >
      <Box
        position="absolute"
        top="-60px"
        right="-60px"
        boxSize="160px"
        bg="rgba(255,255,255,0.18)"
        borderRadius="full"
        filter="blur(0.5px)"
      />

      <Stack spacing={4} position="relative" zIndex={1}>
        <Flex
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <HStack spacing={3} align="flex-start">
            <Avatar
              name={performer.name}
              size="md"
              color="white"
              bg={theme.badge + ".500"}
              src={performer.imageUrl || undefined}
            />
            <Stack spacing={1}>
              <HStack spacing={2}>
                <Tag
                  colorScheme={theme.badge}
                  borderRadius="full"
                  px={3}
                  py={0.5}
                >
                  #{performer.rank}
                </Tag>
                {performer.class ? (
                  <Tag
                    size="sm"
                    variant="subtle"
                    colorScheme="gray"
                    borderRadius="full"
                  >
                    {performer.class}
                  </Tag>
                ) : null}
              </HStack>
              <Text fontWeight="semibold" color="gray.900" fontSize="md">
                {performer.name || "Unnamed unit"}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {performer.plate || "Plate pending"}
              </Text>
            </Stack>
          </HStack>

          <Stack spacing={1} align={{ base: "flex-start", md: "flex-end" }}>
            <Text fontSize="xs" color="gray.500" textTransform="uppercase">
              Revenue
            </Text>
            <Heading size="sm" color="gray.900">
              {revenueLabel ?? "--"}
            </Heading>
            <Text fontSize="xs" color="gray.500">
              {revenueShare}% of leader revenue
            </Text>
          </Stack>
        </Flex>

        <Stack spacing={2}>
          <Flex justify="space-between" fontSize="xs" color="gray.500">
            <HStack spacing={1}>
              <Icon as={FiActivity} />
              <Text>Occupancy</Text>
            </HStack>
            <Text fontWeight="semibold" color="gray.700">
              {occupancyPercent != null ? `${occupancyPercent}%` : "--"}
            </Text>
          </Flex>
          <Box
            height="6px"
            borderRadius="full"
            bg="whiteAlpha.700"
            position="relative"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              bottom={0}
              borderRadius="full"
              bg={`${theme.badge}.400`}
              width={`${occupancyPercent ?? 0}%`}
            />
          </Box>
        </Stack>

        <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3} fontSize="xs">
          <MetricPill
            label="Revenue share"
            value={
              <HStack spacing={1.5} color={theme.badge + ".600"}>
                <Icon as={FiTrendingUp} />
                <Text fontWeight="semibold">{revenueShare}%</Text>
              </HStack>
            }
          />
          <MetricPill
            label="Utilisation"
            value={utilizationPercent != null ? `${utilizationPercent}%` : "--"}
            sublabel={
              occupancyPercent != null ? `${occupancyPercent}% occupancy` : null
            }
          />
          <MetricPill
            label="Bookings"
            value={performer.bookings != null ? performer.bookings : "--"}
            sublabel={
              avgDailyRateLabel ? `Avg rate ${avgDailyRateLabel}` : undefined
            }
          />
        </SimpleGrid>
      </Stack>
    </Box>
  );
}

function TopPerformersSection({
  items,
  isLoading,
  error,
  metricLabel,
  rangeLabel,
  totalsRevenueLabel,
  shareLabel,
  currency,
}) {
  const maxRevenue = Math.max(...(items || []).map((item) => item.revenue || 0), 0);

  return (
    <Stack spacing={4}>
      <Stack spacing={1}>
        <HStack spacing={2} color="gray.500">
          <Icon as={FiTrendingUp} />
          <Text fontSize="sm" fontWeight="medium">
            Top performers
          </Text>
        </HStack>
        <Heading size="sm" color="gray.800">
          {metricLabel}
        </Heading>
        <HStack spacing={2} flexWrap="wrap">
          {rangeLabel ? (
            <Tag size="sm" variant="subtle" colorScheme="blue" borderRadius="full">
              {rangeLabel}
            </Tag>
          ) : null}
          {totalsRevenueLabel ? (
            <Tag
              size="sm"
              variant="subtle"
              colorScheme="purple"
              borderRadius="full"
            >
              {`Revenue: ${totalsRevenueLabel}`}
            </Tag>
          ) : null}
          {shareLabel ? (
            <Tag
              size="sm"
              variant="subtle"
              colorScheme="green"
              borderRadius="full"
            >
              {`Share: ${shareLabel}`}
            </Tag>
          ) : null}
        </HStack>
      </Stack>

      {error ? (
        <Alert status="error" variant="subtle" borderRadius="lg">
          <AlertIcon />
          {error}
        </Alert>
      ) : null}

      {isLoading ? (
        <TopPerformersSkeleton />
      ) : items?.length ? (
        <Stack spacing={4}>
          {items.map((performer) => (
            <TopPerformerCard
              key={`${performer.plate || performer.name}-${performer.rank}`}
              performer={performer}
              currency={currency}
              maxRevenue={maxRevenue}
            />
          ))}
        </Stack>
      ) : (
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
      )}
    </Stack>
  );
}

export default TopPerformersSection;
