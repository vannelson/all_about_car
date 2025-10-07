import { Box, HStack, Text, Button, Icon, Tooltip } from "@chakra-ui/react";
import { FiCalendar, FiX } from "react-icons/fi";

export default function ActiveDateFilterBanner({ start, end, availability = "", onClear }) {
  const hasAvailability = String(availability || "").length > 0;
  const availLabel = hasAvailability ? String(availability) : "All";
  const availColor = !hasAvailability ? "gray.400" : availability === "available" ? "green.500" : "red.500";

  const format = (d) => {
    try {
      return new Date(d).toLocaleString();
    } catch {
      return String(d);
    }
  };

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      px={3}
      py={2}
      mb={2}
      borderRadius="md"
      shadow="sm"
      _dark={{ bg: "gray.800", borderColor: "gray.700" }}
    >
      <HStack justify="space-between" align="center">
        <HStack spacing={4} align="center">
          <HStack spacing={2} color="blue.600" _dark={{ color: "blue.300" }}>
            <Icon as={FiCalendar} />
            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
              Calendar Filter
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.200" }}>
            {format(start)} <Text as="span" mx={1} color="gray.500">→</Text> {format(end)}
          </Text>
          <HStack spacing={2}>
            <Box w={2} h={2} borderRadius="full" bg={availColor} />
            <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.200" }} textTransform="capitalize">
              {availLabel}
            </Text>
          </HStack>
        </HStack>
        <Tooltip label="Clear calendar filter" hasArrow>
          <Button size="xs" variant="outline" leftIcon={<FiX />} onClick={onClear}>
            Clear
          </Button>
        </Tooltip>
      </HStack>
    </Box>
  );
}

