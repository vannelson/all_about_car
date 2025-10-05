import { HStack, Heading, Icon, Grid, FormControl, FormLabel, Input, Select, Box, FormHelperText } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import ImageUpload from "../../tenant/ImageUpload";

export default function BookingRenterForm({
  primaryColor,
  renterLastName,
  setRenterLastName,
  renterFirstName,
  setRenterFirstName,
  renterMiddleName,
  setRenterMiddleName,
  renterPhone,
  setRenterPhone,
  renterEmail,
  setRenterEmail,
  renterAddress,
  setRenterAddress,
  idType,
  setIdType,
  idNumber,
  setIdNumber,
  idLabel,
  setIdLabel,
  idImages,
  setIdImages,
  extraPayment,
  setExtraPayment,
}) {
  return (
    <>
      <HStack spacing={3} mb={2}>
        <Icon as={FaUser} color={primaryColor} boxSize={5} />
        <Heading size="md" color="gray.700">Renter Information</Heading>
      </HStack>

      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={3}>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium">Last Name</FormLabel>
          <Input value={renterLastName} onChange={(e) => setRenterLastName(e.target.value)} placeholder="Delacruz" size="md" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium">First Name</FormLabel>
          <Input value={renterFirstName} onChange={(e) => setRenterFirstName(e.target.value)} placeholder="Miguel" size="md" />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">Middle Name</FormLabel>
          <Input value={renterMiddleName} onChange={(e) => setRenterMiddleName(e.target.value)} placeholder="Santos" size="md" />
        </FormControl>
      </Grid>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3} mt={3}>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium">Phone Number</FormLabel>
          <Input placeholder="+63 912 345 6789" value={renterPhone} onChange={(e) => setRenterPhone(e.target.value)} size="md" />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">Email</FormLabel>
          <Input type="email" value={renterEmail} onChange={(e) => setRenterEmail(e.target.value)} placeholder="miguel.delacruz@example.com" size="md" />
        </FormControl>
      </Grid>

      <FormControl mt={3}>
        <FormLabel fontSize="sm" fontWeight="medium">Address</FormLabel>
        <Input placeholder="Blk 4 Lot 7, Greenfield Subd., Cebu City" value={renterAddress} onChange={(e) => setRenterAddress(e.target.value)} size="md" />
      </FormControl>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3} mt={3}>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium">ID Type</FormLabel>
          <Select value={idType} onChange={(e) => setIdType(e.target.value)} size="md">
            <option value="DriverLicense">Driver License</option>
            <option value="Passport">Passport</option>
            <option value="NationalID">National ID</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium">ID Number</FormLabel>
          <Input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="DL-99887766" size="md" />
        </FormControl>
      </Grid>

      <FormControl mt={3}>
        <FormLabel fontSize="sm" fontWeight="medium">Identification Label</FormLabel>
        <Input value={idLabel} onChange={(e) => setIdLabel(e.target.value)} placeholder="PH Driver License" size="md" />
      </FormControl>

      <Box mt={3}>
        <FormLabel fontSize="sm" fontWeight="medium">Identification Images</FormLabel>
        <ImageUpload multiple={true} maxFiles={10} onImagesChange={(imgs) => setIdImages(imgs || [])} initialImages={idImages} />
      </Box>

      <FormControl mt={3}>
        <FormLabel fontSize="sm" fontWeight="medium">Extra Payment (optional)</FormLabel>
        <Input type="number" value={extraPayment} onChange={(e) => setExtraPayment(e.target.value)} placeholder="0" size="md" />
        <FormHelperText>Enter any additional charge to include</FormHelperText>
      </FormControl>
    </>
  );
}

