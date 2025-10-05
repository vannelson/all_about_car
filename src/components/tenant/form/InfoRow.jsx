import { HStack, Text, Icon, useColorModeValue } from "@chakra-ui/react";

export default function InfoRow({ icon, label, value, emphasize = false, px = 2 }) {
  const border = useColorModeValue("gray.100", "gray.700");
  const labelColor = useColorModeValue("gray.600", "gray.300");
  const valueColor = emphasize ? "green.600" : useColorModeValue("gray.800", "gray.100");
  return (
    <HStack justify="space-between" py={2} px={px} borderBottom="1px solid" borderColor={border}>
      <HStack spacing={2} color={labelColor}>
        {icon ? <Icon as={icon} boxSize={4} /> : null}
        <Text fontSize="sm">{label}</Text>
      </HStack>
      <Text fontWeight={emphasize ? "bold" : "semibold"} color={valueColor}>
        {value}
      </Text>
    </HStack>
  );
}

