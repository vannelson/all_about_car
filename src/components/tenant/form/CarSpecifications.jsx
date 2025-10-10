import React from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import { TRANSMISSION_OPTIONS, FUEL_TYPE_OPTIONS } from "../../../utils/options";

const CarSpecifications = ({
  formData,
  handleInputChange,
  handleNumberChange,
}) => {
  return (
    <VStack spacing={6} align="stretch">
      <Heading as="h2" size="md" color="blue.700">
        Specifications
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel>Seats</FormLabel>
          <NumberInput
            min={2}
            max={9}
            value={formData.spcs_seats}
            onChange={(value) => handleNumberChange("spcs_seats", value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Engine Size (cc)</FormLabel>
          <NumberInput
            min={1000}
            max={5000}
            value={formData.spcs_engineSize}
            onChange={(value) => handleNumberChange("spcs_engineSize", value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Large Bags</FormLabel>
          <NumberInput
            min={0}
            max={5}
            value={formData.spcs_largeBags}
            onChange={(value) => handleNumberChange("spcs_largeBags", value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Small Bags</FormLabel>
          <NumberInput
            min={0}
            max={5}
            value={formData.spcs_smallBags}
            onChange={(value) => handleNumberChange("spcs_smallBags", value)}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
        <FormControl isRequired>
          <FormLabel>Transmission</FormLabel>
          <Select
            name="spcs_transmission"
            value={formData.spcs_transmission}
            onChange={handleInputChange}
          >
            {TRANSMISSION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Fuel Type</FormLabel>
          <Select
            name="spcs_fuelType"
            value={formData.spcs_fuelType}
            onChange={handleInputChange}
          >
            {FUEL_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Fuel Efficiency (L/100km)</FormLabel>
          <NumberInput
            min={0}
            max={20}
            step={0.1}
            value={formData.spcs_fuelEfficiency}
            onChange={(value) =>
              handleNumberChange("spcs_fuelEfficiency", value)
            }
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

export default CarSpecifications;
