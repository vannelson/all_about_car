import { useMemo, useState } from "react";
import { Box, Text, VStack, HStack, Button } from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import BookingModal from "../booking/BookingModal";

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = (day === 0 ? -6 : 1) - day; // make Monday first day
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addHours(base, h) {
  const d = new Date(base);
  d.setHours(d.getHours() + h);
  return d;
}

export default function FullCalendarPanel() {
  const [isBookingOpen, setBookingOpen] = useState(false);

  const initialEvents = useMemo(() => {
    const now = new Date();
    const monday = startOfWeek(now);
    const y = monday.getFullYear();
    const m = monday.getMonth();
    const d = monday.getDate();

    // Solid but clean palette with white text
    const colors = {
      blue: { bg: "#2563EB", border: "#1D4ED8" },
      green: { bg: "#059669", border: "#047857" },
      purple: { bg: "#7C3AED", border: "#6D28D9" },
      amber: { bg: "#D97706", border: "#B45309" },
      slate: { bg: "#475569", border: "#334155" },
    };

    const e = [
      // 3+ day bookings (all-day)
      {
        id: "md1",
        title: "Booking: Toyota Vios",
        start: new Date(y, m, d + 1),
        end: new Date(y, m, d + 4),
        backgroundColor: colors.blue.bg,
        borderColor: colors.blue.border,
        textColor: "#FFFFFF",
        allDay: true,
      },
      {
        id: "md2",
        title: "Booking: Mitsubishi Xpander",
        start: new Date(y, m, d + 5),
        end: new Date(y, m, d + 8),
        backgroundColor: colors.green.bg,
        borderColor: colors.green.border,
        textColor: "#FFFFFF",
        allDay: true,
      },
      {
        id: "md3",
        title: "Booking: Honda City",
        start: new Date(y, m, d + 9),
        end: new Date(y, m, d + 13),
        backgroundColor: colors.purple.bg,
        borderColor: colors.purple.border,
        textColor: "#FFFFFF",
        allDay: true,
      },
      {
        id: "md4",
        title: "Booking: Ford Ranger",
        start: new Date(y, m, d + 14),
        end: new Date(y, m, d + 17),
        backgroundColor: colors.amber.bg,
        borderColor: colors.amber.border,
        textColor: "#FFFFFF",
        allDay: true,
      },
      {
        id: "md5",
        title: "Booking: Nissan Patrol",
        start: new Date(y, m, d + 18),
        end: new Date(y, m, d + 22),
        backgroundColor: colors.slate.bg,
        borderColor: colors.slate.border,
        textColor: "#FFFFFF",
        allDay: true,
      },
      // background maintenance block
      {
        id: "bg1",
        title: "Maintenance",
        start: new Date(y, m, d + 2),
        end: new Date(y, m, d + 3),
        display: "background",
        backgroundColor: "#F1F5F9",
      },
      // timed examples
      {
        id: "t1",
        title: "Pickup: BMW 3 Series",
        start: addHours(new Date(y, m, d + 4, 10), 0),
        end: addHours(new Date(y, m, d + 4, 12), 0),
        backgroundColor: colors.amber.bg,
        borderColor: colors.amber.border,
        textColor: "#FFFFFF",
      },
      {
        id: "t2",
        title: "Return: Nissan Almera",
        start: addHours(new Date(y, m, d + 7, 15), 0),
        end: addHours(new Date(y, m, d + 7, 18), 0),
        backgroundColor: colors.slate.bg,
        borderColor: colors.slate.border,
        textColor: "#FFFFFF",
      },
    ];
    return e;
  }, []);

  const [events, setEvents] = useState(initialEvents);
  const onSelect = (info) => {
    // Show booking modal on date range select
    setBookingOpen(true);
  };
  const onEventDrop = (info) => {
    const { event } = info;
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === event.id ? { ...ev, start: event.start, end: event.end } : ev
      )
    );
  };
  const onEventResize = onEventDrop;

  return (
    <Box className=" border border-gray-200 bg-white p-2" overflow="hidden">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        height="auto"
        contentHeight={720}
        events={events}
        selectable={true}
        selectMirror={true}
        select={onSelect}
        editable={true}
        eventDrop={onEventDrop}
        eventResize={onEventResize}
        eventDisplay="block"
        dayMaxEventRows={3}
        nowIndicator={true}
        firstDay={1}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </Box>
  );
}
