import { useState } from "react";
import { extractBookingDetails } from "../../../utils/helpers/bookingHelpers";

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
import CarRates from "../cardview/CarRates";
import PaymentPanel from "../payment/PaymentPanel";

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
        { key: "fuel_efficiency_rate", value: "7.6L / 100km" },
      ],
      booking: {
        startDate: "Aug 1, 10:00 am",
        endDate: "Aug 3, 10:00 am",
        actualReturn: "Returned : Aug 4, 12:00 pm",
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
        { key: "fuel_efficiency_rate", value: "Fuel Efficiency: B" },
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
        { key: "fuel_efficiency_rate", value: "7.6L / 100km" },
      ],
      booking: {
        startDate: "Jul 15, 9:00 am",
        endDate: "Aug 1, 9:00 am",
        actualReturn: "Returned : Aug 4, 12:00 pm",
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
        { key: "fuel_efficiency_rate", value: "7.6L / 100km" },
      ],
      booking: {
        startDate: "Jul 15, 9:00 am",
        endDate: "Aug 1, 9:00 am",
        actualReturn: "Returned : Aug 4, 12:00 pm",
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
        { key: "fuel_efficiency_rate", value: "Fuel Efficiency: B+" },
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
    if (spec.key.includes("seats")) return <FaChair color={iconColor} />;
    if (spec.key.includes("luggage_capacity"))
      return <FaGasPump color={iconColor} />;
    if (spec.key.includes("fuel_efficiency_rate"))
      return <FaBolt color={iconColor} />;
    if (spec.key.includes("transmission")) return <FaCar color={iconColor} />;
    if (spec.key.includes("fuel_type")) return <FaCogs color={iconColor} />;
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
                      boxSize="80px"
                      borderRadius="md"
                      objectFit="cover"
                    />
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={1}>
                        {car.name}
                      </Text>
                      <Stack spacing={0} fontSize="xs" pt={1}>
                        <BaseListAndIcons
                          specs={car.specification}
                          IconfontSize={12}
                          labelFontSize={12}
                          mb={1}
                          showMode={3}
                        />
                      </Stack>
                    </Box>
                  </Flex>
                </Td>

                {/* Renter Info */}
                <Td>
                  {car.status != "Available" ? (
                    <>
                      <BaseListAndIcons
                        specs={extractBookingDetails(car.booking, [
                          "renter",
                          "startDate_endDate",
                          "actualReturn",
                        ])}
                      />
                    </>
                  ) : (
                    ""
                  )}
                </Td>

                {/* Rates */}
                <Td>
                  <CarRates
                    rateAmount={car.rateAmount}
                    rateType={car.rateType}
                    direction={"vertical"}
                  />
                </Td>

                {/* Payment Details */}
                <Td>
                  <PaymentPanel
                    bgColor="white"
                    rateAmount={car.rateAmount}
                    extraCharge={car.extraCharge}
                  />
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
};

export default TableCar;
