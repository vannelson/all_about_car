import {
  Box,
  Flex,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";

import { ACTIVITY_ACCENT_MAP } from "../constants";

const ICON_MAP = {
  success: FiCheckCircle,
  warning: FiAlertTriangle,
  info: FiInfo,
};

function ActivityTimeline({ items }) {
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <Box
        borderRadius="xl"
        borderWidth="1px"
        borderColor="gray.100"
        p={6}
        textAlign="center"
        color="gray.500"
        bg="gray.50"
      >
        No recent activity logged.
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      {items.map((item, idx) => {
        const accent = ACTIVITY_ACCENT_MAP[item.type] || ACTIVITY_ACCENT_MAP.info;
        const IconComponent = ICON_MAP[item.type] || ICON_MAP.info;

        return (
          <Box
            key={`${item.title}-${idx}`}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={accent.border}
            bg={accent.bg}
            px={4}
            py={4}
          >
            <HStack spacing={3} align="flex-start">
              <Flex
                align="center"
                justify="center"
                boxSize="36px"
                borderRadius="full"
                bg="white"
                borderWidth="1px"
                borderColor={accent.border}
              >
                <Icon as={IconComponent} color={accent.color} />
              </Flex>
              <Stack spacing={1} flex={1}>
                <HStack justify="space-between" align="baseline">
                  <Text fontWeight="semibold" color="gray.900">
                    {item.title}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {item.time}
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  {item.description}
                </Text>
              </Stack>
            </HStack>
          </Box>
        );
      })}
    </Stack>
  );
}

export default ActivityTimeline;
