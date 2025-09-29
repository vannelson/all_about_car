import { useEffect, useMemo, useState, useCallback } from "react";
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

import { InfoIcon } from "@chakra-ui/icons";

import {
  FaBolt,
  FaGasPump,
  FaCogs,
  FaCalendarAlt,
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
import BaseModal from "../../base/BaseModal";
import BaseSlider from "../../base/BaseSlider";
import CarProfile from "../CarProfile";
import { useDispatch, useSelector } from "react-redux";
import { fetchCars } from "../../../store/carsSlice";
import TableCarRowSkeleton from "../skeletons/TableCarRowSkeleton";
import Pagination from "../Pagination";
import CarIdentity from "../CarIdentity";
import RateCreateModal from "../rates/RateCreateModal";

// Build slider images array for BaseSlider from selected car
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

const TableCar = ({ query = "", filters = {}, mode = "view" }) => {
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

  useEffect(() => {
    const hasFilters = Object.keys(apiFilters).length > 0;
    if (hasFilters) {
      dispatch(fetchCars({ page: 1, limit: limit || 6, filters: apiFilters }));
    } else {
      dispatch(fetchCars({ page: 1, limit: limit || 6 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFilters]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCar, setSelectedCar] = useState(null);
  const {
    isOpen: isRateOpen,
    onOpen: onRateOpen,
    onClose: onRateClose,
  } = useDisclosure();

  const onOpenModal = useCallback(
    (car) => {
      setSelectedCar(car);
      onOpen();
    },
    [onOpen]
  );

  const onEdit = useCallback(
    (car) => {
      setSelectedCar(car);
      onOpen();
    },
    [onOpen]
  );

  const onDelete = useCallback((car) => {
    // eslint-disable-next-line no-alert
    alert(`Delete ${car?.name || "unit"} (not yet implemented)`);
  }, []);

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

  // Apply basic filtering on the client
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
          {listLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
                <TableCarRowSkeleton key={`sk-${idx}`} />
              ))
            : filteredCars.map((car, idx) => {
                const total = car.charge + car.extraCharge;

                return (
                  <Tr
                    key={car.id ?? `row-${idx}`}
                    _hover={{ bg: "gray.50" }}
                    bg={car.status === "Overdue" ? "red.50" : "transparent"}
                  >
                    {/* Car Info */}
                    <Td>
                      <Flex align="flex-start" gap={3}>
                        <Image
                          src={car.image}
                          alt={car.name}
                          boxSize="150px"
                          borderRadius="md"
                          objectFit="cover"
                        />
                        <Box minW={0}>
                          <CarIdentity
                            brand={car?.raw?.info_make || car.name}
                            model={car?.raw?.info_model}
                            type={car?.raw?.info_carType}
                          />
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
                      {car.status != "Available" && car.booking ? (
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
                      <CarRates rates={car.rates} direction={"vertical"} />
                    </Td>

                    {/* Payment Details */}
                    <Td>
                      {car.status != "Available" ? (
                        <PaymentPanel
                          bgColor="white"
                          rateAmount={car.rateAmount}
                          extraCharge={car.extraCharge}
                        />
                      ) : (
                        ""
                      )}
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
                    <Td textAlign="center" px={2} py={3}>
                      <Stack
                        direction="column"
                        spacing={2}
                        w="full"
                        align="stretch"
                      >
                        {/* Edit */}
                        <Button
                          size="sm"
                          w="full"
                          colorScheme="blue"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(car);
                          }}
                        >
                          Edit
                        </Button>

                        {/* Delete */}
                        <Button
                          size="sm"
                          w="full"
                          colorScheme="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(car);
                          }}
                        >
                          Delete
                        </Button>

                        {/* Rate */}
                        <Button
                          size="sm"
                          w="full"
                          colorScheme="purple"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCar(car);
                            onRateOpen();
                          }}
                        >
                          Rate
                        </Button>

                        {/* More */}
                        <Button
                          size="sm"
                          w="full"
                          variant="outline"
                          leftIcon={<InfoIcon color={iconColor} />}
                          onClick={() => onOpenModal(car)}
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
      {/* Details Modal */}
      <BaseModal
        title={selectedCar?.name || "Car Details"}
        isOpen={isOpen}
        onClose={onClose}
        size="4xl"
      >
        {selectedCar && (
          <>
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
          </>
        )}
      </BaseModal>
      <RateCreateModal isOpen={isRateOpen} onClose={onRateClose} car={selectedCar} />
      <Pagination
        page={page}
        limit={limit}
        hasNext={hasNext}
        meta={meta}
        onChange={(p, l) => dispatch(fetchCars({ page: p, limit: l }))}
      />
    </Box>
  );
};

export default TableCar;
