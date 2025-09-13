import React from "react";
import {
  SimpleGrid,
  HStack,
  Center,
  Box,
  Text,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import {
  FaUsers,
  FaCogs,
  FaGasPump,
  FaTachometerAlt,
  FaSuitcase,
  FaCar,
} from "react-icons/fa";

const CarSpecsGrid = ({
  formData,
  columns = { base: 2, md: 3 },
  spacing = 6,
}) => {
  const iconBg = useColorModeValue("blue.50", "blue.900");
  const iconColor = useColorModeValue("blue.600", "blue.200");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const valueColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.100", "gray.700");

  const specs = [
    {
      icon: FaUsers,
      label: "Seats",
      value: formData.spcs_seats || "N/A",
      description: "Passenger capacity",
    },
    {
      icon: FaCogs,
      label: "Engine",
      value: formData.spcs_engineSize ? `${formData.spcs_engineSize}cc` : "N/A",
      description: "Engine displacement",
    },
    {
      icon: FaGasPump,
      label: "Fuel",
      value: formData.spcs_fuelType || "N/A",
      description: "Fuel type",
    },
    {
      icon: FaTachometerAlt,
      label: "Economy",
      value: formData.spcs_fuelEfficiency
        ? `${formData.spcs_fuelEfficiency}L/100km`
        : "N/A",
      description: "Fuel efficiency",
    },
    {
      icon: FaCogs,
      label: "Transmission",
      value: formData.spcs_transmission ? formData.spcs_transmission : "N/A",
      description: "Transmission type",
    },
    {
      icon: FaSuitcase,
      label: "Luggage",
      value:
        formData.spcs_largeBags && formData.spcs_smallBags
          ? `${formData.spcs_largeBags}L ${formData.spcs_smallBags}S`
          : "N/A",
      description: "Bag capacity",
    },
    // Additional spec that could be useful
    {
      icon: FaCar,
      label: "Type",
      value: formData.spcs_vehicleType || "N/A",
      description: "Vehicle category",
    },
  ];

  return (
    <SimpleGrid columns={columns} spacing={spacing}>
      {specs.map((item, index) => (
        <HStack
          key={index}
          align="flex-start"
          borderRadius="md"
          _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
        >
          <Center w={10} h={10} borderRadius="lg" bg={iconBg} flexShrink={0}>
            <Icon as={item.icon} color={iconColor} boxSize={4} />
          </Center>
          <Box flex="1">
            <Text
              fontSize="xs"
              color={labelColor}
              fontWeight="medium"
              letterSpacing="wide"
            >
              {item.label}
            </Text>
            <Text fontSize="xs" fontWeight="semibold" color={valueColor} mb={1}>
              {item.value}
            </Text>
          </Box>
        </HStack>
      ))}
    </SimpleGrid>
  );
};

export default CarSpecsGrid;
