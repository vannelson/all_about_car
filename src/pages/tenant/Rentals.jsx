import { useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  InputLeftElement,
  DrawerBody,
  useDisclosure,
  useBreakpointValue,
  Stack,
  Checkbox,
  Select,
  Thead,
  Th,
  IconButton,
  InputGroup,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  VStack,
  Heading,
  HStack,
  Flex,
  Spinner,
  Table,
  Badge,
  ChakraProvider,
  Divider,
  Image,
  Tbody,
  Tr,
  Td,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Switch,
  ModalBody,
  ModalCloseButton,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";

import { InfoIcon, SearchIcon, AddIcon } from "@chakra-ui/icons";

import {
  FaBolt,
  FaGasPump,
  FaCogs,
  FaSuitcase,
  FaUser,
  FaUsers,
  FaCalendarAlt,
  FaSuitcaseRolling,
  FaTachometerAlt,
  FaArrowRight,
  FaCheckCircle,
  FaBook,
  FaCalculator,
  FaMoneyBillWave,
  FaClock,
  FaExclamationCircle,
  FaCalendarDay,
  FaChair,
  FaCar,
  FaBatteryFull,
} from "react-icons/fa";

import SlickCarouSliderel from "react-slick";
import { BsTable } from "react-icons/bs";
import { MdViewModule } from "react-icons/md";

function Rentals() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box p={4}>
      {isMobile && (
        <Button colorScheme="blue" mb={4} onClick={onOpen}>
          Filter
        </Button>
      )}

      <Grid templateColumns={{ base: "1fr", md: "2fr 9fr" }} gap={4}>
        {!isMobile && (
          <GridItem>
            <FilterSidebar />
          </GridItem>
        )}

        <GridItem>
          {/* Replace with card or table view */}
          <CarList />
        </GridItem>
      </Grid>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerBody p="0">
              <FilterSidebar />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </Box>
  );
}

// Dummy filter component
function FilterSidebar() {
  return <Filters />;
}

function CarList() {
  const [isCardView, setIsCardView] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleToggleView = () => {
    setLoading(true);
    setTimeout(() => {
      setIsCardView((prev) => !prev);
      setLoading(false);
    }, 300); // 1 second delay
  };

  return (
    <Box pt="3">
      <CarSummary isCardView={isCardView} onToggleView={handleToggleView} />

      {loading ? (
        <Flex justify="center" py={10}>
          <Spinner size="xl" color="grey.800" thickness="4px" />
        </Flex>
      ) : isCardView ? (
        <CarCardList />
      ) : (
        <TableView />
      )}
    </Box>
  );
}

function CarSummary({ isCardView, onToggleView }) {
  return (
    <Box pb={4}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "stretch", md: "center" }}
        gap={{ base: 3, md: 2 }}
      >
        {/* Left side - Search */}
        <HStack align="center" flexWrap={{ base: "wrap", md: "nowrap" }}>
          <InputGroup maxW="350px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input maxW="350px" placeholder="Search cars..." />
          </InputGroup>
        </HStack>

        {/* Right side - Add & Toggle buttons */}
        <HStack spacing={2} align="center">
          <Button colorScheme="green" leftIcon={<AddIcon />}>
            Add
          </Button>

          <IconButton
            aria-label="Toggle view"
            icon={isCardView ? <MdViewModule /> : <BsTable />}
            onClick={onToggleView}
            colorScheme="teal"
          />
        </HStack>
      </Flex>
    </Box>
  );
}

function Filters() {
  const [price, setPrice] = useState(5500);
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
}

