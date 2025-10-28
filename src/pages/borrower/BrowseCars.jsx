import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid,
  Spinner,
  Stack,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiMapPin, FiNavigation2, FiRefreshCw, FiSearch } from "react-icons/fi";
import CarCard from "./dashboard/components/CarCard";
import BookingRequestModal from "./dashboard/components/BookingRequestModal";
import { listCarsApi, mapCarToViewModel } from "../../services/cars";
import { listNearbyCompaniesApi } from "../../services/companies";
import NearestCompaniesMap from "./dashboard/components/NearestCompaniesMap";

const initialSearchCriteria = {
  pickupLocation: "",
  dropoffLocation: "",
  pickupDate: "",
  pickupTime: "",
  returnDate: "",
  returnTime: "",
  query: "",
};

const initialFilters = {
  gearType: "all",
  fuelType: "all",
  brand: "all",
  vehicleClass: "all",
  company: "all",
};

function normalizeValue(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function getRateValue(car) {
  if (!car) return 0;
  const daily = Number(car?.rates?.daily || car?.raw?.rates?.daily || 0);
  const hourly = Number(car?.rates?.hourly || car?.raw?.rates?.hourly || 0);
  if (daily > 0) return daily;
  if (hourly > 0) return hourly;
  return Number(car?.raw?.rates?.[0]?.rate || 0) || 0;
}

function formatDistance(meters) {
  if (!Number.isFinite(Number(meters))) return null;
  const value = Number(meters);
  if (value >= 1000) {
    const km = value / 1000;
    return `${km >= 10 ? Math.round(km) : km.toFixed(1)} km`;
  }
  if (value >= 100) {
    return `${Math.round(value / 10) * 10} m`;
  }
  return `${Math.max(1, Math.round(value))} m`;
}

function formatUpdatedLabel(timestamp) {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return null;
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  if (diffMinutes <= 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} mins ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
  }
  return date.toLocaleDateString();
}

function getTopCars(cars = [], limit = 3) {
  if (!Array.isArray(cars)) return [];
  return cars
    .filter((car) => car && (car.name || car.model || car.title))
    .slice(0, limit);
}

function formatRate(rate, rateType) {
  const numeric = Number(rate);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  const formatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: numeric >= 1000 ? 0 : 2,
  });
  const type = typeof rateType === "string" ? rateType.toLowerCase() : "";
  const suffix =
    type === "daily"
      ? "/day"
      : type === "hourly"
      ? "/hour"
      : type === "monthly"
      ? "/month"
      : type
      ? `/${type}`
      : "";
  return `${formatter.format(numeric)}${suffix}`;
}

