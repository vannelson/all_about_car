import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";
import { Calendar, Clock } from "lucide-react"; // ✅ cleaner outline icons
import React from "react";

const CarRates = ({ rates = [] }) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const bg = useColorModeValue("white", "gray.800");

  // Pick active daily/hourly rate from API
  const normalized = React.useMemo(() => {
    if (!Array.isArray(rates)) return {};
    const active = rates.find(
      (r) => String(r.status).toLowerCase() === "active"
    );
    if (!active) return {};
    const amount = Number(active.rate ?? active.amount ?? 0);
    return { [active.rate_type]: Number.isFinite(amount) ? amount : 0 };
  }, [rates]);

  // Show only the active type
  const config = [
    { key: "daily", label: "Daily", icon: Calendar, unit: "Daily" },
    { key: "hourly", label: "Hourly", icon: Clock, unit: "Hourly" },
  ].filter((c) => normalized[c.key] > 0);

  if (!config.length) return null;

  const rate = config[0];
  const Icon = rate.icon;
  const price = normalized[rate.key].toLocaleString();

  return (
    <Box
      mt={3}
      p={3}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      bg={bg}
    >
      <Flex align="center" justify="space-between">
        <Text fontSize="sm" color={subTextColor}>
          Rate
        </Text>
        <Flex align="center" gap={2}>
          <Calendar size={15} />
          <Text fontWeight="semibold" fontSize="sm" color={textColor}>
            ₱ {price}
            <Text as="span" fontSize="xs" color={subTextColor} ml={1}>
              {rate.unit}
            </Text>
          </Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CarRates;
