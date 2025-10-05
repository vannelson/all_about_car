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
} from "@chakra-ui/react";
import { FaMagic } from "react-icons/fa";
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
  const fillSample = () => {
    const lastNames = ["Santos", "Reyes", "Garcia", "Cruz", "Delacruz", "Flores"];
    const firstNames = ["Miguel", "Ana", "Jose", "Maria", "Carlos", "Luna"];
    const middleNames = ["R.", "M.", "S.", "A.", "P.", "D."];
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const fn = pick(firstNames);
    const ln = pick(lastNames);
    const mn = Math.random() < 0.5 ? pick(middleNames) : "";
    const phone = `+63 9${Math.floor(100000000 + Math.random() * 899999999)}`;
    const email = `${fn}.${ln}`.toLowerCase() + "@example.com";
    const addr = `${Math.floor(1 + Math.random() * 99)} Main St., Cebu City`;
    const types = ["DriverLicense", "Passport", "NationalID"];
    const t = pick(types);
    const idNum = (t === "DriverLicense" ? "DL-" : t === "Passport" ? "P-" : "N-") +
      Math.floor(100000 + Math.random() * 899999);
    setRenterFirstName(fn);
    setRenterMiddleName(mn);
    setRenterLastName(ln);
    setRenterPhone(phone);
    setRenterEmail(email);
    setRenterAddress(addr);
    setIdType(t);
    setIdNumber(idNum);
    setIdLabel(t === "DriverLicense" ? "Driver License" : t === "Passport" ? "Passport" : "National ID");
  };
  return (
    <>
      <HStack justify="flex-end" mb={2}>
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
