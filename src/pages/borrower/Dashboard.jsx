import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Badge,
  Center,
  Container,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiMapPin, FiNavigation2, FiRefreshCw } from "react-icons/fi";
import SearchHero from "./dashboard/components/SearchHero";
import FilterToolbar from "./dashboard/components/FilterToolbar";
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
}) {
  const hasResults = Array.isArray(companies) && companies.length > 0;
  const updatedLabel = formatUpdatedLabel(lastUpdated);
  const radiusMeters = Number(meta?.radius ?? searchRadius ?? 0) || 0;
  const radiusKmLabel =
    radiusMeters > 0
      ? radiusMeters >= 1000
        ? `${Math.round(radiusMeters / 1000)} km`
        : `${radiusMeters} m`
      : null;

  return (
    <Box
      borderWidth="1px"
      borderRadius="2xl"
      px={{ base: 4, md: 6 }}
      py={{ base: 5, md: 6 }}
      bgGradient="linear(to-r, white, blue.50)"
      borderColor="rgba(148, 163, 184, 0.3)"
      shadow="xl"
    >
      <Stack spacing={5}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={{ base: 4, md: 6 }}
        >
          <Stack spacing={2}>
            <HStack spacing={3}>
              <Icon as={FiMapPin} boxSize={5} color="blue.500" />
              <Text fontWeight="bold" fontSize="lg">
                Find cars near you
              </Text>
              {hasResults && radiusKmLabel && (
                <Badge colorScheme="blue" borderRadius="full">
                  within {radiusKmLabel}
                </Badge>
              )}
            </HStack>
            <Text color="gray.600" fontSize="sm" maxW="3xl">
              Use your current location to spot the closest partner fleets and
              book a ride in minutes.
            </Text>
            {updatedLabel && (
              <Text fontSize="xs" color="gray.500">
                Updated {updatedLabel}
              </Text>
            )}
          </Stack>

          <HStack spacing={3}>
            <Button
              leftIcon={<FiNavigation2 />}
              colorScheme="blue"
              onClick={onLocate}
              isLoading={loading && !hasResults}
              loadingText="Locating"
            >
              {hasResults ? "Refresh nearest" : "Nearest cars"}
            </Button>
            {hasResults && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRefresh}
                isLoading={loading && hasResults}
              >
                Update list
              </Button>
            )}
          </HStack>
        </Flex>

        {error && (
          <Alert status="warning" variant="left-accent" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {(userCoords || hasResults) && (
          <Box
            borderRadius="2xl"
            overflow="hidden"
            shadow="md"
            borderWidth="1px"
            borderColor="rgba(148,163,184,0.25)"
          >
            <NearestCompaniesMap
              companies={companies}
              userCoords={userCoords}
              radiusMeters={radiusMeters || undefined}
            />
          </Box>
        )}

        {loading && !hasResults ? (
          <Center py={6}>
            <Stack spacing={2} align="center">
              <Spinner size="md" color="blue.500" />
              <Text fontSize="sm" color="gray.600">
                Looking for nearby fleets…
              </Text>
            </Stack>
          </Center>
        ) : hasResults ? (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {companies.map((company) => (
              <NearestCompanyCard
                key={company.id || company.name}
                company={company}
                onSelect={() => onSelectCompany?.(company)}
              />
            ))}
          </SimpleGrid>
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
                Tap "Nearest cars" to let us know where you are and we'll
                surface fleets closest to you.
              </Text>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

function NearestCompanyCard({ company, onSelect }) {
  const distanceLabel = formatDistance(
    company?.distance_m || company?.distance
  );
  const vehicles = getTopCars(company?.cars);

  return (
    <Stack
      spacing={3}
      borderWidth="1px"
      borderRadius="xl"
      bg="white"
      p={5}
      shadow="md"
      borderColor="rgba(148, 163, 184, 0.25)"
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
          <Text
            fontSize="xs"
            color="gray.500"
            textTransform="uppercase"
            letterSpacing="wide"
          >
            Available cars
          </Text>
          <Stack spacing={1}>
            {vehicles.map((car) => (
              <HStack
                key={car.id || car.name}
                spacing={3}
                align="flex-start"
                py={1}
              >
                <Box w="10px" h="10px" borderRadius="full" bg="blue.400" />
                <Stack spacing={0.5} flex="1" minW={0}>
                  <Text fontSize="sm" color="gray.700" noOfLines={1}>
                    {car.name || car.model || car.title || "Vehicle"}
                    {formatRate(
                      car.rate ?? car.rate_value,
                      car.rate_type ?? car.rateType
                    ) ? (
                      <Text as="span" fontSize="sm" color="gray.500">
                        {" "}
                        ·{" "}
                        {formatRate(
                          car.rate ?? car.rate_value,
                          car.rate_type ?? car.rateType
                        )}
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
                      String(car.availability_status).toLowerCase() ===
                      "available"
                        ? "green"
                        : "gray"
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
        variant="outline"
        alignSelf="flex-start"
        onClick={onSelect}
      >
        View cars from this company
      </Button>
    </Stack>
  );
}

export default function BorrowerDashboard() {
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
  const bookingModal = useDisclosure();
  const carListRef = useRef(null);

  const NEAREST_SEARCH_RADIUS = 40000; // 15 km
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
      const mapped = rawItems
        .map((item) => mapCarToViewModel(item))
        .filter(Boolean);
      setCars(mapped);
      setMeta(payload.meta || null);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load vehicles"
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

      const transmission =
        specMap.transmission || raw.spcs_transmission || null;
      const fuelType = specMap.fuel_type || raw.spcs_fuelType || null;
      const brand = raw.info_make || null;
      const vehicleClass = raw.info_carType || null;
      const companyId =
        raw.company?.id ?? raw.company_id ?? raw.companyId ?? null;
      const companyName =
        raw.company?.name ??
        raw.company_name ??
        raw.company?.display_name ??
        null;

      if (transmission) gearTypes.add(transmission);
      if (fuelType) fuelTypes.add(fuelType);
      if (brand) brands.add(brand);
      if (vehicleClass) vehicleClasses.add(vehicleClass);
      if (companyId || companyName) {
        const key = companyId ?? companyName;
        if (!companies.has(key)) {
          companies.set(key, {
            id: companyId ?? companyName,
            name: companyName ?? brand ?? "Company",
          });
        }
      }
    });

    const sortStrings = (values) =>
      Array.from(values)
        .map((value) => String(value))
        .filter((value) => value.trim().length > 0)
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
    const query = normalizeValue(searchCriteria.query);

    const matchesQuery = (car) => {
      if (!query) return true;
      const raw = car.raw || {};
      const haystack = [
        car.name,
        raw.info_make,
        raw.info_model,
        raw.info_carType,
        raw.company?.name,
        raw.company?.display_name,
        raw.company?.address,
      ]
        .filter(Boolean)
        .map((value) => normalizeValue(value));
      return haystack.some((value) => value.includes(query));
    };

    const matchesFilter = (value, selected) => {
      if (selected === "all") return true;
      return normalizeValue(value) === normalizeValue(selected);
    };

    const matchesCompany = (car) => {
      if (filters.company === "all") return true;
      const raw = car.raw || {};
      const companyId =
        raw.company?.id ?? raw.company_id ?? raw.companyId ?? null;
      return normalizeValue(companyId) === normalizeValue(filters.company);
    };

    const matchesTransmission = (car) => {
      const raw = car.raw || {};
      const specs = Array.isArray(car.specification) ? car.specification : [];
      const specValue =
        specs.find((spec) => spec.key === "transmission")?.value ||
        raw.spcs_transmission;
      return matchesFilter(specValue, filters.gearType);
    };

    const matchesFuel = (car) => {
      const raw = car.raw || {};
      const specs = Array.isArray(car.specification) ? car.specification : [];
      const specValue =
        specs.find((spec) => spec.key === "fuel_type")?.value ||
        raw.spcs_fuelType;
      return matchesFilter(specValue, filters.fuelType);
    };

    const matchesBrand = (car) => {
      const raw = car.raw || {};
      return matchesFilter(raw.info_make, filters.brand);
    };

    const matchesVehicleClass = (car) => {
      const raw = car.raw || {};
      return matchesFilter(raw.info_carType, filters.vehicleClass);
    };

    const matchesAvailability = (car) => {
      if (!availableOnly) return true;
      const status = String(car.status || "").toLowerCase();
      return status.includes("available");
    };

    const result = cars.filter(
      (car) =>
        matchesAvailability(car) &&
        matchesQuery(car) &&
        matchesCompany(car) &&
        matchesTransmission(car) &&
        matchesFuel(car) &&
        matchesBrand(car) &&
        matchesVehicleClass(car)
    );

    const sorted = [...result];
    if (sortBy === "price-asc") {
      sorted.sort((a, b) => getRateValue(a) - getRateValue(b));
    } else if (sortBy === "price-desc") {
      sorted.sort((a, b) => getRateValue(b) - getRateValue(a));
    } else if (sortBy === "newest") {
      sorted.sort((a, b) => {
        const aDate = new Date(a.raw?.created_at || 0).getTime();
        const bDate = new Date(b.raw?.created_at || 0).getTime();
        return bDate - aDate;
      });
    } else {
      sorted.sort((a, b) => {
        const aAvailable = matchesAvailability(a) ? 1 : 0;
        const bAvailable = matchesAvailability(b) ? 1 : 0;
        if (aAvailable !== bAvailable) return bAvailable - aAvailable;
        return getRateValue(a) - getRateValue(b);
      });
    }

    return sorted;
  }, [cars, searchCriteria, filters, sortBy, availableOnly]);

  const handleFilterChange = (partial) => {
    setFilters((prev) => ({ ...prev, ...(partial || {}) }));
  };

  const handleCriteriaChange = (partial) => {
    setSearchCriteria((prev) => ({ ...prev, ...(partial || {}) }));
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const handleRefresh = () => {
    fetchCars(true);
  };

  const extractCompanies = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.results)) return payload.results;
    if (Array.isArray(payload)) return payload;
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
    } catch (err) {
      setNearestError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load nearby companies right now."
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
          setNearestError(
            "Location information is currently unavailable. Please try again shortly."
          );
        } else if (error.code === error.TIMEOUT) {
          setNearestError(
            "Taking too long to find your location. Try again with a better signal."
          );
        } else {
          setNearestError(
            "Unable to determine your location. Please try again."
          );
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
    if (!company?.name) return;
    setFilters((prev) => ({ ...prev, company: company.name }));
    setTimeout(focusCarResults, 120);
  };

  const handleBook = (car) => {
    setSelectedCar(car);
    bookingModal.onOpen();
  };

  const totalVehicles = filteredCars.length || meta?.total || cars.length;

  return (
    <Box bg="gray.50" minH="100vh" py={{ base: 8, md: 12 }}>
      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <Stack spacing={{ base: 6, md: 10 }}>
          <SearchHero
            criteria={searchCriteria}
            onCriteriaChange={handleCriteriaChange}
            onSubmit={(next) => {
              if (next) handleCriteriaChange(next);
              handleRefresh();
            }}
            isBusy={loading || refreshing}
            totalResults={totalVehicles}
          />

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
          />

          {error && (
            <Alert status="error" borderRadius="lg">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <FilterToolbar
            filters={filters}
            options={filterOptions}
            onFilterChange={handleFilterChange}
            onClear={handleClearFilters}
            sortBy={sortBy}
            onSortChange={setSortBy}
            availableOnly={availableOnly}
            onToggleAvailable={setAvailableOnly}
            resultCount={filteredCars.length}
          />

          <Box textAlign="right">
            <Button
              leftIcon={<FiRefreshCw />}
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              isLoading={refreshing}
            >
              Refresh results
            </Button>
          </Box>

          {loading ? (
            <Center py={20}>
              <Stack spacing={3} align="center">
                <Spinner size="lg" color="blue.500" />
                <Text color="gray.600">Loading vehicles...</Text>
              </Stack>
            </Center>
          ) : filteredCars.length > 0 ? (
            <SimpleGrid
              ref={carListRef}
              columns={{ base: 1, md: 2, xl: 3 }}
              spacing={6}
            >
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} onBook={handleBook} />
              ))}
            </SimpleGrid>
          ) : (
            <Center py={24}>
              <Stack spacing={3} textAlign="center">
                <Text fontWeight="bold" fontSize="lg">
                  No vehicles match your filters yet
                </Text>
                <Text color="gray.600">
                  Try adjusting the filters or pick a different pickup date to
                  discover more options.
                </Text>
                <Button onClick={handleClearFilters} colorScheme="blue">
                  Clear filters
                </Button>
              </Stack>
            </Center>
          )}
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