function CarCardList() {
  const specs = [
    { icon: FaCalendarAlt, label: "0 - 3 year(s) old" },
    { icon: FaUsers, label: "5 seats" },
    { icon: FaSuitcase, label: "2 small bags" },
    { icon: FaCogs, label: "1998 cc engine" },
    { icon: FaCogs, label: "Automatic" },
    { icon: FaGasPump, label: "Petrol" },
    { icon: FaTachometerAlt, label: "7.6L / 100km" },
  ];

  const cars = [
    {
      name: "Tesla Model 3",
      image: "/cars/6_tesla/1.avif",
      status: "Unavailable",
      rateType: "Day",
      rateAmount: "5,500",
      renter: "John Doe",
      startDate: "Aug 1, 10:00 am",
      endDate: "Aug 3, 10:00 am",
      actualReturn: "Aug 4, 12:00 pm",
      extraCharge: "1,500",
      transmission: "Auto",
      type: "Electric",
    },
    {
      name: "Toyota Corolla",
      image: "/cars/3_toyota/1.avif",
      status: "Available",
      rateType: "Hour",
      rateAmount: "250",
      transmission: "Manual",
      type: "Gasoline",
      age: "1 - 2 year(s) old",
      fuelEfficiency: "B",
      price: 2500,
    },
    {
      name: "Nissan Leaf",
      image: "/cars/5_mitsubishi/1.avif",
      status: "Overdue",
      rateType: "Day",
      rateAmount: "4,000",
      renter: "Jane Smith",
      startDate: "Jul 15, 9:00 am",
      endDate: "Aug 1, 9:00 am",
      actualReturn: "Aug 4, 12:00 pm",
      extraCharge: "4,000",
      transmission: "Auto",
      type: "Electric",
    },
    {
      name: "Toyota Navara",
      image: "/cars/4_ford/1.avif",
      status: "Overdue",
      rateType: "Day",
      rateAmount: "4,000",
      renter: "Jane Smith",
      startDate: "Jul 15, 9:00 am",
      endDate: "Aug 1, 9:00 am",
      actualReturn: "Aug 4, 12:00 pm",
      extraCharge: "4,000",
      transmission: "Auto",
      type: "Electric",
    },
    {
      name: "Honda Civic",
      image: "/cars/2_van/1.avif",
      status: "Available",
      rateType: "Hour",
      rateAmount: "320",
      transmission: "Auto",
      type: "Gasoline",
      age: "2 - 3 year(s) old",
      fuelEfficiency: "B+",
      price: 3200,
    },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCar, setSelectedCar] = useState(null);

  const handleOpenModal = (car) => {
    setSelectedCar(car);
    onOpen();
  };

  const handleBookCar = (car) => {
    console.log("Book car:", car.name);
  };

  const statusColors = {
    Available: "green.400",
    Unavailable: "red.400",
    Overdue: "orange.400",
  };

  const parseAmount = (str) => Number(str.replace(/[,]/g, "").trim()) || 0;

  return (
    <Box>
      <Grid
        templateColumns={{
          base: "repeat(auto-fill, minmax(250px, 1fr))",
          sm: "repeat(auto-fill, minmax(280px, 1fr))",
        }}
        gap={5}
      >
        {cars.map((car, idx) => {
          const rate = parseAmount(car.rateAmount);
          const extra = parseAmount(car.extraCharge || "0");
          const totalCharge = rate + extra;

          return (
            <Card
              key={idx}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              overflow="hidden"
              _hover={{ shadow: "md", transform: "translateY(-2px)" }}
              transition="all 0.2s ease"
              minH="100%"
              display="flex"
              flexDirection="column"
            >
              {/* Image & Status */}
              <CardHeader p={0} position="relative" h="180px">
                <Image
                  src={car.image}
                  alt={car.name}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                />
                <Badge
                  position="absolute"
                  top={2}
                  left={2}
                  px={2}
                  py={1}
                  borderRadius="md"
                  color="white"
                  fontSize="xs"
                  bg={statusColors[car.status]}
                >
                  {car.status}
                </Badge>
              </CardHeader>

              {car.status === "Available" ? (
                <>
                  <CardBody flex="1" display="flex" flexDirection="column">
                    <Text fontWeight="bold" fontSize="lg" isTruncated>
                      {car.name}
                    </Text>

                    {/* Rate Display */}
                    <Box mt={2}>
                      <HStack
                        spacing={7}
                        pt={2}
                        pb={2}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        justify="center"
                      >
                        <HStack spacing={1}>
                          <FaCalendarDay size={14} color="#4A5568" />
                          <Text fontSize="md" color="gray.700">
                            ₱{car.rateType === "Day" ? car.rateAmount : 300}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            /day
                          </Text>
                        </HStack>
                        <Divider orientation="vertical" h="20px" />
                        <HStack spacing={1}>
                          <FaClock size={14} color="#4A5568" />
                          <Text fontSize="md" color="gray.700">
                            ₱{car.rateType === "Hour" ? car.rateAmount : 300}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            /hr
                          </Text>
                        </HStack>
                      </HStack>
                    </Box>

                    <Divider my={3} />

                    {/* Specs Section */}
                    {/* Specs Section */}
                    <Box mt={2} fontSize="sm" color="gray.600">
                      {specs.map((spec, i) => (
                        <Flex key={i} align="center" gap={2} mb={2}>
                          <Box as={spec.icon} color="gray.500" fontSize="md" />
                          <Text>{spec.label}</Text>
                        </Flex>
                      ))}
                    </Box>
                  </CardBody>

                  <CardFooter mt="auto">
                    <Button
                      size="sm"
                      colorScheme="blue"
                      leftIcon={<InfoIcon />}
                      w="full"
                      onClick={() => handleOpenModal(car)}
                    >
                      More Info
                    </Button>
                  </CardFooter>
                </>
              ) : (
                <>
                  <CardBody fontSize="sm" color="gray.600" flex="1">
                    <Text fontWeight="bold" fontSize="lg" isTruncated>
                      {car.name}
                    </Text>

                    <Box mt={2}>
                      <HStack
                        spacing={7}
                        pt={2}
                        pb={2}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="lg"
                        justify="center"
                      >
                        {/* Daily */}
                        <HStack spacing={1}>
                          <FaCalendarDay size={14} color="#4A5568" />
                          <Text fontSize="md" color="gray.700">
                            ₱
                            {car.rateType === "Day"
                              ? car.rateAmount
                              : defaultRates.Day}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            /day
                          </Text>
                        </HStack>

                        <Divider orientation="vertical" h="20px" />

                        {/* Hourly */}
                        <HStack spacing={1}>
                          <FaClock size={14} color="#4A5568" />
                          <Text fontSize="md" color="gray.700">
                            ₱{car.rateType === "Hour" ? car.rateAmount : 300}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            /hr
                          </Text>
                        </HStack>
                      </HStack>
                    </Box>

                    <Divider my={3} />

                    <Flex align="center" gap={2} mt={1}>
                      <FaUser />
                      <Text>{car.renter || "---"}</Text>
                    </Flex>
                    <Flex align="center" gap={2} mt={1}>
                      <FaCalendarAlt />
                      <Text>
                        {car.startDate && car.endDate
                          ? `${car.startDate} - ${car.endDate}`
                          : ""}
                      </Text>
                    </Flex>

                    <Flex align="center" gap={2} mt={1}>
                      <FaClock />
                      <Text>Returned: {car.actualReturn}</Text>
                    </Flex>
                    <Divider my={3} />

                    {/* Payment Details */}
                    <Box mt={3} p={2} borderRadius="md" bg="gray.50">
                      <Text fontWeight="bold" fontSize="sm" mb={1}>
                        Payment Details
                      </Text>
                      <Flex align="center" justify="space-between">
                        <Flex align="center" gap={2}>
                          <FaMoneyBillWave />
                          <Text>Charge</Text>
                        </Flex>
                        <Text fontWeight="medium">{car.rateAmount}</Text>
                      </Flex>

                      {car.extraCharge && (
                        <>
                          <Flex align="center" justify="space-between" mt={1}>
                            <Flex align="center" gap={2}>
                              <FaExclamationCircle color="red" />
                              <Text>Extra Charge</Text>
                            </Flex>
                            <Text fontWeight="medium">{car.extraCharge}</Text>
                          </Flex>
                          <Flex align="center" justify="space-between" mt={1}>
                            <Flex align="center" gap={2}>
                              <FaCalculator />
                              <Text>Total</Text>
                            </Flex>
                            <Text fontWeight="bold">
                              {totalCharge.toLocaleString()}
                            </Text>
                          </Flex>
                        </>
                      )}
                    </Box>
                  </CardBody>

                  <CardFooter>
                    <Flex gap={3} w="full">
                      <Button
                        flex={1}
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<InfoIcon />}
                        onClick={() => handleOpenModal(car)}
                      >
                        Info
                      </Button>
                      <Button
                        flex={1}
                        size="sm"
                        colorScheme="green"
                        leftIcon={<FaBook />}
                        onClick={() => handleBookCar(car)}
                        isDisabled={car.status !== "Available"}
                      >
                        Book
                      </Button>
                    </Flex>
                  </CardFooter>
                </>
              )}
            </Card>
          );
        })}
      </Grid>

      {selectedCar && (
        <CarInfoModal
          isOpen={isOpen}
          onClose={onClose}
          title={selectedCar.name}
        />
      )}
    </Box>
  );
}

