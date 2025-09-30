import { Box, SimpleGrid } from "@chakra-ui/react";
import CarRentalCardBooking from "../../components/tenant/cardview/CarRentalCardBooking";
import FiltersTopBar from "../../components/tenant/calendar/FiltersTopBar";
import FullCalendarPanel from "../../components/tenant/calendar/FullCalendarPanel";

export default function Calendars() {
  return (
    <Box>
      {/* Sticky Top bar */}
      <FiltersTopBar />

      {/* Content Area */}
      <Box>
        {/* Replace this with your calendar or content */}
        <SimpleGrid columns={{ base: 1, md: 12 }} spacing={{ base: 2, md: 2 }}>
          <Box gridColumn={{ base: "1 / -1", md: "span 4" }} bg="white">
            <CarRentalCardBooking />
          </Box>

          {/* Second column (col-8, empty) */}
          <Box gridColumn={{ base: "1 / -1", md: "span 8" }}>
            <FullCalendarPanel />
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
