import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Skeleton,
  Stack,
  Tag,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiActivity,
  FiInfo,
  FiTrendingDown,
  FiTrendingUp,
} from "react-icons/fi";

const CARD_ACCENT_MAP = {
  blue: {
    gradient:
      "linear-gradient(125deg, rgba(235,245,255,0.95), rgba(212,233,255,0.88))",
    overlay:
      "linear-gradient(135deg, rgba(238, 244, 255, 0.92) 0%, rgba(212, 233, 255, 0.88) 50%, rgba(59, 130, 246, 0.24) 100%)",
    pattern: "url('/card/bg_blue_card.png')",
    patternSize: "145% 145%",
    patternPosition: "110% 40%",
    patternRepeat: "no-repeat",
    iconBg: "rgba(37, 99, 235, 0.18)",
    iconColor: "#1d4ed8",
    border: "rgba(37, 99, 235, 0.18)",
    deltaBg: "rgba(37, 99, 235, 0.16)",
    deltaColor: "#1d4ed8",
  },
  purple: {
    gradient:
      "linear-gradient(125deg, rgba(246,237,255,0.95), rgba(232,221,255,0.86))",
    overlay:
      "linear-gradient(135deg, rgba(248, 243, 255, 0.94) 0%, rgba(236, 221, 255, 0.88) 50%, rgba(168, 85, 247, 0.25) 100%)",
    pattern: "url('/card/bg_purple_card.png')",
    patternSize: "150% 150%",
    patternPosition: "108% 45%",
    patternRepeat: "no-repeat",
    iconBg: "rgba(139,92,246,0.18)",
    iconColor: "#6d28d9",
    border: "rgba(139,92,246,0.18)",
    deltaBg: "rgba(139,92,246,0.16)",
    deltaColor: "#6d28d9",
  },
  mint: {
    gradient:
      "linear-gradient(125deg, rgba(236,253,245,0.95), rgba(209,250,229,0.86))",
    overlay:
      "linear-gradient(135deg, rgba(236, 253, 245, 0.95) 0%, rgba(209, 250, 229, 0.88) 48%, rgba(52, 211, 153, 0.24) 100%)",
    pattern: "url('/card/bg_green_card.png')",
    patternSize: "148% 148%",
    patternPosition: "108% 45%",
    patternRepeat: "no-repeat",
    iconBg: "rgba(16,185,129,0.18)",
    iconColor: "#047857",
    border: "rgba(16,185,129,0.18)",
    deltaBg: "rgba(16,185,129,0.16)",
    deltaColor: "#047857",
  },
  amber: {
    gradient:
      "linear-gradient(125deg, rgba(255,250,235,0.95), rgba(254,243,199,0.86))",
    overlay:
      "linear-gradient(135deg, rgba(255, 250, 235, 0.95) 0%, rgba(253, 241, 178, 0.88) 48%, rgba(250, 204, 21, 0.22) 100%)",
    pattern:
      "radial-gradient(circle at 88% 28%, rgba(251, 191, 36, 0.28) 0%, rgba(251, 191, 36, 0) 60%), radial-gradient(circle at 12% 110%, rgba(253, 230, 138, 0.22) 0%, rgba(253, 230, 138, 0) 60%)",
    patternSize: "200% 200%",
    patternPosition: "120% 70%",
    patternRepeat: "no-repeat",
    iconBg: "rgba(251,191,36,0.18)",
    iconColor: "#b45309",
    border: "rgba(251,191,36,0.2)",
    deltaBg: "rgba(251,191,36,0.18)",
    deltaColor: "#b45309",
  },
};

const DeltaIcon = ({ type }) => {
  if (type === "increase") return <FiTrendingUp />;
  if (type === "decrease") return <FiTrendingDown />;
  return <FiActivity />;
};

