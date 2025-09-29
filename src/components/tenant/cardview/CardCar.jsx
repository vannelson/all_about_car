import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Grid,
  Button,
  useDisclosure,
  Text,
  HStack,
  VStack,
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
import CarCardSkeleton from "../skeletons/CarCardSkeleton";
import Pagination from "../Pagination";
import CarIdentity from "../CarIdentity";

function buildSliderImages(selectedCar) {
  if (!selectedCar) return [];
  const imgs = [];
  if (selectedCar.image) {
    imgs.push({ image: selectedCar.image, alt: selectedCar.name });
  }
  const disp =
    selectedCar.images?.displayImages || selectedCar.raw?.displayImages || [];
  (disp || []).forEach((url) =>
    imgs.push({ image: url, alt: selectedCar?.name || "Car" })
  );
  return imgs;
}
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
    if (filters?.availability === "yes")
      f["info_availabilityStatus"] = "available";
    if (filters?.availability === "no")
      f["info_availabilityStatus"] = "unavailable";
    if (filters?.seats && /^\d+$/.test(String(filters.seats)))
      f["spcs_seats"] = String(filters.seats);
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
  const skeletonCount = useMemo(() => limit || 6, [limit]);

  const filteredCars = useMemo(() => {
    const list = cars || [];
    const q = String(query || "").toLowerCase();
    const availability = filters?.availability || "all";
    const priceCap = Number(filters?.price || 0);
    return list.filter((car) => {
      const nameOk =
        !q ||
        String(car.name || "")
          .toLowerCase()
          .includes(q);
      const status = String(car.status || "");
      const availOk =
        availability === "all" ||
        (availability === "yes" && status === "Available") ||
        (availability === "no" && status !== "Available");
      const rate = Number(
        car.rates?.daily || car.rates?.hourly || car.rateAmount || 0
      );
      const priceOk = !priceCap || rate <= priceCap;
      return nameOk && availOk && priceOk;
    });
  }, [cars, query, filters?.availability, filters?.price]);

  const onOpenInfo = useCallback(
    (car) => {
      setSelectedCar(car);
      onModalOpen();
    },
    [onModalOpen]
  );

  const onEdit = useCallback(
    (car) => {
      setSelectedCar(car);
      onModalOpen();
    },
    [onModalOpen]
  );

  const onDelete = useCallback((car) => {
    // eslint-disable-next-line no-alert
    alert(`Delete ${car?.name || "unit"} (not yet implemented)`);
  }, []);

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
              <CarCardSkeleton key={`sk-${idx}`} />
            ))
          : filteredCars.map((car) => {
              return (
                <Card
                  key={
                    car.id ??
                    `${car.name}-${Math.random().toString(36).slice(2)}`
                  }
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
                <CarIdentity
                  brand={car?.raw?.info_make || car.name}
                  model={car?.raw?.info_model}
                  type={car?.raw?.info_carType}
                />

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
                        onClick={() => onOpenInfo(car)}
                      >
                        Info
                      </Button>
                      <Button
                        flex={1}
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<FaEdit />}
                        onClick={() => onEdit(car)}
                      >
                        Edit
                      </Button>
                      <Button
                        flex={1}
                        size="sm"
                        colorScheme="red"
                        leftIcon={<FaTrash />}
                        onClick={() => onDelete(car)}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </CardFooter>
                </Card>
              );
            })}
      </Grid>

      <Pagination
        page={page}
        limit={limit}
        hasNext={hasNext}
        meta={meta}
        onChange={(p, l) => dispatch(fetchCars({ page: p, limit: l }))}
      />

      <BaseModal
        title={selectedCar?.name || ""}
        isOpen={isModalOpen}
        onClose={onModalClose}
        size="4xl"
      >
        <BaseSlider
          images={buildSliderImages(selectedCar)}
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
