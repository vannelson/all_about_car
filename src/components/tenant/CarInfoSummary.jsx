import React from "react";
import {
  Box,
  Table,
  Tbody,
  Tr,
  Td,
  Text,
  Badge,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiMapPin, FiHash } from "react-icons/fi";

const fields = [
  { key: "info_make", label: "Brand" },
  { key: "info_model", label: "Model" },
  { key: "info_year", label: "Year" },
  { key: "info_age", label: "Age" },
  { key: "info_carType", label: "Type" },
  { key: "info_plateNumber", label: "Plate Number" },
  { key: "info_vin", label: "VIN" },
  { key: "info_availabilityStatus", label: "Status" },
  { key: "info_location", label: "Location" },
  { key: "info_mileage", label: "Mileage" },
];

const CarInfoSummary = ({ raw = {} }) => {
  const labelColor = useColorModeValue("gray.600", "gray.400");
  const valueColor = useColorModeValue("gray.900", "white");
  const cardBg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");

  const rows = fields
    .map((f) => ({ label: f.label, value: raw?.[f.key] }))
    .filter(
      (r) =>
        r.value !== undefined &&
        r.value !== null &&
        String(r.value).trim().length > 0
    );

  return (
    <Box
      borderWidth="1px"
      borderColor={border}
      borderRadius="xl"
      overflow="hidden"
      bg={cardBg}
      boxShadow="sm"
      _hover={{ boxShadow: "md", transition: "0.2s" }}
    >
      <Table size="sm" variant="simple">
        <Tbody>
          {rows.map((row, idx) => (
            <Tr key={idx}>
              <Td
                fontSize="xs"
                textTransform="uppercase"
                letterSpacing="wide"
                fontWeight="medium"
                color={labelColor}
                w="40%"
                borderColor={border}
              >
                {row.label}
              </Td>
              <Td
                fontSize="sm"
                fontWeight="semibold"
                color={valueColor}
                borderColor={border}
              >
                {row.label === "Status" ? (
                  <Badge colorScheme={String(row.value).toLowerCase() === "available" ? "green" : "red"} variant="subtle">
                    {String(row.value).charAt(0).toUpperCase() + String(row.value).slice(1)}
                  </Badge>
                ) : row.label === "Mileage" ? (
                  `${Number(row.value).toLocaleString()} km`
                ) : row.label === "Plate Number" || row.label === "VIN" ? (
                  <HStack spacing={2}>
                    <FiHash />
                    <Text as="span" fontFamily="mono">{String(row.value)}</Text>
                  </HStack>
                ) : row.label === "Location" ? (
                  <HStack spacing={2}>
                    <FiMapPin />
                    <Text as="span">{String(row.value)}</Text>
                  </HStack>
                ) : (
                  String(row.value)
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default CarInfoSummary;
