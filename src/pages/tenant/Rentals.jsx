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
  DrawerBody,
  useDisclosure,
  useBreakpointValue,
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
  Flex,
  Badge,
  ChakraProvider,
  Divider,
  Image,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

import {
  CheckCircleIcon,
  SmallCloseIcon,
  TimeIcon,
  InfoIcon,
} from "@chakra-ui/icons";

import {
  FaBolt,
  FaGasPump,
  FaCogs,
  FaSuitcase,
  FaCarSide,
  FaUsers,
  FaCalendarAlt,
  FaSuitcaseRolling,
  FaTachometerAlt,
  FaArrowRight,
  FaCheckCircle,
  FaStar,
  FaMobileAlt,
  FaApple,
  FaAndroid,
  FaBluetooth,
} from "react-icons/fa";

// import { MdAutomatic, MdTouchApp } from "react-icons/md";
import { GiCarKey, GiSpeedometer } from "react-icons/gi";
import { AiOutlineStar } from "react-icons/ai";
import { SiApple, SiAndroid } from "react-icons/si";
import { BsBluetooth } from "react-icons/bs";

import SlickCarouSliderel from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

// Dummy car list
function CarList() {
  return (
    <Box pt="3">
      <CarSummary />
      <CarCardList />
    </Box>
  );
}

