import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { FiAlertCircle, FiBriefcase, FiDroplet, FiUsers } from "react-icons/fi";
import { TbSteeringWheel } from "react-icons/tb";

function resolveStatusColor(status) {
  if (!status) return "gray";
  const normalized = String(status).toLowerCase();
  if (normalized.includes("available")) return "green";
  if (normalized.includes("pending")) return "orange";
  return "red";
}

export default function CarCard({ car, onBook, bookingDisabled = false }) {
  if (!car) return null;

  const specEntries = Array.isArray(car.specification) ? car.specification : [];
  const specMap = specEntries.reduce((acc, spec) => {
    if (spec && spec.key) acc[spec.key] = spec.value;
    return acc;
  }, {});

  const transmission = specMap.transmission ?? car.raw?.spcs_transmission ?? "—";
  const fuelType = specMap.fuel_type ?? car.raw?.spcs_fuelType ?? "—";
  const seats =
    specMap.seats ??
    (car.raw?.spcs_seats ? `${car.raw.spcs_seats} seats` : null);
  const luggage =
    specMap.luggage_capacity ??
    (car.raw?.spcs_smallBags != null
      ? `${car.raw.spcs_smallBags} small bag${car.raw.spcs_smallBags === 1 ? "" : "s"}`
      : null);

  const companyName =
    car.raw?.company?.name ??
    car.raw?.company_name ??
    car.raw?.company?.display_name ??
    "Partner company";

  const vehicleClass = car.raw?.info_carType ?? car.raw?.info_bodyType ?? null;
  const isAvailable =
    String(car.status || "").toLowerCase().includes("available");

  const displayRate = car.rateAmount
    ? `${car.rateAmount} / ${String(car.rateType || "day").toLowerCase()}`
    : "Rate on request";

  return (
    <Box
      borderWidth="1px"
      borderRadius="24px"
      overflow="hidden"
      bg="white"
      shadow="lg"
      display="flex"
      flexDirection="column"
      transition="all 0.25s ease"
      _hover={{ transform: "translateY(-6px)", shadow: "2xl" }}
    >
      <Stack spacing={0} flex="1">
        <Box px={6} pt={5}>
          <Flex justify="space-between" align="start">
            <Stack spacing={1}>
              <Text
                fontSize="xs"
                color="gray.500"
                textTransform="uppercase"
                letterSpacing="0.08em"
              >
                {companyName}
              </Text>
              <Text fontWeight="semibold" fontSize="lg">
                {car.name}
              </Text>
            </Stack>
            <Stack align="flex-end" spacing={2}>
              {vehicleClass && (
                <Badge
                  colorScheme="purple"
                  borderRadius="full"
                  px={3}
                  py={1}
                  textTransform="capitalize"
                >
                  {vehicleClass}
                </Badge>
              )}
              <Badge
                colorScheme={resolveStatusColor(car.status)}
                borderRadius="full"
                px={3}
                py={1}
              >
                {car.status}
              </Badge>
            </Stack>
          </Flex>
        </Box>

        <Box px={6} pt={4}>
          <Box
            bg="gray.100"
            borderRadius="16px"
            position="relative"
            overflow="hidden"
          >
            <Image
              src={car.image}
              alt={car.name}
              h="160px"
              w="100%"
              objectFit="contain"
              fallbackSrc="https://via.placeholder.com/400x260?text=Vehicle"
            />
          </Box>
        </Box>

        <Stack spacing={3} px={6} pt={5}>
          <HStack spacing={4} fontSize="sm" color="gray.600">
            <HStack spacing={1}>
              <Icon as={TbSteeringWheel} />
              <Text>{transmission}</Text>
            </HStack>
            <HStack spacing={1}>
              <Icon as={FiDroplet} />
              <Text>{fuelType}</Text>
            </HStack>
          </HStack>

          <HStack spacing={4} fontSize="sm" color="gray.600">
            {seats && (
              <HStack spacing={1}>
                <Icon as={FiUsers} />
                <Text>{seats}</Text>
              </HStack>
            )}
            {luggage && (
              <HStack spacing={1}>
                <Icon as={FiBriefcase} />
                <Text>{luggage}</Text>
              </HStack>
            )}
          </HStack>
        </Stack>

        <Divider mt={4} />

        <Stack spacing={4} px={6} py={5}>
          <Flex align="center" justify="space-between">
            <Stack spacing={0}>
              <Text fontSize="xs" color="gray.500">
                Starting from
              </Text>
              <Text fontSize="2xl" fontWeight="extrabold" color="blue.700">
                {displayRate}
              </Text>
            </Stack>
            <Tooltip
              label={
                car.next_available_window
                  ? `Next available: ${car.next_available_window.start || ""} - ${
                      car.next_available_window.end || ""
                    }`
                  : "Up to date as of now"
              }
            >
              <Badge
                colorScheme={isAvailable ? "green" : "orange"}
                borderRadius="full"
                px={3}
                py={1}
              >
                {isAvailable ? "Instant request" : "Check availability"}
              </Badge>
            </Tooltip>
          </Flex>

          <Button
            height="48px"
            fontWeight="bold"
            bgGradient="linear(to-r, #1D4ED8, #2563EB)"
            color="white"
            borderRadius="full"
            onClick={() => onBook?.(car)}
            isDisabled={bookingDisabled || !isAvailable}
            _hover={{
              bgGradient: "linear(to-r, #1E3A8A, #1D4ED8)",
              transform: "translateY(-1px)",
            }}
            _active={{ transform: "translateY(0)" }}
          >
            {isAvailable ? "Rent now" : "Join waitlist"}
          </Button>

          {!isAvailable && (
            <HStack spacing={2} color="orange.500" fontSize="sm">
              <Icon as={FiAlertCircle} />
              <Text>
                We will notify the owner when this vehicle becomes available.
              </Text>
            </HStack>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
