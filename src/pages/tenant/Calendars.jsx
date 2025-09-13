import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import CalendarTimeline from "../../components/tenant/calendar/CalendarTimeline";

// Simple mocked data; replace with API data later
const cars = [
  { id: "c1", name: "Tesla Model 3", image: "/cars/6_tesla/1.avif", status: "Unavailable" },
  { id: "c2", name: "Toyota Corolla", image: "/cars/3_toyota/1.avif", status: "Available" },
  { id: "c3", name: "Nissan Leaf", image: "/cars/5_mitsubishi/1.avif", status: "Overdue" },
  { id: "c4", name: "Ford Ranger", image: "/cars/4_ford/1.avif", status: "Booked" },
  { id: "c5", name: "Honda Civic", image: "/cars/2_van/1.avif", status: "Available" },
];

const bookings = [
  {
    id: "b1",
    resourceId: "c1",
    title: "John Doe",
    status: "Booked",
    start: new Date().toISOString().slice(0, 10) + "T09:00:00",
    end: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().slice(0, 10) + "T10:00:00",
  },
  {
    id: "b2",
    resourceId: "c3",
    title: "Smith Family",
    status: "Overdue",
    start: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString().slice(0, 10) + "T10:00:00",
    end: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10) + "T09:00:00",
  },
  {
    id: "b3",
    resourceId: "c4",
    title: "Jane Smith",
    status: "Booked",
    start: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().slice(0, 10) + "T08:00:00",
    end: new Date(new Date().setDate(new Date().getDate() + 9)).toISOString().slice(0, 10) + "T12:00:00",
  },
];

export default function Calendars() {
  return (
    <VStack align="stretch" spacing={4} p={4}>
      <Box>
        <Heading size="md" color="gray.800">Schedules</Heading>
        <Text color="gray.600" fontSize="sm">Track bookings and availability across your fleet.</Text>
      </Box>
      <CalendarTimeline resources={cars} events={bookings} />
    </VStack>
  );
}
