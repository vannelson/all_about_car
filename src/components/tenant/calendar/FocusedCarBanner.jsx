import { Box, HStack, Text, Button } from "@chakra-ui/react";

export default function FocusedCarBanner({ focusedCarId, cars = [], onClear }) {
  if (focusedCarId == null) return null;
  const carName = (cars || []).find((c) => Number(c?.id) === Number(focusedCarId))?.name || `Car #${focusedCarId}`;

  return (
    <Box
      position="absolute"
      top={2}
      right={2}
      zIndex={10}
      bg="white"
      _dark={{ bg: "gray.800", borderColor: "gray.700", color: "gray.100" }}
      border="1px solid"
      borderColor="gray.200"
      px={3}
      py={1.5}
      borderRadius="md"
      shadow="sm"
    >
      <HStack spacing={3}>
        <Text fontSize="sm">Showing schedules for</Text>
        <Text fontSize="sm" fontWeight="semibold">
          {carName}
        </Text>
        <Button size="xs" variant="outline" onClick={onClear}>
          Show All (Esc)
        </Button>
      </HStack>
    </Box>
  );
}

