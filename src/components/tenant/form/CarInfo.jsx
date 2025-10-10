import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  CAR_BRAND_OPTIONS,
  VEHICLE_AGE_OPTIONS,
  CAR_TYPE_OPTIONS,
  AVAILABILITY_STATUS_OPTIONS,
} from "../../../utils/options";

const CarInfo = ({ formData, handleInputChange, handleNumberChange }) => {
  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h2" size="md" color="blue.700">
        Basic Information
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel>Brand</FormLabel>
          <Select
            name="info_make"
            value={formData.info_make}
            onChange={handleInputChange}
            placeholder="Select brand"
          >
            {CAR_BRAND_OPTIONS.map((brand) => (
              <option key={brand.value} value={brand.value}>
                {brand.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Model</FormLabel>
          <Input
            name="info_model"
            value={formData.info_model}
            onChange={handleInputChange}
            placeholder="e.g. Camry, Civic, F-150"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Year</FormLabel>
          <NumberInput
            min={1990}
            max={new Date().getFullYear() + 1}
            value={formData.info_year}
            onChange={(value) => handleNumberChange("info_year", value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Vehicle Age</FormLabel>
          <Select
            name="info_age"
            value={formData.info_age}
            onChange={handleInputChange}
          >
            {VEHICLE_AGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel>Car Type</FormLabel>
          <Select
            name="info_carType"
            value={formData.info_carType}
            onChange={handleInputChange}
          >
            {CAR_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Availability Status</FormLabel>
          <Select
            name="info_availabilityStatus"
            value={formData.info_availabilityStatus}
            onChange={handleInputChange}
          >
            {AVAILABILITY_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Plate Number</FormLabel>
          <Input
            name="info_plateNumber"
            value={formData.info_plateNumber}
            onChange={handleInputChange}
            placeholder="e.g. ABC123"
          />
        </FormControl>

        <FormControl>
          <FormLabel>VIN / Chassis Number</FormLabel>
          <Input
            name="info_vin"
            value={formData.info_vin}
            onChange={handleInputChange}
            placeholder="17-character VIN"
          />
        </FormControl>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel>Location / Branch</FormLabel>
          <Input
            name="info_location"
            value={formData.info_location}
            onChange={handleInputChange}
            placeholder="e.g. Downtown Branch"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Mileage (km)</FormLabel>
          <NumberInput
            min={0}
            value={formData.info_mileage}
            onChange={(value) => handleNumberChange("info_mileage", value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </SimpleGrid>
    </VStack>
  );
};

export default CarInfo;
