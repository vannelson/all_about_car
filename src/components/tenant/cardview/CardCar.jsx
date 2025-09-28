import { useEffect, useMemo, useState } from "react";
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
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";

import { InfoIcon } from "@chakra-ui/icons";
import { FaEdit, FaTrash } from "react-icons/fa";

import BaseListAndIcons from "../../base/BaseListAndIcons";
import PaymentPanel from "../payment/PaymentPanel";
import CarRates from "./CarRates";
import BaseModal from "../../base/BaseModal";
// Booking removed for Units page
import BaseSlider from "../../base/BaseSlider";
import { useDispatch, useSelector } from "react-redux";
import { fetchCars } from "../../../store/carsSlice";
// no stepper modal; using BaseSlider + CarProfile for info
import CarProfile from "../CarProfile";
const CardCar = ({ query = "", filters = {}, mode = "view" }) => {
  // No demo cars — always API

  const dispatch = useDispatch();
  const {
    items: cars,
    page,
    limit,
    hasNext,
    listLoading,
    meta,
  } = useSelector((s) => s.cars);

  useEffect(() => {
    if (!cars || cars.length === 0) {
      dispatch(fetchCars({ page: 1, limit: 6 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map UI filters -> API filters
  const apiFilters = useMemo(() => {
    const f = {};
    if (filters?.brand) f["info_make"] = filters.brand;
    if (filters?.carType) f["info_carType"] = filters.carType;
    if (filters?.transmission) f["spcs_transmission"] = filters.transmission;
    if (filters?.availability === "yes") f["info_availabilityStatus"] = "available";
    if (filters?.availability === "no") f["info_availabilityStatus"] = "unavailable";
    if (filters?.seats && /^\d+$/.test(String(filters.seats))) f["spcs_seats"] = String(filters.seats);
    if (filters?.plateNumber) f["info_plateNumber"] = filters.plateNumber;
    if (filters?.vin) f["info_vin"] = filters.vin;
    return f;
  }, [filters]);

  // Refetch from API when server-side filters change
  useEffect(() => {
    const hasFilters = Object.keys(apiFilters).length > 0;
    if (hasFilters) {
      dispatch(fetchCars({ page: 1, limit: limit || 6, filters: apiFilters }));
    } else {
      // If filters cleared, reload unfiltered list
      dispatch(fetchCars({ page: 1, limit: limit || 6 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFilters]);

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
  // Booking modal removed

  const [selectedCar, setSelectedCar] = useState([]);

  const handleModalOpen = (car) => {
    setSelectedCar(car);
    onModalOpen();
  };
  const handleEdit = (car) => {
    setSelectedCar(car);
    onModalOpen();
  };
  const handleDelete = (car) => {
    // TODO: wire delete action when API is available
    // eslint-disable-next-line no-alert
    alert(`Delete ${car?.name || "unit"} (not yet implemented)`);
  };
  const skeletonCount = limit || 6;

  return (
    <Box>
      <Grid
        templateColumns={{
          base: "repeat(auto-fill, minmax(250px, 1fr))",
          sm: "repeat(auto-fill, minmax(280px, 1fr))",
        }}
        gap={5}
      >
        {listLoading
          ? Array.from({ length: skeletonCount }).map((_, idx) => (
              <Card key={`sk-${idx}`} borderRadius="lg" overflow="hidden">
                <CardHeader p={0} h="180px">
                  <Skeleton w="100%" h="100%" />
                </CardHeader>
                <CardBody>
                  <Skeleton height="18px" mb={2} />
                  <SkeletonText noOfLines={3} spacing="2" />
                  <Divider my={3} />
                  <SkeletonText noOfLines={2} spacing="2" />
                </CardBody>
                <CardFooter>
                  <HStack w="full" spacing={3}>
                    <Skeleton height="32px" flex="1" />
                    <Skeleton height="32px" flex="1" />
                    <Skeleton height="32px" flex="1" />
                  </HStack>
                </CardFooter>
              </Card>
            ))
          : ((cars || [])
          .filter((car) => {
            const q = String(query || "").toLowerCase();
            const nameOk = !q || String(car.name || "").toLowerCase().includes(q);
            const availability = filters.availability || "all";
            const status = String(car.status || "");
            const availOk =
              availability === "all" ||
              (availability === "yes" && status === "Available") ||
              (availability === "no" && status !== "Available");
            const rate = Number(car.rateAmount || car.rates?.daily || car.rates?.hourly || 0);
            const priceCap = Number(filters.price || 0);
            const priceOk = !priceCap || rate <= priceCap;
            return nameOk && availOk && priceOk;
          }))
          .map((car, idx) => {
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

                <CarRates rates={car.rates} />
                <Divider my={3} />
                {car.status == "Available" ? (
                  <>
                    <BaseListAndIcons specs={car.specification} />
                  </>
                ) : (
                  <>
                    {/* Booking details are shown in the details modal if available */}
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
                    leftIcon={<FaEdit />}
                    onClick={() => handleEdit(car)}
                  >
                    Edit
                  </Button>
                  <Button
                    flex={1}
                    size="sm"
                    colorScheme="red"
                    leftIcon={<FaTrash />}
                    onClick={() => handleDelete(car)}
                  >
                    Delete
                  </Button>
                </Flex>
              </CardFooter>
            </Card>
          );
        })}
      </Grid>

      {/* Pagination: < 1 2 3 4 > */}
      <Flex justify="center" align="center" gap={2} mt={6}>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            dispatch(fetchCars({ page: Math.max(1, (page || 1) - 1), limit }))
          }
          isDisabled={(page || 1) <= 1}
        >
          {"<"}
        </Button>
        {Array.from(
          {
            length: Math.max(
              1,
              meta?.last_page || (hasNext ? (page || 1) + 1 : page || 1)
            ),
          },
          (_, i) => i + 1
        ).map((p) => (
          <Button
            key={p}
            size="sm"
            colorScheme={p === (page || 1) ? "blue" : "gray"}
            variant={p === (page || 1) ? "solid" : "outline"}
            onClick={() => dispatch(fetchCars({ page: p, limit }))}
          >
            {p}
          </Button>
        ))}
        <Button
          size="sm"
          variant="outline"
          onClick={() => dispatch(fetchCars({ page: (page || 1) + 1, limit }))}
          isDisabled={
            meta?.last_page ? (page || 1) >= meta.last_page : !hasNext
          }
        >
          {">"}
        </Button>
      </Flex>

      <BaseModal
        title={selectedCar?.name || ""}
        isOpen={isModalOpen}
        onClose={onModalClose}
        size="4xl"
      >
        <BaseSlider
          images={(() => {
            const imgs = [];
            if (selectedCar?.image)
              imgs.push({ image: selectedCar.image, alt: selectedCar.name });
            const disp =
              selectedCar?.images?.displayImages ||
              selectedCar?.raw?.displayImages ||
              [];
            (disp || []).forEach((url) =>
              imgs.push({ image: url, alt: selectedCar?.name || "Car" })
            );
            return imgs;
          })()}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
        />
        <Box mt={4}>
          <CarProfile
            specs={selectedCar?.specification || []}
            otherDesc={selectedCar?.raw?.features || []}
          />
        </Box>
      </BaseModal>

      {/* Booking modal removed on Units page */}
    </Box>
  );
};

export default CardCar;
