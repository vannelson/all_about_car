import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  AlertIcon,
  Avatar,
  Badge,
  Box,
  Button,
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

function getCompanyIdentifier(company) {
  if (!company) return null;
  const candidate =
    company.id ??
    company.company_id ??
    company.uuid ??
    company.slug ??
    company.name ??
    null;
  if (candidate === null || candidate === undefined) return null;
  return String(candidate);
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
  const [activeCompanyId, setActiveCompanyId] = useState(null);

  useEffect(() => {
    if (!hasResults) {
      if (activeCompanyId !== null) setActiveCompanyId(null);
      return;
    }
    const firstWithId = companies.find((company) => getCompanyIdentifier(company));
    if (!firstWithId) return;
    const currentExists = companies.some(
      (company) => getCompanyIdentifier(company) === activeCompanyId
    );
    if (!activeCompanyId || !currentExists) {
      setActiveCompanyId(getCompanyIdentifier(firstWithId));
    }
  }, [companies, hasResults, activeCompanyId]);

  const handleFocusCompany = (company) => {
    const identifier = getCompanyIdentifier(company);
    if (identifier) {
      setActiveCompanyId(identifier);
    }
  };

  const handleSelectFromSource = (company) => {
    if (!company) return;
    handleFocusCompany(company);
    onSelectCompany?.(company);
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="2xl"
      px={{ base: 4, md: 6 }}
      py={{ base: 6, md: 7 }}
      bg="white"
      borderColor="rgba(148, 163, 184, 0.35)"
      shadow="xl"
      position="relative"
    >
      <Box
        position="absolute"
        inset={0}
        borderRadius="inherit"
        pointerEvents="none"
        bgGradient="linear(to-r, rgba(59,130,246,0.08), rgba(30,64,175,0.03))"
      />
      <Stack spacing={{ base: 6, md: 7 }} position="relative">
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
                  Nearby partner fleets
                </Text>
                {hasResults && radiusKmLabel && (
                  <Badge colorScheme="blue" borderRadius="full">
                    within {radiusKmLabel}
                  </Badge>
              )}
            </HStack>
              <Text color="gray.600" fontSize="sm" maxW="3xl">
                Quickly spot trusted fleets around your area and zero in on the cars that match your trip.
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
                size="md"
                boxShadow="md"
              >
                {hasResults ? "Refresh nearest" : "Nearest cars"}
              </Button>
              {hasResults && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefresh}
                  isLoading={loading && hasResults}
                  leftIcon={<FiRefreshCw />}
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

        {loading && !hasResults ? (
          <Center py={8}>
            <Stack spacing={2} align="center">
              <Spinner size="md" color="blue.500" />
              <Text fontSize="sm" color="gray.600">
                Looking for nearby fleets...
              </Text>
            </Stack>
          </Center>
        ) : hasResults ? (
          <SimpleGrid
            columns={{ base: 1, lg: 2 }}
            spacing={{ base: 5, lg: 6 }}
            alignItems="stretch"
          >
            <Box
              borderRadius="xl"
              overflow="hidden"
              borderWidth="1px"
              borderColor="rgba(148,163,184,0.25)"
              shadow="md"
              bg="white"
              minH={{ base: "300px", lg: "360px" }}
              maxH={{ base: "420px", lg: "420px" }}
            >
              <NearestCompaniesMap
                companies={companies}
                userCoords={userCoords}
                radiusMeters={radiusMeters || undefined}
                activeCompanyId={activeCompanyId}
                onMarkerClick={handleSelectFromSource}
              />
            </Box>

            <Stack spacing={4}>
              <Stack spacing={1}>
                <Text fontWeight="semibold" color="gray.800">
                  Nearby companies
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Tap a card to filter cars or hover to preview them on the map.
                </Text>
              </Stack>
              <Stack spacing={4} maxH={{ base: "unset", lg: "420px" }} overflowY="auto" pr={1}>
                {companies.map((company) => {
                  const identifier = getCompanyIdentifier(company);
                  return (
                    <NearestCompanyCard
                      key={identifier || company.id || company.name}
                      company={company}
                      isActive={identifier === activeCompanyId}
                      onHover={() => handleFocusCompany(company)}
                      onSelect={() => handleSelectFromSource(company)}
                    />
                  );
                })}
              </Stack>
            </Stack>
          </SimpleGrid>
        ) : (
          <Box
            borderWidth="1px"
            borderRadius="xl"
            borderStyle="dashed"
            borderColor="blue.200"
            bg="whiteAlpha.700"
            py={{ base: 8, md: 10 }}
            px={{ base: 4, md: 6 }}
          >
            <Stack spacing={3} align="center" textAlign="center">
              <Icon as={FiMapPin} boxSize={8} color="blue.500" />
              <Text fontWeight="semibold" fontSize="lg">
                Ready when you are
              </Text>
              <Text fontSize="sm" color="gray.600" maxW="md">
                Hit "Nearest cars" and we'll pinpoint partner fleets around your current location for quick booking.
              </Text>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

function NearestCompanyCard({ company, onSelect, onHover, isActive }) {
  const distanceLabel = formatDistance(company?.distance_m || company?.distance);
  const vehicles = getTopCars(company?.cars);
  const availableCount = Array.isArray(company?.cars)
    ? company.cars.length
    : company?.available_car_count ?? vehicles.length;
  const tagline = company?.tagline || "Trusted local fleet";
  const hasVehicles = vehicles.length > 0;

  return (
    <Box
      role="button"
      onClick={onSelect}
      onKeyPress={(event) => {
        if (event.key === "Enter" || event.key === " ") onSelect?.();
      }}
      onMouseEnter={onHover}
      onFocus={onHover}
      tabIndex={0}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={isActive ? "blue.400" : "rgba(59,130,246,0.18)"}
      bg="white"
      px={{ base: 4, md: 5 }}
      py={{ base: 4, md: 5 }}
      shadow={isActive ? "xl" : "lg"}
      transition="all 0.25s ease"
      cursor="pointer"
      _hover={{
        shadow: "xl",
        transform: "translateY(-3px)",
        borderColor: "blue.400",
      }}
      _focusVisible={{
        outline: "none",
        borderColor: "blue.500",
        boxShadow: "0 0 0 3px rgba(59,130,246,0.2)",
      }}
    >
      <Stack spacing={4}>
        <HStack align="flex-start" spacing={4}>
          <Avatar
            size="lg"
            name={company?.name || "Company"}
            src={company?.logo_url || company?.logo || undefined}
            borderRadius="16px"
          />
          <Stack spacing={2} flex="1" minW={0}>
            <HStack justify="space-between" align="flex-start" spacing={3}>
              <Stack spacing={1} minW={0}>
                <Text fontWeight="semibold" fontSize="lg" noOfLines={1} color="gray.800">
                  {company?.name || "Company"}
                </Text>
                {company?.address && (
                  <Text fontSize="sm" color="gray.600" noOfLines={2}>
                    {company.address}
                  </Text>
                )}
                <HStack spacing={2} fontSize="xs" color="gray.500">
                  <Badge variant="subtle" colorScheme="blue" borderRadius="full" px={2}>
                    {availableCount} car{availableCount === 1 ? "" : "s"} nearby
                  </Badge>
                  <Text noOfLines={1}>{tagline}</Text>
                </HStack>
              </Stack>
              {distanceLabel && (
                <Badge colorScheme="blue" borderRadius="full" px={3} py={1} fontSize="0.75rem">
                  {distanceLabel}
                </Badge>
              )}
            </HStack>

            {hasVehicles ? (
              <Stack spacing={2} pt={1}>
                <Text
                  fontSize="xs"
                  color="gray.500"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  Featured cars
                </Text>
                <Stack spacing={2}>
                  {vehicles.map((car) => {
                    const rateLabel = formatRate(
                      car.rate ?? car.rate_value,
                      car.rate_type ?? car.rateType
                    );
                    return (
                      <Flex
                        key={car.id || car.name}
                        align="center"
                        gap={3}
                        bg="rgba(59,130,246,0.06)"
                        borderRadius="lg"
                        px={3}
                        py={2}
                      >
                        <Box w="8px" h="8px" borderRadius="full" bg="blue.500" flexShrink={0} />
                        <Stack spacing={0} flex="1" minW={0}>
                          <Text fontSize="sm" color="gray.700" noOfLines={1}>
                            {car.name || car.model || car.title || "Vehicle"}
                          </Text>
                          <HStack spacing={3} fontSize="xs" color="gray.500">
                            {car.location && <Text noOfLines={1}>{car.location}</Text>}
                            {rateLabel && (
                              <Text noOfLines={1} display="flex" alignItems="center">
                                {"\u2022"} {rateLabel}
                              </Text>
                            )}
                          </HStack>
                        </Stack>
                        {car.availability_status && (
                          <Badge
                            colorScheme={
                              String(car.availability_status).toLowerCase() === "available" ? "green" : "gray"
                            }
                            borderRadius="full"
                            px={2.5}
                            fontSize="0.7rem"
                            textTransform="capitalize"
                            whiteSpace="nowrap"
                          >
                            {car.availability_status}
                          </Badge>
                        )}
                      </Flex>
                    );
                  })}
                </Stack>
              </Stack>
            ) : (
              <Text fontSize="sm" color="gray.500">
                Fleet details coming soon. Check back shortly for new availability.
              </Text>
            )}
          </Stack>
        </HStack>

        <Flex justify="space-between" align={{ base: "stretch", sm: "center" }} gap={3}>
          <HStack spacing={3} color="gray.500" fontSize="sm">
            <Icon as={FiMapPin} color="blue.500" boxSize={4} />
            <Text>
              {distanceLabel
                ? `Approximately ${distanceLabel} away`
                : "Distance updates once we locate you"}
            </Text>
          </HStack>
          <Button
            size="sm"
            colorScheme="blue"
            rightIcon={<FiNavigation2 />}
            variant="solid"
            onClick={onSelect}
          >
            View cars
          </Button>
        </Flex>
      </Stack>
    </Box>
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
