import {
  Grid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
  HStack,
  Button,
  Icon,
  Heading,
  Text,
} from "@chakra-ui/react";
import { FaMagic, FaUser } from "react-icons/fa";
import ImageUpload from "../../tenant/ImageUpload";
import { sampleRenters } from "../../../data/sampleRenters";

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
  const fillSample = () => {
    const pick = sampleRenters[Math.floor(Math.random() * sampleRenters.length)];
    if (!pick) return;
    setRenterFirstName(pick.firstName);
    setRenterMiddleName(pick.middleName || "");
    setRenterLastName(pick.lastName);
    setRenterPhone(pick.phone);
    setRenterEmail(pick.email);
    setRenterAddress(pick.address);
    setIdType(pick.idType);
    setIdNumber(pick.idNumber);
    setIdLabel(pick.idLabel);
    setExtraPayment(pick.extraPayment ?? "0");
  };
  return (
    <>
      <HStack justify="space-between" align="flex-start" mb={3}>
        <HStack spacing={3} align="center">
          <Box
            bg="blue.50"
            color="blue.600"
            borderRadius="full"
            p={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={FaUser} boxSize={4} />
          </Box>
            <Box>
              <Heading size="md" color="gray.700">
                Renter Information
              </Heading>
              <Text fontSize="sm" color="gray.500">
                Capture the renter’s contact and identification details.
              </Text>
            </Box>
        </HStack>
        <Button size="xs" leftIcon={<Icon as={FaMagic} />} variant="outline" onClick={fillSample}>
          Fill Sample
        </Button>
      </HStack>
      {/* Name */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={2}>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium">
            Last Name
          </FormLabel>
          <Input
            value={renterLastName}
            onChange={(e) => setRenterLastName(e.target.value)}
            placeholder="Delacruz"
            size="sm"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium">
            First Name
          </FormLabel>
          <Input
            value={renterFirstName}
            onChange={(e) => setRenterFirstName(e.target.value)}
            placeholder="Miguel"
            size="sm"
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Middle Name
          </FormLabel>
          <Input
            value={renterMiddleName}
            onChange={(e) => setRenterMiddleName(e.target.value)}
            placeholder="Santos"
            size="sm"
          />
        </FormControl>
      </Grid>

      {/* Contact + Extra Payment */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={3}>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium">
            Phone Number
          </FormLabel>
          <Input
            placeholder="+63 912 345 6789"
            value={renterPhone}
            onChange={(e) => setRenterPhone(e.target.value)}
            size="sm"
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Email
          </FormLabel>
          <Input
            type="email"
            value={renterEmail}
            onChange={(e) => setRenterEmail(e.target.value)}
            placeholder="miguel.delacruz@example.com"
            size="sm"
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            Extra Payment (optional)
          </FormLabel>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={extraPayment}
            onChange={(e) => setExtraPayment(e.target.value)}
            placeholder="0"
            size="sm"
          />
        </FormControl>
      </Grid>

      <FormControl>
        <FormLabel fontSize="sm" fontWeight="medium">
          Address
        </FormLabel>
        <Input
          placeholder="Blk 4 Lot 7, Greenfield Subd., Cebu City"
          value={renterAddress}
          onChange={(e) => setRenterAddress(e.target.value)}
          size="sm"
        />
      </FormControl>

      {/* Identification */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={3}>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium">
            ID Type
          </FormLabel>
          <Select
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            size="sm"
          >
            <option value="DriverLicense">Driver License</option>
            <option value="Passport">Passport</option>
            <option value="NationalID">National ID</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel fontSize="sm" fontWeight="medium">
            ID Number
          </FormLabel>
          <Input
            value={idNumber}
            onChange={(e) => setIdNumber(e.target.value)}
            placeholder="DL-99887766"
            size="sm"
          />
        </FormControl>
        <FormControl>
          <FormLabel fontSize="sm" fontWeight="medium">
            ID Label
          </FormLabel>
          <Input
            value={idLabel}
            onChange={(e) => setIdLabel(e.target.value)}
            placeholder="PH Driver License"
            size="sm"
          />
        </FormControl>
      </Grid>

      {/* ID Images */}
      <Box mt={2}>
        <FormLabel fontSize="sm" fontWeight="medium">
          Identification Images
        </FormLabel>
        <ImageUpload
          multiple={true}
          maxFiles={10}
          onImagesChange={(imgs) => setIdImages(imgs || [])}
          initialImages={idImages}
        />
      </Box>
    </>
  );
}
