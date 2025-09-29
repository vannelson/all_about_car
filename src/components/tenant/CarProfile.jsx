import {
  Box,
  VStack,
  Heading,
  HStack,
  SimpleGrid,
  GridItem,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import CarSpecsGrid from "./CarSpecsGrid";
import CarInfoSummary from "./CarInfoSummary";

const CarProfile = ({ raw = null, specs = null, otherDesc = null }) => {
  const formData = raw
    ? {
        info_make: raw.info_make,
        info_model: raw.info_model,
        info_year: raw.info_year,
        info_age: raw.info_age,
        info_carType: raw.info_carType,
        info_plateNumber: raw.info_plateNumber,
        info_vin: raw.info_vin,
        info_availabilityStatus: raw.info_availabilityStatus,
        info_location: raw.info_location,
        info_mileage: raw.info_mileage,
        spcs_seats: raw.spcs_seats,
        spcs_largeBags: raw.spcs_largeBags,
        spcs_smallBags: raw.spcs_smallBags,
        spcs_engineSize: raw.spcs_engineSize,
        spcs_transmission: raw.spcs_transmission,
        spcs_fuelType: raw.spcs_fuelType,
        spcs_fuelEfficiency: raw.spcs_fuelEfficiency,
        spcs_vehicleType: raw.info_carType,
      }
    : null;

  const features = otherDesc || raw?.features || [];

  return (
    <Box p={6} pt={5} bg="white" mx="auto" borderRadius="md">
      <VStack align="stretch" spacing={6}>
        {/* Car Info (5 cols) + Specs + Features (7 cols) */}
        {formData && (
          <SimpleGrid columns={{ base: 1, md: 12 }} spacing={6}>
            {/* Car Info */}
            <GridItem colSpan={{ base: 12, md: 5 }}>
              <Heading size="md" mb={3} color="gray.800" fontWeight="semibold">
                Car Info
              </Heading>
              <CarInfoSummary raw={formData} />
            </GridItem>

            {/* Specs + Features */}
            <GridItem colSpan={{ base: 12, md: 7 }}>
              <VStack align="stretch" spacing={6}>
                {/* Specifications */}
                <Box>
                  <Heading
                    size="md"
                    mb={3}
                    color="gray.800"
                    fontWeight="semibold"
                  >
                    Specifications
                  </Heading>
                  <CarSpecsGrid
                    formData={formData}
                    columns={{ base: 2, md: 3 }}
                    spacing={4}
                  />
                </Box>

                {/* Features */}
                {Array.isArray(features) && features.length > 0 && (
                  <Box>
                    <Heading
                      size="md"
                      mb={3}
                      color="gray.800"
                      fontWeight="semibold"
                    >
                      Features
                    </Heading>
                    <VStack align="flex-start" spacing={3}>
                      {features.map((text, idx) => (
                        <HStack key={idx} spacing={3}>
                          <FaCheckCircle size={18} color="green" />
                          <span>{text}</span>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                )}
              </VStack>
            </GridItem>
          </SimpleGrid>
        )}
      </VStack>
    </Box>
  );
};

export default CarProfile;
