import { useState } from "react";
import {
  Box,
  Checkbox,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  VStack,
  Heading,
  HStack,
} from "@chakra-ui/react";

const Filters = () => {
  const [price, setPrice] = useState(7000);
  const [availability, setAvailability] = useState("all");

  return (
    <Box pt={2}>
      <Box
        border="1px solid #e2e8f0"
        borderRadius="lg"
        boxShadow="sm"
        p={5}
        bg="white"
      >
        <VStack align="start" spacing={3} w="full">
          <Heading as="h3" size="md" mb={1}>
            Filter By
          </Heading>

          {/* Availability */}
          <Box w="full">
            <Text fontWeight="semibold" mb={2}>
              Availability
            </Text>
            <HStack spacing={5}>
              <Checkbox
                isChecked={availability === "yes"}
                onChange={() => setAvailability("yes")}
              >
                Yes
              </Checkbox>
              <Checkbox
                isChecked={availability === "no"}
                onChange={() => setAvailability("no")}
              >
                No
              </Checkbox>
              <Checkbox
                isChecked={availability === "all"}
                onChange={() => setAvailability("all")}
              >
                All
              </Checkbox>
            </HStack>
          </Box>

          {/* Brand */}
          <Box w="full">
            <Text fontWeight="semibold" mb={2}>
              Brand
            </Text>
            <Select placeholder="Select brand">
              <option value="toyota">Toyota</option>
              <option value="honda">Honda</option>
              <option value="ford">Ford</option>
              <option value="nissan">Nissan</option>
              <option value="mitsubishi">Mitsubishi</option>
              <option value="bmw">BMW</option>
              <option value="mercedes">Mercedes-Benz</option>
            </Select>
          </Box>

          {/* Car Type */}
          <Box w="full">
            <Text fontWeight="semibold" mb={2}>
              Car Type
            </Text>
            <Select placeholder="Select type">
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="pickup">Pickup</option>
              <option value="van">Van</option>
              <option value="hatchback">Hatchback</option>
              <option value="luxury">Luxury</option>
            </Select>
          </Box>

          {/* Price Range */}
          <Box w="full">
            <Text fontWeight="semibold" mb={2}>
              Price Range
            </Text>
            <Text fontSize="sm" color="gray.600" mb={2}>
              Up to {price.toLocaleString()}/day
            </Text>
            <Slider
              value={price}
              min={500}
              max={10000}
              step={50}
              onChange={(val) => setPrice(val)}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>

          {/* Seating Capacity */}
          <Box w="full">
            <Text fontWeight="semibold" mb={2}>
              Seating Capacity
            </Text>
            <Select placeholder="Select seats">
              <option value="2">2 seats</option>
              <option value="4-5">4–5 seats</option>
              <option value="6-8">6–8 seats</option>
              <option value="9+">9+ seats</option>
            </Select>
          </Box>

          {/* Transmission */}
          <Box w="full">
            <Text fontWeight="semibold" mb={2}>
              Transmission
            </Text>
            <Select placeholder="Select transmission">
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </Select>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default Filters;
