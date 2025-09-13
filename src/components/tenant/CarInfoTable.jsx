import React from "react";
import {
  Box,
  Grid,
  GridItem,
  HStack,
  Icon,
  Text,
  useColorModeValue,
  Heading,
  VStack,
} from "@chakra-ui/react";
import {
  FaCar,
  FaCalendarAlt,
  FaHistory,
  FaHashtag,
  FaMapMarkerAlt,
  FaRoad,
  FaIdCard,
} from "react-icons/fa";

const CarInfoTable = ({ formData }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.100", "gray.700");
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const dividerColor = useColorModeValue("gray.100", "gray.700");
  const highlightBg = useColorModeValue("gray.50", "gray.900");

  // Custom tag styling (replacing badges)
  const tagBg = useColorModeValue("blue.50", "blue.900");
  const tagText = useColorModeValue("blue.700", "blue.200");
  const tagBorder = useColorModeValue("blue.100", "blue.700");

  const grayTagBg = useColorModeValue("gray.100", "gray.700");
  const grayTagText = useColorModeValue("gray.700", "gray.200");
  const grayTagBorder = useColorModeValue("gray.200", "gray.600");

  const greenTagBg = useColorModeValue("green.50", "green.900");
  const greenTagText = useColorModeValue("green.700", "green.200");
  const greenTagBorder = useColorModeValue("green.100", "green.700");

  return (
    <Box>
      {/* Header */}
      <VStack spacing={2} mb={4} align="start">
        <Heading size="sm" fontWeight="semibold">
          {formData.info_make} {formData.info_model}
        </Heading>

        <HStack spacing={2}>
          {/* Car Type Tag */}
          <Box
            px={2}
            py={1}
            fontSize="2xs"
            borderRadius="md"
            bg={tagBg}
            color={tagText}
            borderWidth="1px"
            borderColor={tagBorder}
          >
            <HStack spacing={1}>
              <Icon as={FaCar} boxSize={2.5} />
              <Text fontSize="2xs">{formData.info_carType}</Text>
            </HStack>
          </Box>

          {/* Year Tag */}
          <Box
            px={2}
            py={1}
            fontSize="2xs"
            borderRadius="md"
            bg={grayTagBg}
            color={grayTagText}
            borderWidth="1px"
            borderColor={grayTagBorder}
          >
            <HStack spacing={1}>
              <Icon as={FaCalendarAlt} boxSize={2.5} />
              <Text fontSize="2xs">{formData.info_year}</Text>
            </HStack>
          </Box>

          {/* Age Tag */}
          <Box
            px={2}
            py={1}
            fontSize="2xs"
            borderRadius="md"
            bg={greenTagBg}
            color={greenTagText}
            borderWidth="1px"
            borderColor={greenTagBorder}
          >
            <HStack spacing={1}>
              <Icon as={FaHistory} boxSize={2.5} />
              <Text fontSize="2xs">
                {formData.info_age.includes("+")
                  ? `${formData.info_age.replace("+", "")}+ yrs`
                  : `${formData.info_age} yrs`}
              </Text>
            </HStack>
          </Box>
        </HStack>
      </VStack>

      {/* Information Grid */}
      <Box
        bg={cardBg}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
        fontSize="xs"
        boxShadow="sm"
      >
        <Grid templateColumns="repeat(2, 1fr)" gap={0}>
          {/* Plate Number */}
          <GridItem
            colSpan={2}
            py={2}
            px={3}
            borderBottomWidth="1px"
            borderBottomColor={dividerColor}
            bg={highlightBg}
          >
            <HStack spacing={2}>
              <Icon as={FaIdCard} boxSize={3} color={labelColor} />
              <VStack align="start" spacing={0}>
                <Text fontSize="2xs" fontWeight="medium" color={labelColor}>
                  Plate Number
                </Text>
                <Text fontSize="xs" fontWeight="semibold">
                  {formData.info_plateNumber || "Not assigned"}
                </Text>
              </VStack>
            </HStack>
          </GridItem>

          {/* VIN */}
          <GridItem
            py={2}
            px={3}
            borderRightWidth="1px"
            borderRightColor={dividerColor}
            borderBottomWidth="1px"
            borderBottomColor={dividerColor}
          >
            <HStack spacing={2}>
              <Icon as={FaHashtag} boxSize={3} color={labelColor} />
              <VStack align="start" spacing={0}>
                <Text fontSize="2xs" fontWeight="medium" color={labelColor}>
                  VIN
                </Text>
                <Text fontSize="xs" fontWeight="medium">
                  {formData.info_vin || "Not provided"}
                </Text>
              </VStack>
            </HStack>
          </GridItem>

          {/* Status */}
          <GridItem
            py={2}
            px={3}
            borderBottomWidth="1px"
            borderBottomColor={dividerColor}
          >
            <HStack spacing={2}>
              <Box
                width={2}
                height={2}
                borderRadius="full"
                bg={
                  formData.info_availabilityStatus === "Available"
                    ? "green.400"
                    : formData.info_availabilityStatus === "Maintenance"
                    ? "orange.400"
                    : "red.400"
                }
              />
              <VStack align="start" spacing={0}>
                <Text fontSize="2xs" fontWeight="medium" color={labelColor}>
                  Status
                </Text>
                <Text fontSize="xs" fontWeight="medium">
                  {formData.info_availabilityStatus}
                </Text>
              </VStack>
            </HStack>
          </GridItem>

          {/* Location */}
          <GridItem
            py={2}
            px={3}
            borderRightWidth="1px"
            borderRightColor={dividerColor}
          >
            <HStack spacing={2}>
              <Icon as={FaMapMarkerAlt} boxSize={3} color={labelColor} />
              <VStack align="start" spacing={0}>
                <Text fontSize="2xs" fontWeight="medium" color={labelColor}>
                  Location
                </Text>
                <Text fontSize="xs" fontWeight="medium">
                  {formData.info_location || "Not specified"}
                </Text>
              </VStack>
            </HStack>
          </GridItem>

          {/* Mileage */}
          <GridItem py={2} px={3}>
            <HStack spacing={2}>
              <Icon as={FaRoad} boxSize={3} color={labelColor} />
              <VStack align="start" spacing={0}>
                <Text fontSize="2xs" fontWeight="medium" color={labelColor}>
                  Mileage
                </Text>
                <Text fontSize="xs" fontWeight="medium">
                  {formData.info_mileage.toLocaleString()} km
                </Text>
              </VStack>
            </HStack>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default CarInfoTable;
