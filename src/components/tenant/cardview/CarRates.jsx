import { Box, Text, HStack, Divider } from "@chakra-ui/react";
import { FaClock, FaCalendarDay } from "react-icons/fa";

const CarRates = ({ rateAmount, rateType }) => {
  return (
    <Box mt={2}>
      <HStack
        spacing={8}
        pt={2}
        pb={2}
        border="1px solid"
        borderColor="gray.300"
        borderRadius="lg"
        justify="center"
      >
        {/* Daily */}
        <HStack spacing={1}>
          <FaCalendarDay size={14} ml="5" />
          <Text fontSize="md" color="gray.700">
            ₱{rateType === "Day" ? rateAmount : 300}
          </Text>
          <Text fontSize="xs" color="gray.500">
            /day
          </Text>
        </HStack>

        <Divider orientation="vertical" h="20px" />

        {/* Hourly */}
        <HStack spacing={1}>
          <FaClock size={14} />
          <Text fontSize="md" color="gray.700">
            ₱{rateType === "Hour" ? rateAmount : 300}
          </Text>
          <Text fontSize="xs" color="gray.500">
            /hr
          </Text>
        </HStack>
      </HStack>
    </Box>
  );
};

export default CarRates;