function NearestCompaniesSection({
  loading,
  error,
  companies,
  meta,
  onLocate,
  onRefresh,
  onSelectCompany,
  lastUpdated,
  userCoords,
  searchRadius,
  activeCompanyId,
  onMarkerClick,
}) {
  const hasResults = Array.isArray(companies) && companies.length > 0;
  const updatedLabel = formatUpdatedLabel(lastUpdated);
  const radiusMeters = Number(meta?.radius ?? searchRadius ?? 0) || 0;
  const radiusLabel =
    radiusMeters > 0
      ? radiusMeters >= 1000
        ? `${Math.round(radiusMeters / 1000)} km`
        : `${radiusMeters} m`
      : null;

  return (
    <Stack spacing={5} h="100%">
      <Box
        position="relative"
        borderRadius="2xl"
        overflow="hidden"
        borderWidth="1px"
        borderColor="rgba(148, 163, 184, 0.3)"
        shadow="xl"
        bg="white"
        minH={{ base: "320px", xl: "560px" }}
      >
        <Box
          position="absolute"
          top={4}
          left={4}
          zIndex={1000}
          bg="white"
          borderRadius="lg"
          shadow="md"
          px={4}
          py={3}
        >
          <Stack spacing={2}>
            <Stack spacing={1}>
              <HStack spacing={2} align="center">
                <Icon as={FiMapPin} color="blue.500" boxSize={4} />
                <Text fontWeight="bold" fontSize="md">
                  Find cars near you
                </Text>
              </HStack>
              <Text fontSize="xs" color="gray.500" maxW="220px">
                Use your current location to discover partner fleets around you.
              </Text>
              {updatedLabel && (
                <Text fontSize="10px" color="gray.400">
                  Updated {updatedLabel}
                </Text>
              )}
              {radiusLabel && (
                <Badge colorScheme="blue" borderRadius="full" width="fit-content">
                  within {radiusLabel}
                </Badge>
              )}
            </Stack>
            <HStack spacing={2}>
              <Button
                size="sm"
                colorScheme="blue"
                leftIcon={<FiNavigation2 />}
                onClick={onLocate}
                isLoading={loading && !hasResults}
                loadingText="Locating"
              >
                {hasResults ? "Refresh" : "Nearest cars"}
              </Button>
              {hasResults && (
                <Button size="sm" variant="ghost" onClick={onRefresh} isLoading={loading && hasResults}>
                  Update
                </Button>
              )}
            </HStack>
          </Stack>
        </Box>

        {error && (
          <Box position="absolute" top={4} right={4} zIndex={1000} maxW="260px">
            <Alert status="warning" variant="subtle" borderRadius="md">
              <AlertIcon />
              <Text fontSize="sm">{error}</Text>
            </Alert>
          </Box>
        )}

        <NearestCompaniesMap
          companies={companies}
          userCoords={userCoords}
          radiusMeters={radiusMeters || undefined}
          activeCompanyId={activeCompanyId}
          onMarkerClick={onMarkerClick}
        />
      </Box>

      {hasResults ? (
        <Stack spacing={3}>
          <Text fontWeight="semibold" color="gray.700">
            Nearby companies
          </Text>
          <SimpleGrid columns={{ base: 1 }} spacing={4}>
            {companies.map((company) => (
              <NearestCompanyCard
                key={company.id || company.name}
                company={company}
                isActive={activeCompanyId === company.id}
                onSelect={() => onSelectCompany?.(company)}
              />
            ))}
          </SimpleGrid>
        </Stack>
      ) : loading ? (
        <Center py={6}>
          <Stack spacing={2} align="center">
            <Spinner size="md" color="blue.500" />
            <Text fontSize="sm" color="gray.600">
              Looking for nearby fleets…
            </Text>
          </Stack>
        </Center>
      ) : (
        <Box
          borderWidth="1px"
          borderRadius="lg"
          borderStyle="dashed"
          borderColor="blue.200"
          bg="whiteAlpha.700"
          py={6}
          px={4}
        >
          <Stack spacing={2} align="center" textAlign="center">
            <Icon as={FiMapPin} boxSize={6} color="blue.400" />
            <Text fontWeight="semibold">Ready when you are</Text>
            <Text fontSize="sm" color="gray.600">
              Tap “Nearest cars” to let us know where you are and we’ll surface fleets closest to you.
            </Text>
          </Stack>
        </Box>
      )}
    </Stack>
  );
}

