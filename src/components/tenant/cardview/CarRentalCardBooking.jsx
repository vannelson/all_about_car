import {
  Card,
  Box,
  Image,
  Text,
  HStack,
  VStack,
  Flex,
  Button,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { FiUsers, FiSettings, FiArrowRight } from "react-icons/fi";
import { BsFuelPump } from "react-icons/bs";
import CarBrandLogo from "../../tenant/CarBrandLogo";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCars } from "../../../store/carsSlice";
import CarRentalCardSkeleton from "../loading/CarRentalCardSkeleton";
import { getCarIdFromCard } from "../../../utils/cars";

function toApiFilters(ui) {
  const f = {};
  if (!ui) return f;
  if (ui.brand) f["info_make"] = ui.brand;
  if (ui.gear) f["spcs_transmission"] = ui.gear;
  if (ui.fuel) f["spcs_fuelType"] = ui.fuel;
  if (ui.availability) f["info_availabilityStatus"] = ui.availability;
  if (ui.search) f["info_model"] = ui.search; // simple search by model
  // Date range filters (backend should interpret for availability)
  if (ui.start_date) f["start_date"] = ui.start_date;
  if (ui.end_date) f["end_date"] = ui.end_date;
  return f;
}

function getSpecIcon(label) {
  const l = String(label || "").toLowerCase();
  if (l.includes("seat")) return FiUsers;
  if (l.includes("auto") || l.includes("manual")) return FiSettings;
  if (
    l.includes("gas") ||
    l.includes("fuel") ||
    l.includes("petrol") ||
    l.includes("diesel") ||
    l.includes("electric")
  )
    return BsFuelPump;
  return null;
}

function SpecItem({ label }) {
  const IconCmp = getSpecIcon(label);
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={1}
      fontSize="sm"
      color="gray.700"
    >
      {IconCmp && <Icon as={IconCmp} boxSize={4} color="gray.600" mr={2} />}
      {label}
    </Box>
  );
}

