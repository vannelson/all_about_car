import { HStack, Heading, Grid, FormControl, FormLabel, Input, Icon, Text } from "@chakra-ui/react";
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
}) {
  return (
    <>
      <HStack spacing={3} mb={2}>
        <Icon as={FaRoute} color={primaryColor} boxSize={5} />
        <Heading size="md" color="gray.700">Trip Details</Heading>
      </HStack>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium">Pickup Date & Time</FormLabel>
          <Input type="datetime-local" value={pickupAt} onChange={(e) => setPickupAt(e.target.value)} size="md" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium">Return Date & Time</FormLabel>
          <Input type="datetime-local" value={returnAt} onChange={(e) => setReturnAt(e.target.value)} size="md" />
        </FormControl>
      </Grid>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5} mt={4}>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium"><HStack spacing={2}><Icon as={FaMapMarkerAlt} color="gray.500" /><Text>Pickup Location</Text></HStack></FormLabel>
          <Input placeholder="Enter pickup location" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} size="md" />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium"><HStack spacing={2}><Icon as={FaMapMarkerAlt} color="gray.500" /><Text>Drop-off Location</Text></HStack></FormLabel>
          <Input placeholder="Enter drop-off location" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} size="md" />
        </FormControl>
      </Grid>
    </>
  );
}

