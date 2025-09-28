import {
  Box,
  Text,
  VStack,
  Heading,
  HStack,
  Flex,
  Divider,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  FaGasPump,
  FaCogs,
  FaSuitcase,
  FaUsers,
  FaCalendarAlt,
  FaSuitcaseRolling,
  FaTachometerAlt,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

const DEFAULT_SPECS = [
  { icon: FaCalendarAlt, label: "0 - 3 year(s) old" },
  { icon: FaUsers, label: "5 seats" },
  { icon: FaSuitcaseRolling, label: "1 large bag" },
  { icon: FaSuitcase, label: "2 small bags" },
  { icon: FaCogs, label: "1998 cc engine" },
  { icon: FaCogs, label: "Automatic" },
  { icon: FaGasPump, label: "Petrol" },
  { icon: FaTachometerAlt, label: "7.6L / 100km" },
];

const DEFAULT_OTHER = [
  "Keyless entry",
  "5 Star ANCAP Rating",
  '8" Touchscreen Entertainment',
  "Apple Carplay and Android Auto",
  "Bluetooth Audio",
];

const fallbackIcon = FaCogs;

function iconForKey(key = "") {
  const k = String(key).toLowerCase();
  if (k.includes("seat")) return FaUsers;
  if ((k.includes("large") && k.includes("bag")) || k.includes("largebags"))
    return FaSuitcaseRolling;
  if ((k.includes("small") && k.includes("bag")) || k.includes("smallbags") || k.includes("luggage"))
    return FaSuitcase;
  if (k.includes("engine")) return FaCogs;
  if (k.includes("transmission")) return FaCogs;
  if (k.includes("fuel") && k.includes("efficiency")) return FaTachometerAlt;
  if (k.includes("fuel")) return FaGasPump;
  if (k.includes("age") || k.includes("year")) return FaCalendarAlt;
  return fallbackIcon;
}

const CarProfile = ({ specs = DEFAULT_SPECS, otherDesc = DEFAULT_OTHER }) => {
  // Normalize specs: accept strings or {key, value} or {label, icon}
  const normalizedSpecs = (specs || []).map((s) => {
    if (typeof s === "string") return { label: s, icon: fallbackIcon };
    if (s && typeof s === "object")
      return {
        label: s.label || String(s.value || ""),
        icon: s.icon || iconForKey(s.key || s.label || s.value),
      };
    return { label: String(s), icon: fallbackIcon };
  });

  return (
    <Box p={6} pt={5} bg="white" mx="auto" borderRadius="md">
      <Flex gap={8} wrap="wrap">
        {/* Specification List */}
        <Box flex="1">
          <Heading size="md" mb={4} color="gray.800" fontWeight="semibold">
            Specification
          </Heading>
          <SimpleGrid columns={[1, 2]} spacingY={3} spacingX={6}>
            {normalizedSpecs.map((item, idx) => (
              <HStack key={idx} spacing={3} align="center">
                <item.icon size={20} color="#4A5568" />
                <Text fontWeight="semibold" color="gray.700">
                  {item.label}
                </Text>
              </HStack>
            ))}
          </SimpleGrid>
        </Box>

        {/* Other Description List */}
        <Box flex="1">
          <Heading size="md" mb={4} color="gray.800" fontWeight="semibold">
            Other Features
          </Heading>
          <VStack align="flex-start" spacing={3}>
            {otherDesc.map((text, idx) => (
              <HStack key={idx} spacing={3}>
                <FaCheckCircle size={18} color="green" />
                <Text fontWeight="semibold" color="gray.700">
                  {text}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default CarProfile;