function CarSummary() {
  const summary = [
    {
      label: "Available",
      value: 70,
      color: "green",
      icon: <CheckCircleIcon color="green.200" />,
    },
    {
      label: "Unavailable",
      value: 15,
      color: "red",
      icon: <SmallCloseIcon color="red.200" />,
    },
    {
      label: "Overdue",
      value: 15,
      color: "orange",
      icon: <TimeIcon color="orange.200" />,
    },
  ];

  return (
    <Box pt="3">
      <Flex justify="flex-end" gap={4} wrap="wrap">
        {summary.map((item, idx) => (
          <Flex key={idx} align="center" gap={2}>
            <Text fontWeight="semibold" fontSize="sm">
              {item.label}
            </Text>
            <Badge ml="1" variant="solid" colorScheme={item.color}>
              {item.value}
            </Badge>
          </Flex>
        ))}
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
        <VStack align="start" spacing={5} w="full">
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
              Up to ₱{price.toLocaleString()}/day
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
  const cars = [
    {
      name: "Tesla Model 3",
      age: "2 - 4 year(s) old",
      type: "Electric",
      transmission: "Auto",
      fuelEfficiency: "A",
      price: 5500,
      image: "/cars/6_tesla/1.avif",
      status: "Unavailable",
    },
    {
      name: "Toyota Corolla",
      age: "1 - 2 year(s) old",
      type: "Gasoline",
      transmission: "Manual",
      fuelEfficiency: "B",
      price: 2500,
      image: "/cars/3_toyota/1.avif",
      status: "Available",
    },
    {
      name: "Nissan Leaf",
      age: "3 - 5 year(s) old",
      type: "Electric",
      transmission: "Auto",
      fuelEfficiency: "A+",
      price: 4000,
      image: "/cars/5_mitsubishi/1.avif",
      status: "Overdue",
    },
    {
      name: "Honda Civic",
      age: "2 - 3 year(s) old",
      type: "Gasoline",
      transmission: "Auto",
      fuelEfficiency: "B+",
      price: 3200,
      image: "/cars/2_van/1.avif",
      status: "Available",
    },
    {
      name: "Toyota Yaris",
      age: "6 year(s) old",
      type: "Gasoline",
      transmission: "Auto",
      fuelEfficiency: "B+",
      price: 3200,
      image: "/cars/9_toyota_yaris/1.avif",
      status: "Available",
    },
    {
      name: "Toyota Corolla Hatch",
      age: "3 year(s) old",
      type: "Gasoline",
      transmission: "Auto",
      fuelEfficiency: "B+",
      price: 3200,
      image: "/cars/8_toyota_corolla/1.avif",
      status: "Available",
    },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCar, setSelectedCar] = useState(null);

  const handleOpenModal = (car) => {
    setSelectedCar(car);
    onOpen();
  };

  return (
    <ChakraProvider>
      <Box pt="6">
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={6}
        >
          {cars.map((car, idx) => (
            <Box
              key={idx}
              borderRadius="lg"
              overflow="hidden"
              boxShadow="sm"
              border="1px solid #e2e8f0"
              bg="white"
              _hover={{ boxShadow: "lg" }}
            >
              {/* Image + badge */}
              <Box position="relative">
                <Image
                  src={car.image}
                  alt={car.name}
                  objectFit="cover"
                  w="100%"
                  h="140px"
                />

                <Badge
                  position="absolute"
                  top="2"
                  left="2"
                  fontSize="0.7em"
                  color="white"
                  bg={
                    car.status === "Available"
                      ? "green.400"
                      : car.status === "Unavailable"
                      ? "red.400"
                      : car.status === "OverdueWarning"
                      ? "yellow.400"
                      : "yellow.400"
                  }
                >
                  {car.status}
                </Badge>
              </Box>

              {/* Car info */}
              <Box p="4">
                <Text fontWeight="bold" fontSize="xl">
                  {car.name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {car.age}
                </Text>

                {/* Fuel efficiency */}
                <Flex align="center" mt="2">
                  <FaTachometerAlt color="#4A5568" />
                  <Text fontSize="sm" mr="2" ml="3">
                    7.6L / 100km
                  </Text>
                  <Badge colorScheme="green">{car.fuelEfficiency}</Badge>
                </Flex>

                <Divider my="3" />

                {/* Price */}
                <Text color="grey.500" fontWeight="bold" fontSize="lg">
                  ₱{car.price.toLocaleString()}
                </Text>

                {/* Features */}
                <Flex
                  mt="3"
                  align="center"
                  gap="4"
                  fontSize="sm"
                  color="gray.600"
                >
                  <Flex align="center" gap="1">
                    <Icon as={FaCogs} /> {car.transmission}
                  </Flex>
                  <Flex align="center" gap="1">
                    {car.type === "Electric" ? <FaBolt /> : <FaGasPump />}{" "}
                    {car.type}
                  </Flex>
                </Flex>

                {/* More button */}
                <Button
                  mt="4"
                  size="sm"
                  colorScheme="blue"
                  leftIcon={<InfoIcon />}
                  onClick={() => handleOpenModal(car)}
                >
                  More
                </Button>
              </Box>
            </Box>
          ))}
        </Grid>
      </Box>

      <CarInfoModal
        isOpen={isOpen}
        onClose={onClose}
        title={selectedCar?.name || ""}
      />
    </ChakraProvider>
  );
}

function CarInfoModal({ isOpen, onClose, title }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      className="custom-modal"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
  const images = [
    "/cars/5_mitsubishi/2.avif",
    "/cars/5_mitsubishi/3.avif",
    "/cars/5_mitsubishi/4.avif",
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };

  return (
    <Box p={8} bg="white" maxW="1000px" mx="auto">
      {/* Image Carousel */}
      <Box mb={8}>
        <SlickCarouSliderel {...settings}>
          {images.map((src, idx) => (
            <Box key={idx} px={2}>
              <Image
                src={src}
                alt={`Vehicle Image ${idx + 1}`}
                borderRadius="md"
                w="100%"
                h="200px"
                objectFit="cover"
              />
            </Box>
          ))}
        </SlickCarouSliderel>
      </Box>

      {/* Main Content */}
      <Flex gap={10} wrap="wrap">
        {/* Left Column - Specs */}
        <Box flex="1">
          <Heading size="md" mb={4} color="gray.800" fontWeight="semibold">
            Specs
          </Heading>
          <VStack align="start" spacing={4}>
            <HStack spacing={3}>
              <FaCalendarAlt size={22} color="#4A5568" />
              <Text fontSize="md" fontWeight="medium" color="gray.800">
                0 - 3 year(s) old
              </Text>
            </HStack>
            <HStack spacing={3}>
              <FaUsers size={22} color="#4A5568" />
              <Text fontSize="md" fontWeight="medium" color="gray.800">
                5 seats
              </Text>
            </HStack>
            <HStack spacing={3}>
              <FaSuitcaseRolling size={22} color="#4A5568" />
              <Text fontSize="md" fontWeight="medium" color="gray.800">
                1 large bag
              </Text>
            </HStack>
            <HStack spacing={3}>
              <FaSuitcase size={22} color="#4A5568" />
              <Text fontSize="md" fontWeight="medium" color="gray.800">
                2 small bags
              </Text>
            </HStack>
            <HStack spacing={3}>
              <FaCogs size={22} color="#4A5568" />
              <Text fontSize="md" fontWeight="medium" color="gray.800">
                1998 cc engine
              </Text>
            </HStack>
            <HStack spacing={3}>
              <FaCogs size={22} color="#4A5568" />
              <Text fontSize="md" fontWeight="medium" color="gray.800">
                Automatic
              </Text>
            </HStack>
            <HStack spacing={3}>
              <FaGasPump size={22} color="#4A5568" />
              <Text fontSize="md" fontWeight="medium" color="gray.800">
                Petrol
              </Text>
            </HStack>
            <HStack spacing={3}>
              <FaTachometerAlt size={22} color="#4A5568" />
              <Text fontSize="md" fontWeight="medium" color="gray.800">
                7.6L / 100km
              </Text>
            </HStack>
          </VStack>
        </Box>

        {/* Divider */}
        <Box w="1px" bg="gray.300" />

        {/* Right Column - Other Description */}
        <Box flex="1">
          <Heading size="md" mb={4} color="gray.800" fontWeight="semibold">
            Other Description
          </Heading>
          <VStack align="start" spacing={4}>
            <HStack spacing={3}>
              <FaArrowRight size={22} color="#4A5568" />
              <Text fontSize="md" fontWeight="medium" color="gray.800">
                Keyless entry
              </Text>
            </HStack>
            <HStack spacing={3}>
              <FaArrowRight size={22} color="#4A5568" />
              <Text fontSize="md" fontWeight="medium" color="gray.800">
                5 Star ANCAP Rating
              </Text>
            </HStack>
            <HStack spacing={3}>
              <FaArrowRight size={22} color="#4A5568" />
              <Text fontSize="md" fontWeight="medium" color="gray.800">
                8" Touchscreen Entertainment
              </Text>
            </HStack>
            <HStack spacing={3}>
              <FaArrowRight size={22} color="#4A5568" />
              <Text fontSize="md" fontWeight="medium" color="gray.800">
                Apple Carplay and Android Auto
              </Text>
            </HStack>
            <HStack spacing={3}>
              <FaArrowRight size={22} color="#4A5568" />
              <Text fontSize="md" fontWeight="medium" color="gray.800">
                Bluetooth Audio
              </Text>
            </HStack>
          </VStack>
        </Box>
      </Flex>

      {/* Why Choose Section */}
      <Box mt={8}>
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Why choose this vehicle?
        </Text>
        <VStack align="flex-start" spacing={3}>
          <HStack spacing={3}>
            <FaCheckCircle size={20} color="green" />
            <Text fontSize="md">
              Comfortable cabin: Enough room for small families and passengers
            </Text>
          </HStack>
          <HStack spacing={3}>
            <FaCheckCircle size={20} color="green" />
            <Text fontSize="md">
              Fuel efficient: Efficient engine helps keep costs down
            </Text>
          </HStack>
          <HStack spacing={3}>
            <FaCheckCircle size={20} color="green" />
            <Text fontSize="md">
              Long-term reliability: Proven Corolla track record for durability
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}

export default Rentals;
