import { useEffect, useState } from "react";
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
  Input,
} from "@chakra-ui/react";

const Filters = ({ value, onChange }) => {
  const [price, setPrice] = useState(value?.price ?? 7000);
  const [availability, setAvailability] = useState(value?.availability ?? "all");
  const [brand, setBrand] = useState(value?.brand ?? "");
  const [carType, setCarType] = useState(value?.carType ?? "");
  const [seats, setSeats] = useState(value?.seats ?? "");
  const [transmission, setTransmission] = useState(value?.transmission ?? "");
  const [plateNumber, setPlateNumber] = useState(value?.plateNumber ?? "");
  const [vin, setVin] = useState(value?.vin ?? "");

  useEffect(() => {
    if (onChange) {
      onChange({ availability, price, brand, carType, seats, transmission, plateNumber, vin });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availability, price, brand, carType, seats, transmission, plateNumber, vin]);

  return (
    <Box pt={2}>
      <Box border="1px solid #e2e8f0" borderRadius="lg" boxShadow="sm" p={5} bg="white">
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
              <Checkbox isChecked={availability === "yes"} onChange={() => setAvailability("yes")}>
                Yes
              </Checkbox>
              <Checkbox isChecked={availability === "no"} onChange={() => setAvailability("no")}>
                No
              </Checkbox>
              <Checkbox isChecked={availability === "all"} onChange={() => setAvailability("all")}>
                All
              </Checkbox>
            </HStack>
          </Box>

          {/* Brand */}
          <Box w="full">
            <Text fontWeight="semibold" mb={2}>
              Brand
            </Text>
            <Select placeholder="Select brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
              <option value="Nissan">Nissan</option>
              <option value="Mitsubishi">Mitsubishi</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
            </Select>
          </Box>

          {/* Car Type */}
          <Box w="full">
            <Text fontWeight="semibold" mb={2}>
              Car Type
            </Text>
            <Select placeholder="Select type" value={carType} onChange={(e) => setCarType(e.target.value)}>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Pickup">Pickup</option>
              <option value="Van">Van</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Luxury">Luxury</option>
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
            <Slider value={price} min={500} max={10000} step={50} onChange={(val) => setPrice(val)}>
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
            <Select placeholder="Select seats" value={seats} onChange={(e) => setSeats(e.target.value)}>
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9+</option>
            </Select>
          </Box>

          {/* Transmission */}
          <Box w="full">
            <Text fontWeight="semibold" mb={2}>
              Transmission
            </Text>
            <Select
              placeholder="Select transmission"
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </Select>
          </Box>

          {/* Plate Number */}
          <Box w="full">
            <Text fontWeight="semibold" mb={2}>
              Plate Number
            </Text>
            <Input
              placeholder="e.g. XYZ1234"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
            />
          </Box>

          {/* VIN */}
          <Box w="full">
            <Text fontWeight="semibold" mb={2}>
              VIN
            </Text>
            <Input
              placeholder="Vehicle Identification Number"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
            />
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default Filters;
