import { Box, HStack, Text, Badge, Button, Icon, Tooltip } from "@chakra-ui/react";
import { FiCalendar, FiX } from "react-icons/fi";

export default function ActiveDateFilterBanner({ start, end, availability = "", onClear }) {
  const hasAvailability = String(availability || "").length > 0;
  const availLabel = hasAvailability ? String(availability) : "All";
  const availScheme = !hasAvailability ? "gray" : availability === "available" ? "green" : "red";

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
        <HStack spacing={3} align="center">
          <HStack spacing={2} color="blue.600" _dark={{ color: "blue.300" }}>
            <Icon as={FiCalendar} />
            <Badge colorScheme="blue" variant="subtle">Calendar Filter</Badge>
          </HStack>
          <Text fontSize="sm" color="gray.700" _dark={{ color: "gray.200" }}>
            {format(start)} 
            <Text as="span" mx={1} color="gray.500">→</Text>
            {format(end)}
          </Text>
          <Badge colorScheme={availScheme} textTransform="capitalize">{availLabel}</Badge>
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