export default function CarRentalCardBooking({ filters, onRent }) {
  const dispatch = useDispatch();
  const [selectedId, setSelectedId] = useState(null);
  const { items: storeItems, listLoading } = useSelector((s) => s.cars);

  useEffect(() => {
    dispatch(fetchCars({ page: 1, limit: 10, filters: toApiFilters(filters) }));
  }, [dispatch, filters]);

  const cars = useMemo(() => {
    return (storeItems || []).slice(0, 10).map((vm) => {
      const raw = vm?.raw || {};
      const brand = raw.info_make || "";
      const model = raw.info_model || vm.name || "";
      const price = vm.rateAmount || "0";
      const transmission = raw.spcs_transmission
        ? String(raw.spcs_transmission).replace(/\b\w/g, (c) => c.toUpperCase())
        : null;
      const seats = raw.spcs_seats != null ? `${raw.spcs_seats} seats` : null;
      const fuel = raw.spcs_fuelType || null;
      const specs = [transmission, seats, fuel].filter(Boolean).slice(0, 3);
      const image = vm.image;
      const available =
        String(raw.info_availabilityStatus || "").toLowerCase() === "available";
      const companyName = raw.company?.name ? `Host - ${raw.company.name}` : "";

      // Prefer active daily, else hourly
      const hasDaily = Number(vm?.rates?.daily || 0) > 0;
      const hasHourly = Number(vm?.rates?.hourly || 0) > 0;
      const unit = hasDaily ? "day" : hasHourly ? "hour" : "day";

      return {
        id: vm.id,
        brand,
        model,
        owner: companyName,
        image,
        rating: 0,
        price,
        unit,
        specs,
        available,
      };
    });
  }, [storeItems]);

  // Persist selected car info (full raw payload) to localStorage whenever selection changes
  useEffect(() => {
    try {
      const selected = (cars || []).find((c) => c.id === selectedId);
      if (selected) {
        const id = getCarIdFromCard(selected) || selected.id;
        // find the full VM from Redux items to fetch the raw payload
        const fullVm = (storeItems || []).find((vm) => Number(vm?.id) === Number(id));
        const payload = fullVm?.raw || { id, brand: selected.brand, model: selected.model };
        localStorage.setItem("selectedCarInfo", JSON.stringify(payload));
      }
    } catch {}
  }, [selectedId, cars]);

  return (
    <Box
      position="sticky"
      top="72px"
      maxH="calc(100vh - 100px)"
      overflowY="auto"
      className="no-scrollbar"
    >
      <div className="flex flex-col items-center gap-3 px-3 py-3">
        {listLoading &&
          cars.length === 0 &&
          Array.from({ length: 3 }).map((_, idx) => (
            <CarRentalCardSkeleton key={`sk-${idx}`} />
          ))}
        {!listLoading && cars.length === 0 && (
          <Text fontSize="sm" color="gray.500">
            No cars found.
          </Text>
        )}
        {cars.map((car) => {
          const selected = selectedId === car.id;
          const baseClasses =
            "group overflow-hidden rounded-xl transition-all duration-150";
          return (
            <Card
              key={car.id}
              onClick={() => setSelectedId(car.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedId(car.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-pressed={selected}
              aria-selected={selected}
              variant="unstyled"
              w="100%"
              h="150px"
              boxShadow={selected ? "lg" : "none"}
              bg="white"
              bgGradient="linear(to-r, white, gray.50)"
              position="relative"
              className={`${baseClasses} ${
                selected
                  ? "border-2 border-blue-500 shadow-lg"
                  : "border border-gray-200 hover:border-blue-300"
              }`}
            >
              {selected && (
                <Box
                  pos="absolute"
                  right="0"
                  top="0"
                  bottom="0"
                  w="4px"
                  bgGradient="linear(to-b, blue.700, blue.600, blue.700)"
                />
              )}
              <Flex h="100%">
                {/* Image */}
                <Box pos="relative" w="150px" h="100%" className="shrink-0">
                  <Image
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    className="transition duration-200 group-hover:scale-[1.01]"
                    loading="lazy"
                  />
                  {car.available && (
                    <Box pos="absolute" top="8px" left="8px">
                      <Badge
                        colorScheme="green"
                        variant="solid"
                        className="rounded-md px-2 py-0.5 text-[10px]"
                      >
                        Available
                      </Badge>
                    </Box>
                  )}
                  {/* Removed Selected badge; elevation + border indicate selection */}
                  <HStack
                    pos="absolute"
                    bottom="8px"
                    left="8px"
                    spacing={1}
                    bg="whiteAlpha.900"
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    boxShadow="sm"
                    className="backdrop-blur-sm"
                  >
                    <Icon as={FaStar} color="yellow.400" boxSize={3} mr={1} />
                    <Text fontSize="xs" fontWeight="medium">
                      {Number(car.rating || 0).toFixed(1)}
                    </Text>
                  </HStack>
                </Box>

                {/* Content */}
                <Flex flex="1" justify="space-between" p={2}>
                  <VStack align="flex-start" spacing={1} flex="1" pr={2}>
                    <Box>
                      <HStack spacing={2} align="center">
                        <CarBrandLogo brand={car.brand} size={18} mr={1} />
                        <HStack spacing={2} align="baseline">
                          <Text
                            fontWeight="semibold"
                            textTransform="uppercase"
                            letterSpacing="wider"
                            className="tracking-wide text-gray-800"
                            noOfLines={1}
                            title={car.model}
                          >
                            {car.model}
                          </Text>
                        </HStack>
                      </HStack>
                      <Text
                        fontSize="sm"
                        fontWeight="semibold"
                        noOfLines={1}
                        ml="6"
                        className="text-gray-500"
                      >
                        {car.brand}
                      </Text>
                    </Box>

                    <VStack align="start" spacing={1} mt={1}>
                      {car.specs.map((s) => (
                        <SpecItem key={s} label={s} />
                      ))}
                    </VStack>
                  </VStack>

                  <VStack align="flex-end" justify="space-between" w="110px">
                    <Box textAlign="right">
                      <Text fontSize="xl" fontWeight="bold" color="gray.600">
                        {car.price}
                      </Text>
                      <Text
                        fontSize="10px"
                        color="gray.500"
                      >{`per ${car.unit}`}</Text>
                    </Box>
                    <Button
                      size="sm"
                      rightIcon={<FiArrowRight />}
                      bgGradient="linear(to-r, blue.700, blue.600, blue.700)"
                      color="white"
                      borderRadius="md"
                      className="px-3 py-1.5 text-xs font-semibold"
                      _hover={{
                        bgGradient:
                          "linear(to-r, blue.800, blue.700, blue.800)",
                        transform: "translateY(-1px)",
                        boxShadow: "md",
                      }}
                      _active={{ transform: "translateY(0)" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(car.id);
                        try {
                          const id = getCarIdFromCard(car) || car.id;
                          const fullVm = (storeItems || []).find((vm) => Number(vm?.id) === Number(id));
                          const payload = fullVm?.raw || { id, brand: car.brand, model: car.model };
                          localStorage.setItem("selectedCarInfo", JSON.stringify(payload));
                        } catch {}
                        onRent && onRent(car);
                      }}
                    >
                      Rent Now
                    </Button>
                  </VStack>
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </div>
    </Box>
  );
}
