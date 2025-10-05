import {
  HStack,
  Heading,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Icon,
  Text,
  Box,
  useRadio,
  useRadioGroup,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { FaRoute, FaMapMarkerAlt } from "react-icons/fa";

export default function BookingTripForm({
  pickupAt,
  setPickupAt,
  returnAt,
  setReturnAt,
  pickupLocation,
  setPickupLocation,
  dropoffLocation,
  setDropoffLocation,
  primaryColor,
  bookingStatus,
  setBookingStatus,
}) {
  const options = ["Reserved", "Ongoing", "Completed", "Cancelled"];

  function RadioCard(props) {
    const { getInputProps, getRadioProps } = useRadio(props);
    const input = getInputProps();
    const checkbox = getRadioProps();
    return (
      <Box as="label">
        <input {...input} />
        <Box
          {...checkbox}
          cursor="pointer"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="sm"
          _checked={{ bg: "blue.50", color: "blue.700", borderColor: "blue.400" }}
          _focus={{ boxShadow: "outline" }}
          px={3}
          py={2}
          fontSize="sm"
          fontWeight="semibold"
          transition="all 0.15s ease"
        >
          {props.children}
        </Box>
      </Box>
    );
  }

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "bookingStatus",
    value: bookingStatus,
    onChange: setBookingStatus,
  });
  const group = getRootProps();

  return (
    <>
      <HStack spacing={3} mb={2}>
        <Heading size="md" color="gray.700">
          Trip Details
        </Heading>
      </HStack>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium">
            Pickup Date & Time
          </FormLabel>
          <Input
            type="datetime-local"
            value={pickupAt}
            onChange={(e) => setPickupAt(e.target.value)}
            size="md"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium">
            Return Date & Time
          </FormLabel>
          <Input
            type="datetime-local"
            value={returnAt}
            onChange={(e) => setReturnAt(e.target.value)}
            size="md"
          />
        </FormControl>
      </Grid>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5} mt={4}>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            <HStack spacing={2}>
              <Icon as={FaMapMarkerAlt} color="gray.500" />
              <Text>Pickup Location</Text>
            </HStack>
          </FormLabel>
          <Input
            placeholder="Enter pickup location"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            size="md"
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            <HStack spacing={2}>
              <Icon as={FaMapMarkerAlt} color="gray.500" />
              <Text>Drop-off Location</Text>
            </HStack>
          </FormLabel>
          <Input
            placeholder="Enter drop-off location"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            size="md"
          />
        </FormControl>
      </Grid>
      <Box mt={4}>
        <FormLabel fontSize="sm" fontWeight="medium">Booking Status</FormLabel>
        <Wrap spacing={2} {...group}>
          {options.map((value) => {
            const radio = getRadioProps({ value });
            return (
              <WrapItem key={value}>
                <RadioCard {...radio}>{value}</RadioCard>
              </WrapItem>
            );
          })}
        </Wrap>
      </Box>
    </>
  );
}
