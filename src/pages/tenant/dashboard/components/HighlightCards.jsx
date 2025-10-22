import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Skeleton,
  SkeletonText,
  Stack,
  Tag,
  Text,
} from "@chakra-ui/react";
import { FiCalendar, FiCreditCard, FiTrendingUp } from "react-icons/fi";

const HIGHLIGHT_ACCENT_MAP = {
  blue: {
    overlay:
      "linear-gradient(135deg, rgba(238, 244, 255, 0.92), rgba(212, 233, 255, 0.88))",
    pattern: "url('/card/bg_blue_card.png')",
    patternSize: "145% 145%",
    patternPosition: "110% 40%",
    patternRepeat: "no-repeat",
    iconBg: "rgba(37, 99, 235, 0.18)",
    iconColor: "#1d4ed8",
    border: "rgba(37, 99, 235, 0.18)",
  },
  purple: {
    overlay:
      "linear-gradient(135deg, rgba(248, 243, 255, 0.94), rgba(236, 221, 255, 0.88))",
    pattern: "url('/card/bg_purple_card.png')",
    patternSize: "150% 150%",
    patternPosition: "108% 45%",
    patternRepeat: "no-repeat",
    iconBg: "rgba(139, 92, 246, 0.18)",
    iconColor: "#6d28d9",
    border: "rgba(139, 92, 246, 0.18)",
  },
  amber: {
    overlay:
      "linear-gradient(135deg, rgba(255, 250, 235, 0.95), rgba(253, 241, 178, 0.88))",
    pattern:
      "radial-gradient(circle at 88% 28%, rgba(251, 191, 36, 0.28) 0%, rgba(251, 191, 36, 0) 60%), radial-gradient(circle at 12% 110%, rgba(253, 230, 138, 0.22) 0%, rgba(253, 230, 138, 0) 60%)",
    patternSize: "200% 200%",
    patternPosition: "120% 70%",
    patternRepeat: "no-repeat",
    iconBg: "rgba(251, 191, 36, 0.18)",
    iconColor: "#b45309",
    border: "rgba(251, 191, 36, 0.24)",
  },
};

const DEFAULT_ICON = FiTrendingUp;

export function HighlightStatCard({
  title,
  value,
  subtitle,
  icon = DEFAULT_ICON,
  accent = "blue",
  meta,
  footer,
}) {
  const accentStyles = HIGHLIGHT_ACCENT_MAP[accent] ?? HIGHLIGHT_ACCENT_MAP.blue;
  const backgroundLayers = [
    accentStyles.overlay,
    accentStyles.pattern,
  ].filter(Boolean);

  return (
    <Box
      position="relative"
      p={{ base: 4, md: 5 }}
      borderRadius="xl"
      bg="white"
      borderWidth="1px"
      borderColor={accentStyles.border}
      boxShadow="sm"
      overflow="hidden"
      minH="165px"
      backgroundImage={backgroundLayers.join(", ")}
      backgroundRepeat={
        backgroundLayers.length > 1
          ? `no-repeat, ${accentStyles.patternRepeat || "no-repeat"}`
          : "no-repeat"
      }
      backgroundSize={
        backgroundLayers.length > 1
          ? `100% 100%, ${accentStyles.patternSize || "180% 180%"}`
          : "100% 100%"
      }
      backgroundPosition={
        backgroundLayers.length > 1
          ? `center, ${accentStyles.patternPosition || "120% 60%"}`
          : "center"
      }
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{ transform: "translateY(-3px)", boxShadow: "lg" }}
    >
      <Stack spacing={4} position="relative" zIndex={1}>
        <Flex justify="space-between" align="flex-start">
          <Stack spacing={2} pr={4}>
            <Text fontSize="sm" color="gray.500" fontWeight="medium">
              {title}
            </Text>
            <Heading size="lg" color="gray.900">
              {value}
            </Heading>
            {subtitle ? (
              <Text fontSize="xs" color="gray.500">
                {subtitle}
              </Text>
            ) : null}
          </Stack>
          {icon ? (
            <Flex
              align="center"
              justify="center"
              boxSize="50px"
              borderRadius="full"
              bgGradient={`linear(to-br, ${accentStyles.iconBg}, rgba(255,255,255,0.6))`}
              color={accentStyles.iconColor}
              borderWidth="1px"
              borderColor="rgba(255,255,255,0.4)"
              boxShadow="0 8px 20px rgba(15, 23, 42, 0.12)"
            >
              <Icon as={icon} boxSize="22px" />
            </Flex>
          ) : null}
        </Flex>

        {meta ? <Box>{meta}</Box> : null}

        {footer ? (
          <Text fontSize="xs" color="gray.500">
            {footer}
          </Text>
        ) : null}
      </Stack>
    </Box>
  );
}

export function HighlightStatCardSkeleton({ accent = "blue" }) {
  const accentStyles = HIGHLIGHT_ACCENT_MAP[accent] ?? HIGHLIGHT_ACCENT_MAP.blue;
  const backgroundLayers = [
    accentStyles.overlay,
    accentStyles.pattern,
  ].filter(Boolean);

  return (
    <Box
      position="relative"
      p={{ base: 4, md: 5 }}
      borderRadius="xl"
      bg="white"
      borderWidth="1px"
      borderColor={accentStyles.border}
      boxShadow="sm"
      overflow="hidden"
      minH="165px"
      backgroundImage={backgroundLayers.join(", ")}
      backgroundRepeat={
        backgroundLayers.length > 1
          ? `no-repeat, ${accentStyles.patternRepeat || "no-repeat"}`
          : "no-repeat"
      }
      backgroundSize={
        backgroundLayers.length > 1
          ? `100% 100%, ${accentStyles.patternSize || "180% 180%"}`
          : "100% 100%"
      }
      backgroundPosition={
        backgroundLayers.length > 1
          ? `center, ${accentStyles.patternPosition || "120% 60%"}`
          : "center"
      }
    >
      <Stack spacing={4} position="relative" zIndex={1}>
        <Flex justify="space-between" align="flex-start">
          <Stack spacing={2} flex="1">
            <Skeleton height="10px" width="40%" />
            <Skeleton height="20px" width="60%" />
            <Skeleton height="10px" width="50%" />
          </Stack>
          <Skeleton boxSize="48px" borderRadius="full" />
        </Flex>
        <SkeletonText mt={2} noOfLines={2} spacing="3" />
      </Stack>
    </Box>
  );
}

export const HIGHLIGHT_ICON_MAP = {
  revenue: FiTrendingUp,
  bookings: FiCalendar,
  availability: FiCreditCard,
};