function NearestCompanyCard({ company, onSelect, isActive }) {
  const distanceLabel = formatDistance(company?.distance_m ?? company?.distance);
  const vehicles = getTopCars(company?.cars);

  return (
    <Stack
      spacing={3}
      borderWidth="1px"
      borderRadius="xl"
      bg="white"
      p={5}
      shadow={isActive ? "lg" : "md"}
      borderColor={isActive ? "blue.300" : "rgba(148, 163, 184, 0.25)"}
      _hover={{ shadow: "lg", borderColor: "blue.200" }}
      transition="all 0.2s ease"
    >
      <Flex justify="space-between" align="flex-start" gap={3}>
        <Stack spacing={1}>
          <Text fontWeight="semibold" fontSize="md" noOfLines={1}>
            {company?.name || "Company"}
          </Text>
          {company?.address && (
            <Text fontSize="sm" color="gray.600" noOfLines={2}>
              {company.address}
            </Text>
          )}
        </Stack>
        {distanceLabel && (
          <Badge colorScheme="blue" borderRadius="full" px={2}>
            {distanceLabel}
          </Badge>
        )}
      </Flex>

      {vehicles.length > 0 ? (
        <Stack spacing={2}>
          <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide">
            Available cars
          </Text>
          <Stack spacing={1}>
            {vehicles.map((car) => (
              <HStack key={car.id || car.name} spacing={3} align="flex-start" py={1}>
                <Box w="10px" h="10px" borderRadius="full" bg="blue.400" />
                <Stack spacing={0.5} flex="1" minW={0}>
                  <Text fontSize="sm" color="gray.700" noOfLines={1}>
                    {car.name || car.model || car.title || "Vehicle"}
                    {formatRate(car.rate ?? car.rate_value, car.rate_type ?? car.rateType) ? (
                      <Text as="span" fontSize="sm" color="gray.500">
                        {" "}
                        · {formatRate(car.rate ?? car.rate_value, car.rate_type ?? car.rateType)}
                      </Text>
                    ) : null}
                  </Text>
                  {car.location && (
                    <Text fontSize="xs" color="gray.500" noOfLines={1}>
                      {car.location}
                    </Text>
                  )}
                </Stack>
                {car.availability_status && (
                  <Badge
                    colorScheme={
                      String(car.availability_status).toLowerCase() === "available" ? "green" : "gray"
                    }
                    borderRadius="full"
                    px={2}
                    fontSize="0.7rem"
                    textTransform="capitalize"
                    whiteSpace="nowrap"
                  >
                    {car.availability_status}
                  </Badge>
                )}
              </HStack>
            ))}
          </Stack>
        </Stack>
      ) : (
        <Text fontSize="sm" color="gray.500">
          Fleet details loading soon.
        </Text>
      )}

      <Button
        size="sm"
        colorScheme="blue"
        variant={isActive ? "solid" : "outline"}
        alignSelf="flex-start"
        onClick={onSelect}
      >
        View cars from this company
      </Button>
    </Stack>
  );
}