export function StatCard({
  label,
  value,
  delta,
  deltaType,
  icon,
  subtitle,
  accent = "blue",
  tooltip,
  description,
  deltaCaption,
  customContent,
  footer,
  onDoubleClick,
  badge,
  badgeColorScheme = "blue",
  badgeVariant = "subtle",
  badgeIcon,
  meta,
}) {
  const baseAccent = CARD_ACCENT_MAP[accent] ?? CARD_ACCENT_MAP.blue;

  const overlayLayer =
    baseAccent.overlay || baseAccent.gradient || CARD_ACCENT_MAP.blue.gradient;
  const patternLayer = baseAccent.pattern
    ? baseAccent.pattern
    : baseAccent.spot
    ? `radial-gradient(circle at 85% 30%, ${baseAccent.spot} 0%, rgba(255,255,255,0) 65%)`
    : null;
  const backgroundLayers = [overlayLayer, patternLayer].filter(Boolean);

  const badgeNode = badge ? (
    <Badge
      px={2.5}
      py={0.5}
      borderRadius="full"
      colorScheme={badgeColorScheme}
      variant={badgeVariant}
      display="inline-flex"
      alignItems="center"
      gap={1}
      fontSize="xs"
      fontWeight="semibold"
      textTransform="none"
    >
      {badgeIcon ? <Icon as={badgeIcon} boxSize="11px" /> : null}
      {badge}
    </Badge>
  ) : null;

  const labelNode = (
    <HStack spacing={1.5}>
      <Text fontSize="sm" color="gray.500" fontWeight="medium">
        {label}
      </Text>
      {tooltip ? <Icon as={FiInfo} boxSize="14px" color="gray.400" /> : null}
    </HStack>
  );

  const labelContent = tooltip ? (
    <Tooltip label={tooltip} hasArrow placement="top-start" openDelay={200}>
      <Box cursor="help">{labelNode}</Box>
    </Tooltip>
  ) : (
    labelNode
  );

  return (
    <Box
      position="relative"
      bg="white"
      borderRadius="xl"
      p={{ base: 4, md: 5 }}
      minH="170px"
      borderWidth="1px"
      borderColor={baseAccent.border}
      boxShadow="sm"
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      overflow="hidden"
      cursor={onDoubleClick ? "zoom-in" : "default"}
      _hover={{ boxShadow: "lg", transform: "translateY(-3px)" }}
      backgroundImage={backgroundLayers.join(", ")}
      backgroundRepeat={
        backgroundLayers.length > 1
          ? `no-repeat, ${baseAccent.patternRepeat || "no-repeat"}`
          : "no-repeat"
      }
      backgroundSize={
        backgroundLayers.length > 1
          ? `100% 100%, ${baseAccent.patternSize || "150% 150%"}`
          : "100% 100%"
      }
      backgroundPosition={
        backgroundLayers.length > 1
          ? `center, ${baseAccent.patternPosition || "115% center"}`
          : "center"
      }
      onDoubleClick={onDoubleClick}
    >
      <Stack spacing={customContent ? 3 : 4} position="relative" zIndex={1}>
        <Flex align="flex-start" justify="space-between" gap={3}>
          <Stack spacing={customContent ? 1.5 : 2} pr={2}>
            {badgeNode}
            {labelContent}
            {!customContent ? (
              <>
                <Heading size="lg" color="gray.900">
                  {value}
                </Heading>
                {description ? (
                  <Text fontSize="xs" color="gray.600">
                    {description}
                  </Text>
                ) : null}
                {meta
                  ? typeof meta === "string"
                    ? (
                        <Text fontSize="xs" color="gray.500">
                          {meta}
                        </Text>
                      )
                    : (
                        <Box fontSize="xs" color="gray.500">
                          {meta}
                        </Box>
                      )
                  : null}
              </>
            ) : null}
          </Stack>

          {icon ? (
            <Flex
              align="center"
              justify="center"
              boxSize="44px"
              borderRadius="full"
              bgGradient={`linear(to-br, ${baseAccent.iconBg}, rgba(255,255,255,0.65))`}
              color={baseAccent.iconColor}
              borderWidth="1px"
              borderColor="rgba(255,255,255,0.6)"
              boxShadow="0 6px 16px rgba(15, 23, 42, 0.12)"
            >
              <Icon as={icon} boxSize="20px" />
            </Flex>
          ) : null}
        </Flex>

        {customContent ? (
          <>
            <Box>{customContent}</Box>
            {meta
              ? typeof meta === "string"
                ? (
                    <Text fontSize="xs" color="gray.500">
                      {meta}
                    </Text>
                  )
                : (
                    <Box fontSize="xs" color="gray.500">
                      {meta}
                    </Box>
                  )
              : null}
          </>
        ) : (
          <Stack spacing={2}>
            {subtitle ? (
              <Text fontSize="xs" color="gray.600">
                {subtitle}
              </Text>
            ) : null}
            {(delta || deltaCaption) && (
              <HStack spacing={2} align="center" flexWrap="wrap">
                {delta ? (
                  <Tag
                    size="sm"
                    borderRadius="full"
                    px={3}
                    py={1}
                    bg={baseAccent.deltaBg}
                    color={baseAccent.deltaColor}
                    fontWeight="semibold"
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                  >
                    <DeltaIcon type={deltaType} />
                    <Text>{delta}</Text>
                  </Tag>
                ) : null}
                {deltaCaption ? (
                  <Text fontSize="xs" color="gray.600">
                    {deltaCaption}
                  </Text>
                ) : null}
              </HStack>
            )}
            {footer
              ? typeof footer === "string"
                ? (
                    <Text fontSize="xs" color="gray.500">
                      {footer}
                    </Text>
                  )
                : (
                    <Box fontSize="xs" color="gray.500">
                      {footer}
                    </Box>
                  )
              : null}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export function StatCardSkeleton({ accent = "blue" }) {
  const baseAccent = CARD_ACCENT_MAP[accent] ?? CARD_ACCENT_MAP.blue;
  const overlayLayer =
    baseAccent.overlay || baseAccent.gradient || CARD_ACCENT_MAP.blue.gradient;
  const patternLayer = baseAccent.pattern
    ? baseAccent.pattern
    : baseAccent.spot
    ? `radial-gradient(circle at 90% 25%, ${baseAccent.spot} 0%, rgba(255,255,255,0) 60%)`
    : null;
  const backgroundLayers = [overlayLayer, patternLayer].filter(Boolean);

  return (
    <Box
      position="relative"
      bg="white"
      borderRadius="xl"
      p={{ base: 4, md: 5 }}
      minH="170px"
      borderWidth="1px"
      borderColor={baseAccent.border}
      boxShadow="sm"
      backgroundImage={backgroundLayers.join(", ")}
      backgroundRepeat={
        backgroundLayers.length > 1
          ? `no-repeat, ${baseAccent.patternRepeat || "no-repeat"}`
          : "no-repeat"
      }
      backgroundSize={
        backgroundLayers.length > 1
          ? `100% 100%, ${baseAccent.patternSize || "160% 160%"}`
          : "100% 100%"
      }
      backgroundPosition={
        backgroundLayers.length > 1
          ? `center, ${baseAccent.patternPosition || "120% 60%"}`
          : "center"
      }
      overflow="hidden"
    >
      <Stack spacing={3}>
        <Flex align="flex-start" justify="space-between" gap={3}>
          <Stack spacing={2.5} flex="1">
            <Skeleton height="16px" width="36%" borderRadius="full" />
            <Skeleton height="12px" width="45%" />
            <Skeleton height="28px" width="65%" />
            <Skeleton height="10px" width="55%" />
          </Stack>
          <Skeleton boxSize="44px" borderRadius="full" />
        </Flex>
        <Stack spacing={2}>
          <Skeleton height="10px" width="70%" />
          <Skeleton height="10px" width="55%" />
          <Skeleton height="10px" width="60%" />
          <Skeleton height="10px" width="45%" />
        </Stack>
      </Stack>
    </Box>
  );
}

export default StatCard;
