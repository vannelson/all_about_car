import { Box, Text, Stack, Flex, Divider } from "@chakra-ui/react";
import { FaClock, FaCalendarDay } from "react-icons/fa";
import React from "react";

const CarRates = ({ rateAmount, rateType, direction = "horizontal" }) => {
  const rates = [
    {
      key: "Day",
      label: "Daily",
      icon: FaCalendarDay,
      unit: "/day",
    },
    {
      key: "Hour",
      label: "Hourly",
      icon: FaClock,
      unit: "/hr",
    },
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
        {rates.map((rate, idx) => {
          const Icon = rate.icon;
          const price = rateType === rate.key ? rateAmount : 300;

          const item =
            direction === "horizontal" ? (
              <Flex align="center" gap={1}>
                <Icon size={14} color="#4A5568" />
                <Text fontSize="md" color="gray.600">
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
              {direction === "horizontal" && idx < rates.length - 1 && (
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
