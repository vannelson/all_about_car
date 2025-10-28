import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiMapPin,
} from "react-icons/fi";

const defaultCriteria = {
  pickupLocation: "",
  dropoffLocation: "",
  pickupDate: "",
  pickupTime: "",
  returnDate: "",
  returnTime: "",
  query: "",
};

export default function SearchHero({
  criteria = defaultCriteria,
  onCriteriaChange,
  onSubmit,
  isBusy = false,
  totalResults = 0,
}) {
  const mergedCriteria = { ...defaultCriteria, ...(criteria || {}) };

  const handleChange = (key) => (event) => {
    onCriteriaChange?.({ [key]: event?.target?.value ?? "" });
  };

  const handleSubmit = () => {
    onSubmit?.(mergedCriteria);
  };

  const formattedTotal =
    totalResults === 1
      ? "1 vehicle available"
      : `${totalResults} vehicles available`;

  return (
    <Stack spacing={{ base: 6, md: 8 }} align="stretch" w="full">
      <Stack spacing={2} w="full">
        <Heading
          size={{ base: "lg", md: "xl" }}
          lineHeight="1.2"
          letterSpacing="-0.02em"
        >
          Vehicles for rent in New Zealand
        </Heading>
        <Text fontSize="md" color="gray.600">
          Browse partner fleets, pick your ideal schedule, and send a booking
          request in seconds.
        </Text>
      </Stack>

      <Flex
        direction={{ base: "column", xl: "row" }}
        align={{ base: "flex-start", xl: "flex-end" }}
        justify="space-between"
        gap={{ base: 6, xl: 10 }}
        w="full"
      >
        <Stack spacing={4} flex="1" w="full">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color="gray.400">
                <FiMapPin />
              </InputLeftElement>
              <Input
                placeholder="Pick-up location"
                value={mergedCriteria.pickupLocation}
                onChange={handleChange("pickupLocation")}
                size="lg"
                variant="filled"
                bg="gray.100"
                borderRadius="md"
                _hover={{ bg: "gray.200" }}
                _focus={{ bg: "white", borderColor: "blue.400" }}
              />
            </InputGroup>

            <InputGroup>
              <InputLeftElement pointerEvents="none" color="gray.400">
                <FiMapPin />
              </InputLeftElement>
              <Input
                placeholder="Drop-off location"
                value={mergedCriteria.dropoffLocation}
                onChange={handleChange("dropoffLocation")}
                size="lg"
                variant="filled"
                bg="gray.100"
                borderRadius="md"
                _hover={{ bg: "gray.200" }}
                _focus={{ bg: "white", borderColor: "blue.400" }}
              />
            </InputGroup>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none" color="gray.400">
                <FiCalendar />
              </InputLeftElement>
              <Input
                type="date"
                value={mergedCriteria.pickupDate}
                onChange={handleChange("pickupDate")}
                size="lg"
                variant="filled"
                bg="gray.100"
                borderRadius="md"
                _hover={{ bg: "gray.200" }}
                _focus={{ bg: "white", borderColor: "blue.400" }}
              />
            </InputGroup>

            <InputGroup>
              <InputLeftElement pointerEvents="none" color="gray.400">
                <FiClock />
              </InputLeftElement>
              <Input
                type="time"
                value={mergedCriteria.pickupTime}
                onChange={handleChange("pickupTime")}
                size="lg"
                variant="filled"
                bg="gray.100"
                borderRadius="md"
                _hover={{ bg: "gray.200" }}
                _focus={{ bg: "white", borderColor: "blue.400" }}
              />
            </InputGroup>

            <InputGroup>
              <InputLeftElement pointerEvents="none" color="gray.400">
                <FiCalendar />
              </InputLeftElement>
              <Input
                type="date"
                value={mergedCriteria.returnDate}
                onChange={handleChange("returnDate")}
                size="lg"
                variant="filled"
                bg="gray.100"
                borderRadius="md"
                _hover={{ bg: "gray.200" }}
                _focus={{ bg: "white", borderColor: "blue.400" }}
              />
            </InputGroup>

            <InputGroup>
              <InputLeftElement pointerEvents="none" color="gray.400">
                <FiClock />
              </InputLeftElement>
              <Input
                type="time"
                value={mergedCriteria.returnTime}
                onChange={handleChange("returnTime")}
                size="lg"
                variant="filled"
                bg="gray.100"
                borderRadius="md"
                _hover={{ bg: "gray.200" }}
                _focus={{ bg: "white", borderColor: "blue.400" }}
              />
            </InputGroup>
          </SimpleGrid>

          <Text fontSize="sm" color="gray.500">
            {formattedTotal}
          </Text>
        </Stack>

        <Stack
          spacing={2}
          minW={{ base: "full", xl: "240px" }}
          align={{ base: "flex-start", xl: "flex-end" }}
        >
          <Button
            size="lg"
            px={10}
            borderRadius="full"
            bgGradient="linear(to-r, #2563EB, #38BDF8)"
            color="white"
            rightIcon={<Icon as={FiArrowRight} />}
            _hover={{
              bgGradient: "linear(to-r, #1D4ED8, #2563EB)",
              transform: "translateY(-1px)",
            }}
            _active={{ transform: "translateY(0)" }}
            onClick={handleSubmit}
            isLoading={isBusy}
            shadow="lg"
          >
            Find my car
          </Button>
          <Link color="blue.600" fontWeight="medium" fontSize="sm">
            Add a promo code
          </Link>
        </Stack>
      </Flex>
    </Stack>
  );
}
