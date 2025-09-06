import React, { useState } from "react";
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
const steps = [
  { title: "Basic", description: "Vehicle Info" },
  { title: "Specs", description: "Specifications" },
  { title: "Features", description: "Add Features" },
  { title: "Pictures", description: "Upload Images" },
  { title: "Review", description: "Preview & Submit" },
];

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
            value={formData.seats}
            onChange={(value) => handleNumberChange("seats", value)}
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
            value={formData.engineSize}
            onChange={(value) => handleNumberChange("engineSize", value)}
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
            value={formData.largeBags}
            onChange={(value) => handleNumberChange("largeBags", value)}
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
            value={formData.smallBags}
            onChange={(value) => handleNumberChange("smallBags", value)}
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
            name="transmission"
            value={formData.transmission}
            onChange={handleInputChange}
          >
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
            <option value="CVT">CVT</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Fuel Type</FormLabel>
          <Select
            name="fuelType"
            value={formData.fuelType}
            onChange={handleInputChange}
          >
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Fuel Efficiency (L/100km)</FormLabel>
          <NumberInput
            min={0}
            max={20}
            step={0.1}
            value={formData.fuelEfficiency}
            onChange={(value) => handleNumberChange("fuelEfficiency", value)}
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