export default function BorrowerBrowseCars() {
  const [cars, setCars] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchCriteria, setSearchCriteria] = useState(initialSearchCriteria);
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState("recommended");
  const [availableOnly, setAvailableOnly] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [nearestCompanies, setNearestCompanies] = useState([]);
  const [nearestMeta, setNearestMeta] = useState(null);
  const [nearestLoading, setNearestLoading] = useState(false);
  const [nearestError, setNearestError] = useState(null);
  const [nearestCoords, setNearestCoords] = useState(null);
  const [nearestUpdatedAt, setNearestUpdatedAt] = useState(null);
  const [activeCompanyId, setActiveCompanyId] = useState(null);
  const bookingModal = useDisclosure();
  const carListRef = useRef(null);

  const NEAREST_SEARCH_RADIUS = 40000; // 40 km
  const NEAREST_SEARCH_LIMIT = 12;

  const fetchCars = async (refresh = false) => {
    setError(null);
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const response = await listCarsApi({
        page: 1,
        limit: 60,
        includes: ["rates", "company", "bookings", "next_available_window"],
        filters: { company_id: "" },
      });
      const payload = response || {};
      const rawItems = Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload?.data?.data)
        ? payload.data.data
        : Array.isArray(payload.items)
        ? payload.items
        : [];
      const mapped = rawItems.map((item) => mapCarToViewModel(item)).filter(Boolean);
      setCars(mapped);
      setMeta(payload.meta || null);
    } catch (err) {
      setError(
        err?.response?.data?.message || err?.message || "Failed to load vehicles"
      );
    } finally {
      if (refresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCars(false);
  }, []);

  const filterOptions = useMemo(() => {
    const gearTypes = new Set();
    const fuelTypes = new Set();
    const brands = new Set();
    const vehicleClasses = new Set();
    const companies = new Map();

    cars.forEach((car) => {
      const raw = car.raw || {};
      const specs = Array.isArray(car.specification) ? car.specification : [];
      const specMap = specs.reduce((acc, spec) => {
        if (spec?.key) acc[spec.key] = spec.value;
        return acc;
      }, {});

      if (car?.transmission) {
        gearTypes.add(car.transmission);
      } else if (specMap.transmission) {
        gearTypes.add(specMap.transmission);
      }

      if (car?.fuel_type) {
        fuelTypes.add(car.fuel_type);
      } else if (specMap.fuel_type) {
        fuelTypes.add(specMap.fuel_type);
      }

      if (car?.brand) brands.add(car.brand);
      if (car?.vehicle_class) vehicleClasses.add(car.vehicle_class);

      const companyId = raw?.company?.id ?? raw?.company_id ?? car.company_id ?? car?.company?.id;
      const companyName = raw?.company?.name ?? car?.company?.name ?? raw?.company_name;
      if (companyId || companyName) {
        const key = companyId ?? companyName;
        if (!companies.has(key)) {
          companies.set(key, {
            id: companyId ?? companyName,
            name: companyName ?? "Company",
          });
        }
      }
    });

    const sortStrings = (values) =>
      Array.from(values)
        .map((value) => String(value || "").trim())
        .filter((value) => value.length > 0)
        .sort((a, b) => a.localeCompare(b));

    const companyList = Array.from(companies.values()).sort((a, b) =>
      (a.name || "").localeCompare(b.name || "")
    );

    return {
      gearTypes: sortStrings(gearTypes),
      fuelTypes: sortStrings(fuelTypes),
      brands: sortStrings(brands),
      vehicleClasses: sortStrings(vehicleClasses),
      companies: companyList,
    };
  }, [cars]);

  const filteredCars = useMemo(() => {
    const matchesSearch = (car) => {
      const query = normalizeValue(searchCriteria.query);
      if (!query) return true;
      const haystack = [
        car.name,
        car.brand,
        car.model,
        car.vehicle_class,
        car.company?.name,
        ...((car.specification || []).map((spec) => spec?.value ?? "")),
      ]
        .filter(Boolean)
        .map(normalizeValue);
      return haystack.some((value) => value.includes(query));
    };

    const matchesFilters = (car) => {
      if (filters.vehicleClass !== "all" && normalizeValue(car.vehicle_class) !== normalizeValue(filters.vehicleClass)) {
        return false;
      }
      if (filters.company !== "all") {
        const companyName = normalizeValue(car.company?.name || car.raw?.company?.name || "");
        if (companyName !== normalizeValue(filters.company)) {
          return false;
        }
      }
      if (filters.brand !== "all" && normalizeValue(car.brand) !== normalizeValue(filters.brand)) {
        return false;
      }
      if (filters.gearType !== "all") {
        const transmission = normalizeValue(car.transmission || car.raw?.transmission || "");
        if (transmission !== normalizeValue(filters.gearType)) {
          return false;
        }
      }
      if (filters.fuelType !== "all") {
        const fuel = normalizeValue(car.fuel_type || car.raw?.fuel_type || "");
        if (fuel !== normalizeValue(filters.fuelType)) {
          return false;
        }
      }
      if (availableOnly) {
        const isAvailable = car?.availability_status
          ? normalizeValue(car.availability_status) === "available"
          : !car?.raw?.is_booked;
        if (!isAvailable) return false;
      }
      return true;
    };

    const sorted = cars
      .filter(matchesSearch)
      .filter(matchesFilters)
      .slice();

    if (sortBy === "price-asc") {
      sorted.sort((a, b) => getRateValue(a) - getRateValue(b));
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => getRateValue(b) - getRateValue(a));
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else {
      sorted.sort((a, b) => {
        const aAvailable = a.availability_status === "Available" ? 1 : 0;
        const bAvailable = b.availability_status === "Available" ? 1 : 0;
        if (aAvailable !== bAvailable) return bAvailable - aAvailable;
        return getRateValue(a) - getRateValue(b);
      });
    }

    return sorted;
  }, [
    cars,
    searchCriteria,
    filters,
    sortBy,
    availableOnly,
  ]);

  const extractCompanies = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.results)) return payload.results;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    return [];
  };

  const fetchNearestCompanies = async (
    coords,
    { skipLoadingState = false } = {}
  ) => {
    if (!coords) return;
    if (!skipLoadingState) {
      setNearestLoading(true);
    }
    setNearestError(null);
    try {
      const res = await listNearbyCompaniesApi({
        lat: coords.latitude,
        lng: coords.longitude,
        radius: NEAREST_SEARCH_RADIUS,
        limit: NEAREST_SEARCH_LIMIT,
        with_cars: true,
      });
      const companies = extractCompanies(res);
      setNearestCompanies(companies);
      setNearestMeta(res?.meta || null);
      setNearestUpdatedAt(new Date().toISOString());
      if (companies.length > 0) {
        let nextActive = null;
        if (filters.company && filters.company !== "all") {
          const match = companies.find(
            (item) => (item.name || "").toLowerCase() === filters.company.toLowerCase()
          );
          nextActive = match?.id ?? null;
        } else {
          nextActive = companies[0]?.id ?? null;
        }
        setActiveCompanyId(nextActive);
      } else {
        setActiveCompanyId(null);
      }
    } catch (err) {
      setNearestError(
        err?.response?.data?.message || err?.message || "Unable to load nearby companies right now."
      );
    } finally {
      setNearestLoading(false);
    }
  };

  const handleFindNearest = () => {
    if (nearestLoading) return;
    setNearestError(null);
    if (typeof window === "undefined" || !navigator?.geolocation) {
      setNearestError(
        "Location services are not available in your browser. Try updating your settings."
      );
      return;
    }

    setNearestLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { latitude, longitude };
        setNearestCoords(coords);
        fetchNearestCompanies(coords, { skipLoadingState: true });
      },
      (error) => {
        setNearestLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          setNearestError(
            "We couldn't access your location. Please allow location access and try again."
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setNearestError("Location information is currently unavailable. Please try again shortly.");
        } else if (error.code === error.TIMEOUT) {
          setNearestError("Taking too long to find your location. Try again with a better signal.");
        } else {
          setNearestError("Unable to determine your location. Please try again.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleRefreshNearest = () => {
    if (nearestCoords) {
      fetchNearestCompanies(nearestCoords);
    } else {
      handleFindNearest();
    }
  };

  const focusCarResults = () => {
    if (carListRef.current) {
      carListRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSelectNearestCompany = (company) => {
    if (!company) return;
    if (company.id !== undefined && company.id !== null) {
      setActiveCompanyId(company.id);
    }
    if (company.name) {
      setFilters((prev) => ({ ...prev, company: company.name }));
    }
    setTimeout(focusCarResults, 120);
  };

  const handleFilterChange = (partial) => {
    setFilters((prev) => {
      const next = { ...prev, ...(partial || {}) };
      if (partial && Object.prototype.hasOwnProperty.call(partial, "company")) {
        const value = next.company;
        if (!value || value === "all") {
          setActiveCompanyId(null);
        } else {
          const match = nearestCompanies.find(
            (company) => (company.name || "").toLowerCase() === value.toLowerCase()
          );
          setActiveCompanyId(match?.id ?? null);
        }
      }
      return next;
    });
  };

  const handleCriteriaChange = (partial) => {
    setSearchCriteria((prev) => ({ ...prev, ...(partial || {}) }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setActiveCompanyId(null);
  };

  const handleRefresh = () => {
    fetchCars(true);
  };

  const handleBook = (car) => {
    setSelectedCar(car);
    bookingModal.onOpen();
  };

  useEffect(() => {
    if (!filters.company || filters.company === "all") return;
    const match = nearestCompanies.find(
      (company) => (company.name || "").toLowerCase() === filters.company.toLowerCase()
    );
    if (match && match.id !== activeCompanyId) {
      setActiveCompanyId(match.id);
    }
  }, [nearestCompanies, filters.company, activeCompanyId]);

  const totalVehicles = filteredCars.length || meta?.total || cars.length;

  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 8, md: 12 }}>
      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <Stack spacing={{ base: 6, md: 10 }}>
          <Flex direction={{ base: "column", xl: "row" }} gap={{ base: 8, xl: 10 }} align="stretch">
            <Box flex={{ base: "1 1 auto", xl: "0 0 48%" }}>
              <NearestCompaniesSection
                loading={nearestLoading}
                error={nearestError}
                companies={nearestCompanies}
                meta={nearestMeta}
                onLocate={handleFindNearest}
                onRefresh={handleRefreshNearest}
                onSelectCompany={handleSelectNearestCompany}
                lastUpdated={nearestUpdatedAt}
                userCoords={nearestCoords}
                searchRadius={NEAREST_SEARCH_RADIUS}
                activeCompanyId={activeCompanyId}
                onMarkerClick={handleSelectNearestCompany}
              />
            </Box>

            <Box flex={{ base: "1 1 auto", xl: "0 0 52%" }}>
              <Stack spacing={6} h="100%">
                <Box
                  borderWidth="1px"
                  borderRadius="2xl"
                  bg="white"
                  shadow="xl"
                  px={{ base: 4, md: 6 }}
                  py={{ base: 5, md: 6 }}
                >
                  <Stack spacing={4}>
                    <Flex
                      align={{ base: "flex-start", md: "center" }}
                      justify="space-between"
                      direction={{ base: "column", md: "row" }}
                      gap={3}
                    >
                      <Stack spacing={1}>
                        <Text fontSize="lg" fontWeight="bold">
                          Find a car
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Search by make, model, keyword, or filter by price and availability.
                        </Text>
                      </Stack>
                      <Button
                        leftIcon={<FiRefreshCw />}
                        variant="ghost"
                        size="sm"
                        onClick={handleRefresh}
                        isLoading={refreshing}
                      >
                        Refresh
                      </Button>
                    </Flex>

                    <InputGroup>
                      <InputLeftElement pointerEvents="none" color="gray.400">
                        <FiSearch />
                      </InputLeftElement>
                      <Input
                        placeholder="Search make, model, keyword"
                        value={searchCriteria.query}
                        onChange={(event) => handleCriteriaChange({ query: event.target.value })}
                        size="lg"
                        bg="gray.100"
                        borderRadius="lg"
                        _focus={{ bg: "white", borderColor: "blue.400" }}
                      />
                    </InputGroup>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                      <Select value={sortBy} onChange={(event) => setSortBy(event.target.value)} size="md">
                        <option value="recommended">Recommended</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="newest">Newest vehicles</option>
                      </Select>
                      <HStack
                        spacing={3}
                        justify="space-between"
                        borderWidth="1px"
                        borderRadius="lg"
                        px={4}
                        py={2}
                      >
                        <Stack spacing={0}>
                          <Text fontSize="sm" fontWeight="semibold">
                            Only show available
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            Hide vehicles currently booked
                          </Text>
                        </Stack>
                        <Switch
                          colorScheme="blue"
                          isChecked={availableOnly}
                          onChange={(event) => setAvailableOnly(event.target.checked)}
                        />
                      </HStack>
                    </SimpleGrid>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
                      <Select
                        value={filters.vehicleClass}
                        onChange={(event) =>
                          handleFilterChange({ vehicleClass: event.target.value })
                        }
                      >
                        <option value="all">All car types</option>
                        {filterOptions.vehicleClasses.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                      <Select
                        value={filters.company}
                        onChange={(event) => handleFilterChange({ company: event.target.value })}
                      >
                        <option value="all">All companies</option>
                        {filterOptions.companies.map((company) => (
                          <option key={company.id || company.name} value={company.name}>
                            {company.name}
                          </option>
                        ))}
                      </Select>
                    </SimpleGrid>

                    <HStack justify="flex-end" spacing={3}>
                      <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                        Clear filters
                      </Button>
                    </HStack>
                  </Stack>
                </Box>

                {error && (
                  <Alert status="error" borderRadius="lg">
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                <Box flex="1" ref={carListRef}>
                  {loading ? (
                    <Center py={12}>
                      <Stack spacing={3} align="center">
                        <Spinner size="lg" color="blue.500" />
                        <Text color="gray.600">Loading vehicles…</Text>
                      </Stack>
                    </Center>
                  ) : filteredCars.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
                      {filteredCars.map((car) => (
                        <CarCard key={car.id} car={car} onBook={handleBook} />
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Center py={16}>
                      <Stack spacing={3} textAlign="center">
                        <Text fontWeight="bold" fontSize="lg">
                          No vehicles match your filters yet
                        </Text>
                        <Text color="gray.600">
                          Adjust your search to discover more options.
                        </Text>
                        <Button onClick={handleClearFilters} colorScheme="blue">
                          Reset filters
                        </Button>
                      </Stack>
                    </Center>
                  )}
                </Box>
              </Stack>
            </Box>
          </Flex>
        </Stack>
      </Container>

      <BookingRequestModal
        isOpen={bookingModal.isOpen}
        onClose={() => {
          bookingModal.onClose();
          setSelectedCar(null);
        }}
        car={selectedCar}
        defaults={searchCriteria}
      />
    </Box>
  );
}
