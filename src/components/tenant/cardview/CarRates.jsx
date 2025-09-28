import { Box, Text, Stack, Flex, Divider } from "@chakra-ui/react";
import { FaClock, FaCalendarDay } from "react-icons/fa";
import React from "react";

// Props:
// - rates: { daily?: number, hourly?: number }
// - direction: 'horizontal' | 'vertical'
// Fallbacks to 0 when not provided.
const CarRates = ({ rates = {}, direction = "horizontal" }) => {
  const config = [
    { key: "daily", label: "Daily", icon: FaCalendarDay, unit: "/day" },
    { key: "hourly", label: "Hourly", icon: FaClock, unit: "/hr" },
  ];

  return (
    <Box mt={2}>
      <Stack
        direction={direction === "horizontal" ? "row" : "column"}
        spacing={direction === "horizontal" ? 8 : 2}
        p={3}
        border="1px solid"
        borderColor="gray.300"
        borderRadius="lg"
        align="center"
        justify="center"
      >
        {config.map((rate, idx) => {
          const Icon = rate.icon;
          const amount = Number(rates[rate.key]) || 0;
          const price = amount.toLocaleString();

          const item =
            direction === "horizontal" ? (
              <Flex align="center" gap={2}>
                <Icon size={14} color="#4A5568" />
                <Text fontSize="md" color="gray.700">
                  ₱{price}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  {rate.unit}
                </Text>
              </Flex>
            ) : (
              <Flex align="center" justify="space-between" w="100%">
                <Flex align="center" gap={2}>
                  <Icon size={14} color="#4A5568" />
                  <Text color="gray.600" fontSize="sm">
                    {rate.label}
                  </Text>
                </Flex>
                <Text fontWeight="semibold" color="gray.800">
                  ₱{price}
                </Text>
              </Flex>
            );

          return (
            <React.Fragment key={rate.key}>
              {item}
              {direction === "horizontal" && idx < config.length - 1 && (
                <Divider
                  orientation="vertical"
                  h="20px"
                  borderColor="gray.300"
                />
              )}
            </React.Fragment>
          );
        })}
      </Stack>
    </Box>
  );
};

export default CarRates;
