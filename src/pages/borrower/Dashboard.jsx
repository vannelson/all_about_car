import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Container,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FiRefreshCw } from "react-icons/fi";
import SearchHero from "./dashboard/components/SearchHero";
import FilterToolbar from "./dashboard/components/FilterToolbar";
import CarCard from "./dashboard/components/CarCard";
import BookingRequestModal from "./dashboard/components/BookingRequestModal";
import { listCarsApi, mapCarToViewModel } from "../../services/cars";

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
  const bookingModal = useDisclosure();

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
          companies.set(key, { id: companyId ?? companyName, name: companyName ?? brand ?? "Company" });
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

  const handleBook = (car) => {
    setSelectedCar(car);
    bookingModal.onOpen();
  };

  const totalVehicles =
    filteredCars.length ||
    meta?.total ||
    cars.length;

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
            <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing={6}>
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
