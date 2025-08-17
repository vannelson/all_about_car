import { useState } from "react";
import {
  Box,
  Button,
  useDisclosure,
  Stack,
  Thead,
  Th,
  Text,
  Flex,
  Table,
  Badge,
  Divider,
  Image,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";

import { InfoIcon, SearchIcon, AddIcon } from "@chakra-ui/icons";

import {
  FaBolt,
  FaGasPump,
  FaCogs,
  FaUser,
  FaCalendarAlt,
  FaBook,
  FaCalculator,
  FaMoneyBillWave,
  FaClock,
  FaExclamationCircle,
  FaCalendarDay,
  FaChair,
  FaCar,
} from "react-icons/fa";
import BaseListAndIcons from "../../base/BaseListAndIcons";

const TableCar = () => {
  // const cars = [
  //   {
  //     name: "Tesla Model 3",
  //     image: "/cars/6_tesla/1.avif",
  //     specs: ["5 seats", "7.6L / 100km", "Petrol"],
  //     status: "Unavailable",
  //     renter: "John Doe",
  //     startDate: "Aug 1, 10:00 am",
  //     endDate: "Aug 3, 10:00 am",
  //     actualReturn: "Aug 4, 12:00 pm",
  //     charge: 4000,
  //     extraCharge: 1500,
  //     rates: { day: 5500, hour: 300 },
  //   },
  //   {
  //     name: "Nissan Leaf",
  //     image: "/cars/5_mitsubishi/1.avif",
  //     specs: ["4 seats", "Electric", "350km range"],
  //     status: "Overdue",
  //     renter: "Jane Smith",
  //     startDate: "Jul 15, 9:00 am",
  //     endDate: "Aug 1, 9:00 am",
  //     actualReturn: "",
  //     charge: 4000,
  //     extraCharge: 4000,
  //     rates: { day: 4000, hour: 250 },
  //   },
  // ];

  const cars = [
    {
      name: "Tesla Model 3",
      image: "/cars/6_tesla/1.avif",
      status: "Unavailable",
      rateType: "Daily",
      rateAmount: "5,500",
      specification: [
        { key: "age", value: "0 - 3 year(s) old" },
        { key: "seats", value: "5 seats" },
        { key: "luggage_capacity", value: "2 small bags" },
        { key: "engine_capacity_cc", value: "1998 cc engine" },
        { key: "transmission", value: "Automatic" },
        { key: "fuel_type", value: "Petrol" },
      ],
      booking: {
        startDate: "Aug 1, 10:00 am",
        endDate: "Aug 3, 10:00 am",
        actualReturn: "Aug 4, 12:00 pm",
        rateType: "Daily",
        rateAmount: "5,500",
        extraCharge: "1,500",
        renter: "John Doe",
      },
    },
    {
      name: "Toyota Corolla",
      image: "/cars/3_toyota/1.avif",
      status: "Available",
      rateType: "Hourly",
      rateAmount: "250",
      specification: [
        { key: "age", value: "1 - 2 year(s) old" },
        { key: "seats", value: "5 seats" },
        { key: "luggage_capacity", value: "2 small bags" },
        { key: "engine_capacity_cc", value: "1998 cc engine" },
        { key: "transmission", value: "Manual" },
        { key: "fuel_type", value: "Gasoline" },
      ],
      booking: null,
    },
    {
      name: "Nissan Leaf",
      image: "/cars/5_mitsubishi/1.avif",
      status: "Overdue",
      rateType: "Daily",
      rateAmount: "4,000",
      specification: [
        { key: "age", value: "0 - 3 year(s) old" },
        { key: "seats", value: "5 seats" },
        { key: "luggage_capacity", value: "2 small bags" },
        { key: "engine_capacity_cc", value: "1998 cc engine" },
        { key: "transmission", value: "Automatic" },
        { key: "fuel_type", value: "Electric" },
      ],
      booking: {
        startDate: "Jul 15, 9:00 am",
        endDate: "Aug 1, 9:00 am",
        actualReturn: "Aug 4, 12:00 pm",
        rateType: "Daily",
        rateAmount: "4,000",
        extraCharge: "4,000",
        renter: "Smith Doe",
      },
    },
    {
      name: "Toyota Navara",
      image: "/cars/4_ford/1.avif",
      status: "Overdue",
      rateType: "Daily",
      rateAmount: "4,000",
      specification: [
        { key: "age", value: "0 - 3 year(s) old" },
        { key: "seats", value: "5 seats" },
        { key: "luggage_capacity", value: "2 small bags" },
        { key: "engine_capacity_cc", value: "1998 cc engine" },
        { key: "transmission", value: "Automatic" },
        { key: "fuel_type", value: "Diesel" },
      ],
      booking: {
        startDate: "Jul 15, 9:00 am",
        endDate: "Aug 1, 9:00 am",
        actualReturn: "Aug 4, 12:00 pm",
        rateType: "Daily",
        rateAmount: "4,000",
        extraCharge: "4,000",
        renter: "Jane Smith",
        idType: "Driver License",
      },
    },
    {
      name: "Honda Civic",
      image: "/cars/2_van/1.avif",
      status: "Available",
      rateType: "Hourly",
      rateAmount: "320",
      specification: [
        { key: "age", value: "2 - 3 year(s) old" },
        { key: "seats", value: "5 seats" },
        { key: "luggage_capacity", value: "2 small bags" },
        { key: "engine_capacity_cc", value: "1998 cc engine" },
        { key: "transmission", value: "Automatic" },
        { key: "fuel_type", value: "Gasoline" },
      ],
      booking: null,
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
    if (spec.includes("age")) return <FaChair color={iconColor} />;
    if (spec.includes("seats")) return <FaGasPump color={iconColor} />;
    if (spec.includes("luggage_capacity")) return <FaBolt color={iconColor} />;
    if (spec.includes("transmission")) return <FaCar color={iconColor} />;
    if (spec.includes("fuel_type")) return <FaCogs color={iconColor} />;
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
                        {/* <BaseListAndIcons
                          specs={car.specification}
                          fontSize={"sm"}
                        /> */}

                        {car.specification.map((s, i) => (
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
                {/* <Td>
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
                </Td> */}

                {/* Rates */}
                {/* <Td>
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
                </Td> */}

                {/* Payment Details */}
                {/* <Td>
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
                </Td> */}

                {/* Status */}
                {/* <Td>
                  <Badge
                    colorScheme={getStatusColor(car.status)}
                    variant="solid"
                    px={3}
                    py={1}
                    borderRadius="md"
                  >
                    {car.status}
                  </Badge>
                </Td> */}

                {/* Actions */}
                {/* <Td textAlign="center">
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
                </Td> */}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default TableCar;
