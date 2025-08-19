import { useState } from "react";
import {
  Box,
  Grid,
  Button,
  useDisclosure,
  Text,
  HStack,
  Flex,
  Badge,
  Divider,
  Image,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@chakra-ui/react";

import { InfoIcon } from "@chakra-ui/icons";
import { extractBookingDetails } from "../../../utils/helpers/bookingHelpers";
import { FaBook } from "react-icons/fa";

import BaseListAndIcons from "../../base/BaseListAndIcons";
import PaymentPanel from "../payment/PaymentPanel";
import CarRates from "./CarRates";
import BaseModal from "../../base/BaseModal";
import BaseSlider from "../../base/BaseSlider";
import CarProfile from "../CarProfile";

const CardCar = () => {
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

  const statusColors = {
    Available: "green.400",
    Unavailable: "red.400",
    Overdue: "orange.400",
  };

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const [selectedCar, setSelectedCar] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);

  const handleModalOpen = (car) => {
    setSelectedCar(car);
    setSliderImages(
      cars.map((car) => ({
        alt: car.name,
        image: car.image,
      }))
    );
    onModalOpen();
  };
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
          return (
            <Card
              key={idx}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              overflow="hidden"
              _hover={{ shadow: "lg", transform: "translateY(-2px)" }}
              transition="all 0.2s ease"
              minH="100%"
              display="flex"
              flexDirection="column"
            >
              {/* Image & Status */}
              <CardHeader p={0} h="180px">
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

              <CardBody fontSize="sm" flex="1">
                <Text
                  fontWeight="bold"
                  fontSize="lg"
                  color="gray.700"
                  isTruncated
                >
                  {car.name}
                </Text>

                <CarRates rateAmount={car.rateAmount} rateType={car.rateType} />
                <Divider my={3} />
                {car.status == "Available" ? (
                  <>
                    <BaseListAndIcons specs={car.specification} />
                  </>
                ) : (
                  <>
                    <BaseListAndIcons
                      specs={extractBookingDetails(car.booking, [
                        "renter",
                        "startDate_endDate",
                        "actualReturn",
                      ])}
                    />
                    <Divider my={3} />
                    {/* Payment Details */}
                    <PaymentPanel
                      title="Payment Details"
                      bgColor="gray.50"
                      rateAmount={car.rateAmount}
                      extraCharge={car.extraCharge}
                    />
                  </>
                )}
              </CardBody>
              <CardFooter>
                <Flex gap={3} w="full">
                  <Button
                    flex={1}
                    size="sm"
                    colorScheme="gray"
                    leftIcon={<InfoIcon />}
                    onClick={() => handleModalOpen(car)}
                  >
                    Info
                  </Button>
                  <Button
                    flex={1}
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleModalOpen(car)}
                    leftIcon={<FaBook />}
                    isDisabled={car.status !== "Available"}
                  >
                    Book
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
          );
        })}
      </Grid>

      <BaseModal
        title={selectedCar.name || ""}
        isOpen={isModalOpen}
        onClose={onModalClose}
        size="4xl"
      >
        <BaseSlider
          images={sliderImages}
          speed={500}
          slidesToShow={1}
          slidesToScroll={2}
        />
        <CarProfile />
      </BaseModal>
    </Box>
  );
};

export default CardCar;
