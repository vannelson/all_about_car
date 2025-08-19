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

const CarProfile = () => {
  const specs = [
    { icon: FaCalendarAlt, label: "0 - 3 year(s) old" },
    { icon: FaUsers, label: "5 seats" },
    { icon: FaSuitcaseRolling, label: "1 large bag" },
    { icon: FaSuitcase, label: "2 small bags" },
    { icon: FaCogs, label: "1998 cc engine" },
    { icon: FaCogs, label: "Automatic" },
    { icon: FaGasPump, label: "Petrol" },
    { icon: FaTachometerAlt, label: "7.6L / 100km" },
  ];

  const otherDesc = [
    "Keyless entry",
    "5 Star ANCAP Rating",
    '8" Touchscreen Entertainment',
    "Apple Carplay and Android Auto",
    "Bluetooth Audio",
  ];

  return (
    <Box p={6} pt={5} bg="white" mx="auto" borderRadius="md">
      <Flex gap={8} wrap="wrap">
        {/* Specification List */}
        <Box flex="1">
          <Heading size="md" mb={4} color="gray.800" fontWeight="semibold">
            Specification
          </Heading>
          <SimpleGrid columns={[1, 2]} spacingY={3} spacingX={6}>
            {specs.map((item, idx) => (
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
            Other Description
          </Heading>
          <VStack align="flex-start" spacing={3}>
            {otherDesc.map((text, idx) => (
              <HStack key={idx} spacing={3}>
                <FaArrowRight size={18} color="#4A5568" />
                <Text fontWeight="semibold" color="gray.700">
                  {text}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>
      </Flex>

      {/* Why Choose Section */}
      <Box mt={2}>
        <Text fontSize="lg" fontWeight="bold" mb={3}>
          Why choose this vehicle?
        </Text>
        <VStack align="flex-start" spacing={2}>
          <HStack spacing={2}>
            <FaCheckCircle size={18} color="green" />
            <Text fontSize="md">
              Comfortable cabin: Enough room for small families and passengers
            </Text>
          </HStack>
          <HStack spacing={2}>
            <FaCheckCircle size={18} color="green" />
            <Text fontSize="md">
              Fuel efficient: Efficient engine helps keep costs down
            </Text>
          </HStack>
          <HStack spacing={2}>
            <FaCheckCircle size={18} color="green" />
            <Text fontSize="md">
              Long-term reliability: Proven Corolla track record for durability
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default CarProfile;
