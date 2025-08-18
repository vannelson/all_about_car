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
  Thead,
  Th,
  IconButton,
  InputGroup,
  Text,
  VStack,
  Heading,
  HStack,
  Flex,
  Spinner,
  Table,
  Badge,
  Divider,
  Image,
  Tbody,
  Tr,
  Td,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
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
} from "react-icons/fa";

import SlickCarouSliderel from "react-slick";
import { BsTable } from "react-icons/bs";
import { MdViewModule } from "react-icons/md";

import BaseButton from "../../components/base/BaseButton";
import Filters from "../../layout/tenant/Filters";
import TableCar from "../../components/tenant/tableview/TableCar";
import CardCar from "../../components/tenant/cardview/CardCar";

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
            <Filters />
          </GridItem>
        )}

        <GridItem>
          {/* Replace with card or table view */}
          <CarListTableOrCard />
        </GridItem>
      </Grid>

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerBody p="0">
              <Filters />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </Box>
  );
}

function CarListTableOrCard() {
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
        <CardCar />
      ) : (
        <TableCar />
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
          <BaseButton colorScheme="green">
            <AddIcon mr="2" /> Add
          </BaseButton>
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

function CarInfoModal({ isOpen, onClose, title }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
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
    { alt: "Tesla Model 3", images: "/cars/5_mitsubishi/4.avif" },
    { alt: "Toyota Corolla", images: "/cars/5_mitsubishi/2.avif" },
    { alt: "Nissan Leaf", images: "/cars/5_mitsubishi/4.avif" },
    { alt: "Toyota Navara", images: "/cars/5_mitsubishi/5.avif" },
    { alt: "Honda Civic", images: "/cars/5_mitsubishi/1.avif" },
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
              margin: "0 auto",
            }}
          >
            <img
              src={src.images}
              alt={src.alt}
              style={{
                width: "260px",
                height: "140px",
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
