import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { FiArrowRight, FiClock, FiDollarSign, FiMapPin } from "react-icons/fi";

import {
  BOOKING_ACCENT_MAP,
  STATUS_COLOR_MAP,
  STATUS_VARIANT_MAP,
} from "../constants";
import { formatCurrency } from "../formatters";
import UpcomingBookingsSkeleton from "./UpcomingBookingsSkeleton";

const fallbackRoute = (pickup, dropoff) => {
  if (pickup && dropoff) return `${pickup} → ${dropoff}`;
  return pickup || dropoff || "Route to be confirmed";
};

function UpcomingBookingCard({ booking }) {
  const accent =
    BOOKING_ACCENT_MAP[booking.status] || BOOKING_ACCENT_MAP.default;
  const statusColor = STATUS_COLOR_MAP[booking.status] || "gray";
  const statusVariant = STATUS_VARIANT_MAP[booking.status] || "subtle";
  const formattedValue =
    typeof booking.value === "number"
      ? formatCurrency(booking.value, booking.currency)
      : "Awaiting quote";
  const routeValue = fallbackRoute(booking.pickup, booking.dropoff);

  return (
    <Box
      position="relative"
      borderRadius="xl"
      borderWidth="1px"
      borderColor={accent.border}
      bgGradient={accent.gradient}
      boxShadow="sm"
      p={{ base: 4, md: 5 }}
      overflow="hidden"
      transition="all 0.25s ease"
      _hover={{ boxShadow: "lg", transform: "translateY(-3px)" }}
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        bottom={0}
        width="6px"
        bgGradient={`linear(to-b, ${accent.highlight}, transparent)`}
      />

      <Stack spacing={4} position="relative" zIndex={1}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={4}
        >
          <Stack spacing={2}>
            <HStack spacing={2} flexWrap="wrap">
              <Tag
                size="sm"
                variant="solid"
                colorScheme="gray"
                borderRadius="full"
              >
                {booking.id}
              </Tag>
              <Tag
                colorScheme={statusColor}
                variant={statusVariant}
                borderRadius="full"
                px={3}
                py={0.5}
              >
                {booking.status || "Scheduled"}
              </Tag>
            </HStack>
            <Text fontWeight="semibold" color="gray.900" fontSize="md">
              {booking.guest || "Unassigned guest"}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {booking.unit || "Vehicle to be confirmed"}
            </Text>
            {booking.guestPhone ? (
              <Text fontSize="xs" color="gray.500">
                {booking.guestPhone}
              </Text>
            ) : null}
          </Stack>

          <Stack
            spacing={1.5}
            align={{ base: "flex-start", md: "flex-end" }}
            bg="whiteAlpha.700"
            borderRadius="lg"
            borderWidth="1px"
            borderColor="rgba(148, 163, 184, 0.18)"
            px={3}
            py={2}
            minW={{ base: "full", md: "220px" }}
          >
            <HStack spacing={2} color="gray.500" fontSize="xs">
              <Icon as={FiClock} />
              <Text fontWeight="semibold" textTransform="uppercase">
                Pickup window
              </Text>
            </HStack>
            <Text fontWeight="semibold" color="gray.800">
              {booking.pickupLabel || "TBD"}
            </Text>
            {booking.pickup ? (
              <HStack spacing={2} color="gray.500" fontSize="xs">
                <Icon as={FiMapPin} />
                <Text>{booking.pickup}</Text>
              </HStack>
            ) : null}
          </Stack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
          <InfoCell
            icon={FiClock}
            label="Pickup"
            value={booking.pickupLabel || booking.pickupTime}
            accentColor={accent.highlight}
          />
          <InfoCell
            icon={FiMapPin}
            label="Route"
            value={routeValue}
            accentColor={accent.highlight}
          />
          <InfoCell
            icon={FiDollarSign}
            label="Est. value"
            value={formattedValue}
            accentColor={accent.highlight}
          />
        </SimpleGrid>

        <Flex
          justify="space-between"
          align={{ base: "flex-start", sm: "center" }}
          direction={{ base: "column", sm: "row" }}
          gap={3}
          fontSize="sm"
        >
          <HStack spacing={2} color="gray.500">
            <Icon as={FiArrowRight} color={accent.highlight} />
            <Text>
              {booking.instructions ||
                booking.dropoffLabel ||
                "Prepare concierge handoff"}
            </Text>
          </HStack>
          <HStack
            spacing={1.5}
            color={accent.highlight}
            fontWeight="semibold"
            cursor="pointer"
          >
            <Text fontSize="sm">Open booking</Text>
            <Icon as={FiArrowRight} />
          </HStack>
        </Flex>
      </Stack>
    </Box>
  );
}

function InfoCell({ icon, label, value, accentColor }) {
  return (
    <Stack
      spacing={1.5}
      p={3}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="rgba(148, 163, 184, 0.18)"
      bg="whiteAlpha.700"
      backdropFilter="blur(4px)"
      minH="82px"
    >
      <HStack spacing={1.5} color="gray.500">
        <Icon as={icon} boxSize="12px" color={accentColor || "gray.400"} />
        <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase">
          {label}
        </Text>
      </HStack>
      <Text fontSize="sm" fontWeight="semibold" color="gray.800">
        {value || "--"}
      </Text>
    </Stack>
  );
}

function UpcomingBookingsSection({
  items,
  isLoading,
  error,
  windowLabel,
  totals,
  generatedAtLabel,
}) {
  return (
    <Stack spacing={4}>
      <Flex
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Stack spacing={1} flex="1">
          <HStack spacing={2} color="gray.500">
            <Icon as={FiClock} />
            <Text fontSize="sm" fontWeight="medium">
              Next up
            </Text>
          </HStack>
          <HStack spacing={2} flexWrap="wrap">
            {windowLabel ? (
              <Tag
                size="sm"
                variant="subtle"
                colorScheme="blue"
                borderRadius="full"
              >
                {windowLabel}
              </Tag>
            ) : null}
            {totals?.scheduled != null ? (
              <Tag
                size="sm"
                variant="subtle"
                colorScheme="green"
                borderRadius="full"
              >
                {`${totals.scheduled} scheduled`}
              </Tag>
            ) : null}
            {totals?.waitlisted ? (
              <Tag
                size="sm"
                variant="subtle"
                colorScheme="yellow"
                borderRadius="full"
              >
                {`${totals.waitlisted} waitlisted`}
              </Tag>
            ) : null}
          </HStack>
          {generatedAtLabel ? (
            <Text fontSize="xs" color="gray.400">
              Updated {generatedAtLabel}
            </Text>
          ) : null}
        </Stack>
        <Button size="xs" variant="outline">
          See calendar
        </Button>
      </Flex>

      {error ? (
        <Alert status="error" variant="subtle" borderRadius="lg">
          <AlertIcon />
          {error}
        </Alert>
      ) : null}

      {isLoading ? (
        <UpcomingBookingsSkeleton />
      ) : items?.length ? (
        <Stack spacing={4}>
          {items.map((booking) => (
            <UpcomingBookingCard key={booking.id} booking={booking} />
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
          No upcoming bookings scheduled.
        </Box>
      )}
    </Stack>
  );
}

export default UpcomingBookingsSection;