function TableView() {
  const cars = [
    {
      name: "Tesla Model 3",
      image: "/cars/6_tesla/1.avif",
      specs: ["5 seats", "7.6L / 100km", "Petrol"],
      status: "Unavailable",
      renter: "John Doe",
      startDate: "Aug 1, 10:00 am",
      endDate: "Aug 3, 10:00 am",
      actualReturn: "Aug 4, 12:00 pm",
      charge: 4000,
      extraCharge: 1500,
      rates: { day: 5500, hour: 300 },
    },
    {
      name: "Nissan Leaf",
      image: "/cars/5_mitsubishi/1.avif",
      specs: ["4 seats", "Electric", "350km range"],
      status: "Overdue",
      renter: "Jane Smith",
      startDate: "Jul 15, 9:00 am",
      endDate: "Aug 1, 9:00 am",
      actualReturn: "",
      charge: 4000,
      extraCharge: 4000,
      rates: { day: 4000, hour: 250 },
    },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCar, setSelectedCar] = useState(null);

  const handleOpenModal = (car) => {
    setSelectedCar(car);
    onOpen();
  };

  const iconColor = "gray.500";
  const getSpecIcon = (spec) => {
    if (spec.includes("seats")) return <FaChair color={iconColor} />;
    if (spec.includes("Petrol")) return <FaGasPump color={iconColor} />;
    if (spec.includes("Electric")) return <FaBolt color={iconColor} />;
    if (spec.includes("km")) return <FaCar color={iconColor} />;
    if (spec.includes("L")) return <FaCogs color={iconColor} />;
    return <FaCar color={iconColor} />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "green";
      case "Unavailable":
        return "red";
      case "Overdue":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="lg" overflowX="auto" pb="4" bg="white">
      <Table size="sm" variant="simple">
        <Thead bg="gray.50">
          <Tr>
            <Th>Car Info</Th>
            <Th>Renter Info</Th>
            <Th>Rates</Th>
            <Th>Payment Details</Th>
            <Th>Status</Th>
            <Th textAlign="center">Actions</Th>
          </Tr>
        </Thead>
        <Tbody fontSize="sm">
          {cars.map((car, idx) => {
            const total = car.charge + car.extraCharge;

            return (
              <Tr
                key={idx}
                _hover={{ bg: "gray.50" }}
                bg={car.status === "Overdue" ? "red.50" : "transparent"}
              >
                {/* Car Info */}
                <Td>
                  <Flex align="flex-start" gap={3}>
                    <Image
                      src={car.image}
                      alt={car.name}
                      boxSize="75px"
                      borderRadius="md"
                      objectFit="cover"
                    />
                    <Box>
                      <Text fontWeight="semibold" mb={1}>
                        {car.name}
                      </Text>
                      <Stack spacing={1} fontSize="xs" color="gray.600">
                        {car.specs.map((s, i) => (
                          <Flex key={i} align="center" gap={2}>
                            {getSpecIcon(s)}
                            <Text>{s}</Text>
                          </Flex>
                        ))}
                      </Stack>
                    </Box>
                  </Flex>
                </Td>

                {/* Renter Info */}
                <Td>
                  <Flex align="center" gap={2}>
                    <FaUser color={iconColor} />
                    <Text fontWeight="medium">{car.renter || "—"}</Text>
                  </Flex>
                  {car.startDate && car.endDate && (
                    <Flex align="center" gap={2} mt={1}>
                      <FaCalendarAlt color="gray" />
                      <Text fontSize="sm" color="gray.600">
                        {car.startDate} - {car.endDate}
                      </Text>
                    </Flex>
                  )}
                  {car.actualReturn && (
                    <Flex align="center" gap={2} mt={1}>
                      <FaClock color="gray" />
                      <Text fontSize="sm" color="gray.600">
                        Returned: {car.actualReturn}
                      </Text>
                    </Flex>
                  )}
                </Td>

                {/* Rates */}
                <Td>
                  <Box p={3} borderWidth="1px" borderRadius="md" shadow="sm">
                    <Stack spacing={2}>
                      <Flex align="center" justify="space-between">
                        <Flex align="center" gap={2}>
                          <FaCalendarDay size={14} color="#4A5568" />
                          <Text color="gray.600" fontSize="sm">
                            Daily
                          </Text>
                        </Flex>
                        <Text fontWeight="semibold">
                          ₱{car.rates.day.toLocaleString()}
                        </Text>
                      </Flex>
                      <Flex align="center" justify="space-between">
                        <Flex align="center" gap={2}>
                          <FaClock size={14} color="#4A5568" />
                          <Text color="gray.600" fontSize="sm">
                            Hourly
                          </Text>
                        </Flex>
                        <Text fontWeight="semibold" color="black.100">
                          ₱{car.rates.hour.toLocaleString()}
                        </Text>
                      </Flex>
                    </Stack>
                  </Box>
                </Td>

                {/* Payment Details */}
                <Td>
                  <Box p={3} borderWidth="1px" borderRadius="md" bg="white">
                    <Stack spacing={2}>
                      <Flex align="center" justify="space-between">
                        <Flex align="center" gap={2}>
                          <FaMoneyBillWave color="gray" />
                          <Text color="gray.600">Charge</Text>
                        </Flex>
                        <Text>{car.charge.toLocaleString()}</Text>
                      </Flex>

                      <Flex align="center" justify="space-between">
                        <Flex align="center" gap={2}>
                          <FaExclamationCircle color="orange" />
                          <Text color="gray.600">Extra</Text>
                        </Flex>
                        <Text>
                          {car.extraCharge
                            ? car.extraCharge.toLocaleString()
                            : "-"}
                        </Text>
                      </Flex>

                      <Divider my={1} />
                      <Flex
                        align="center"
                        justify="space-between"
                        fontWeight="semibold"
                      >
                        <Flex align="center" gap={2}>
                          <FaCalculator color={iconColor} />
                          <Text>Total</Text>
                        </Flex>
                        <Text>{total.toLocaleString()}</Text>
                      </Flex>
                    </Stack>
                  </Box>
                </Td>

                {/* Status */}
                <Td>
                  <Badge
                    colorScheme={getStatusColor(car.status)}
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="md"
                  >
                    {car.status}
                  </Badge>
                </Td>

                {/* Actions */}
                <Td textAlign="center">
                  <Stack direction="column" spacing={2} align="center">
                    <Button
                      size="sm"
                      colorScheme="blue"
                      leftIcon={<FaBook color="white" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Book", car.name);
                      }}
                    >
                      Book
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<InfoIcon color={iconColor} />}
                      onClick={() => handleOpenModal(car)}
                    >
                      More
                    </Button>
                  </Stack>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
}

function CarInfoModal({ isOpen, onClose, title }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      className="custom-modal"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text fontSize="26px">{title}</Text>
        </ModalHeader>

        <ModalCloseButton />
        <ModalBody>
          <SimpleSlider />
          <CarProfile />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

function CarProfile() {
  const specs = [
    { icon: FaCalendarAlt, label: "0 - 3 year(s) old" },
    { icon: FaUsers, label: "5 seats" },
    { icon: FaSuitcaseRolling, label: "1 large bag" },
    { icon: FaSuitcase, label: "2 small bags" },
    { icon: FaCogs, label: "1998 cc engine" },
    { icon: FaCogs, label: "Automatic" },
    { icon: FaGasPump, label: "Petrol" },
    { icon: FaTachometerAlt, label: "7.6L / 100km" },
  ];

  const otherDesc = [
    "Keyless entry",
    "5 Star ANCAP Rating",
    '8" Touchscreen Entertainment',
    "Apple Carplay and Android Auto",
    "Bluetooth Audio",
  ];

  return (
    <Box p={6} pt={8} bg="white" mx="auto" borderRadius="md">
      <Flex gap={8} wrap="wrap">
        {/* Specification Table */}
        <Box flex="1">
          <Heading size="md" mb={4} color="gray.800" fontWeight="semibold">
            Specification
          </Heading>
          <Table variant="simple" size="sm">
            <Tbody>
              {specs.map((item, idx) => (
                <Tr key={idx}>
                  <Td w="40px">
                    <item.icon size={20} color="#4A5568" />
                  </Td>
                  <Td fontWeight="semibold" color="gray.700">
                    {item.label}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Other Description Table */}
        <Box flex="1">
          <Heading size="md" mb={4} color="gray.800" fontWeight="semibold">
            Other Description
          </Heading>
          <Table variant="simple" size="sm">
            <Tbody>
              {otherDesc.map((text, idx) => (
                <Tr key={idx}>
                  <Td w="40px">
                    <FaArrowRight size={18} color="#4A5568" />
                  </Td>
                  <Td fontWeight="semibold" color="gray.700">
                    {text}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Flex>

      {/* Why Choose Section */}
      <Box mt={8}>
        <Text fontSize="lg" fontWeight="bold" mb={3}>
          Why choose this vehicle?
        </Text>
        <VStack align="flex-start" spacing={2}>
          <HStack spacing={2}>
            <FaCheckCircle size={18} color="green" />
            <Text fontSize="md">
              Comfortable cabin: Enough room for small families and passengers
            </Text>
          </HStack>
          <HStack spacing={2}>
            <FaCheckCircle size={18} color="green" />
            <Text fontSize="md">
              Fuel efficient: Efficient engine helps keep costs down
            </Text>
          </HStack>
          <HStack spacing={2}>
            <FaCheckCircle size={18} color="green" />
            <Text fontSize="md">
              Long-term reliability: Proven Corolla track record for durability
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}

function SimpleSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  const images = [
    "/cars/5_mitsubishi/4.avif",
    "/cars/5_mitsubishi/2.avif",
    "/cars/5_mitsubishi/4.avif",
    "/cars/5_mitsubishi/5.avif",
    "/cars/5_mitsubishi/1.avif",
  ];

  return (
    <Box p={6}>
      <SlickCarouSliderel {...settings}>
        {images.map((src, index) => (
          <div
            key={index}
            style={{
              width: "360px",
              height: "240px",
              margin: "0 auto", // centers the image inside the slide
            }}
          >
            <img
              src={src}
              alt={`Car ${index + 1}`}
              style={{
                width: "360px",
                height: "240px",
                objectFit: "cover", // crop without distortion
                borderRadius: "8px",
              }}
            />
          </div>
        ))}
      </SlickCarouSliderel>
    </Box>
  );
}

export default Rentals;
