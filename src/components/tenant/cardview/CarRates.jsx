import {
  Box,
  Text,
  Stack,
  Flex,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaClock, FaCalendarDay } from "react-icons/fa";
import React from "react";

// Props:
// - rates: { daily?: number, hourly?: number }
// - direction: 'horizontal' | 'vertical'
// - hideZero?: boolean — optional: hide items with 0 value
const CarRates = ({
  rates = {},
  direction = "horizontal",
  hideZero = false,
}) => {
  const config = [
    { key: "daily", label: "Daily", icon: FaCalendarDay, unit: "/day" },
    { key: "hourly", label: "Hourly", icon: FaClock, unit: "/hr" },
  ];

  const borderColor = useColorModeValue("gray.300", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const subTextColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Box mt={3}>
      <Stack
        direction={direction === "horizontal" ? "row" : "column"}
        spacing={direction === "horizontal" ? 6 : 3}
        p={4}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="lg"
        align="center"
        justify="center"
        bg={useColorModeValue("white", "gray.800")}
        boxShadow="sm"
      >
        {config.map((rate, idx) => {
          const Icon = rate.icon;
          const amount = Number(rates[rate.key]) || 0;

          if (hideZero && amount === 0) return null;

          const price = amount.toLocaleString();

          const content =
            direction === "horizontal" ? (
              <Flex align="center" gap={2}>
                <Icon size={16} color={subTextColor} />
                <Text fontWeight="bold" fontSize="md" color={textColor}>
                  ₱{price}
                </Text>
                <Text fontSize="sm" color={subTextColor}>
                  {rate.unit}
                </Text>
              </Flex>
            ) : (
              <Flex align="center" justify="space-between" w="100%">
                <Flex align="center" gap={2}>
                  <Icon size={16} color={subTextColor} />
                  <Text color={subTextColor} fontSize="sm">
                    {rate.label}
                  </Text>
                </Flex>
                <Text fontWeight="bold" color={textColor}>
                  ₱{price}
                  <Text as="span" fontSize="sm" color={subTextColor} ml={1}>
                    {rate.unit}
                  </Text>
                </Text>
              </Flex>
            );

          return (
            <React.Fragment key={rate.key}>
              {content}
              {direction === "horizontal" &&
                idx < config.length - 1 &&
                (!hideZero ||
                  (hideZero && Number(rates[config[idx + 1]?.key]) > 0)) && (
                  <Divider
                    orientation="vertical"
                    h="20px"
                    borderColor={borderColor}
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
