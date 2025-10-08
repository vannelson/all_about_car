import { Badge, HStack, Icon, Text, Tooltip } from "@chakra-ui/react";
import { FiCalendar } from "react-icons/fi";

export default function NextAvailabilityTag({
  label,
  fallbackLabel = "",
  tooltipLabel,
  showIcon = true,
  ...badgeProps
}) {
  const text = label || fallbackLabel;
  if (!text) return null;

  const badge = (
    <Badge
      display="inline-flex"
      alignItems="center"
      bg="blue.600"
      color="white"
      px={2}
      py={1}
      borderRadius="md"
      fontSize="xs"
      fontWeight="semibold"
      {...badgeProps}
    >
      <HStack spacing={1} align="center">
        {showIcon ? <Icon as={FiCalendar} boxSize={3} /> : null}
        <Text as="span" lineHeight={1} noOfLines={1}>
          {text}
        </Text>
      </HStack>
    </Badge>
  );

  if (tooltipLabel === null) return badge;

  const tooltip = tooltipLabel || `Next availability: ${text}`;
  return (
    <Tooltip label={tooltip} hasArrow placement="top">
      {badge}
    </Tooltip>
  );
}
