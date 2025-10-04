import { Box, SimpleGrid } from "@chakra-ui/react";
import { useState, useCallback, useEffect } from "react";
import CarRentalCardBooking from "../../components/tenant/cardview/CarRentalCardBooking";
import BookingModal from "../../components/tenant/booking/BookingModal";
import FiltersTopBar from "../../components/tenant/calendar/FiltersTopBar";
import FullCalendarPanel from "../../components/tenant/calendar/FullCalendarPanel";
import { loadTopbarFilters, saveTopbarFilters } from "../../utils/helpers/filterPersistence";

export default function Calendars() {
  const [topbar, setTopbar] = useState(() => loadTopbarFilters());
  const [isCardBookingOpen, setCardBookingOpen] = useState(false);
  const [cardSelectedCar, setCardSelectedCar] = useState(null);

  // Persist on change
  const handleFiltersChange = useCallback((next) => {
    setTopbar(next);
    saveTopbarFilters(next);
  }, []);
  const handleFiltersReset = useCallback(() => {
    const cleared = { gear: "", fuel: "", brand: "", availability: "", search: "" };
    setTopbar(cleared);
    saveTopbarFilters(cleared);
  }, []);

  return (
    <Box>
      {/* Sticky Top bar */}
      <FiltersTopBar value={topbar} onChange={handleFiltersChange} onReset={handleFiltersReset} />

      {/* Content Area */}
      <Box>
        {/* Replace this with your calendar or content */}
        <SimpleGrid columns={{ base: 1, md: 12 }} spacing={{ base: 2, md: 2 }}>
          <Box
            gridColumn={{ base: "1 / -1", md: "span 4" }}
            sx={{ "@media (min-width: 1800px)": { gridColumn: "span 3 / span 3" } }}
            bg="white"
          >
            <CarRentalCardBooking
              filters={topbar}
              onRent={(carVm) => {
                setCardSelectedCar(carVm);
                setCardBookingOpen(true);
              }}
            />
          </Box>

          {/* Second column (col-8, empty) */}
          <Box
            gridColumn={{ base: "1 / -1", md: "span 8" }}
            sx={{ "@media (min-width: 1800px)": { gridColumn: "span 9 / span 9" } }}
          >
            <FullCalendarPanel />
          </Box>
        </SimpleGrid>
      </Box>
      <BookingModal
        isOpen={isCardBookingOpen}
        onClose={() => setCardBookingOpen(false)}
        car={cardSelectedCar || {}}
      />
    </Box>
  );
}
