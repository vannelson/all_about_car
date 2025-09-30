import { useMemo, useState } from "react";
import { Box, Text, VStack, HStack, Button } from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import BaseModal from "../../base/BaseModal";
import { format } from "date-fns";

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
  const [selection, setSelection] = useState(null);
  const [isOpen, setOpen] = useState(false);

  const { events } = useMemo(() => {
    const now = new Date();
    const monday = startOfWeek(now);

    // Sample rentals across the week
    const e = [
      {
        title: "Booking: Toyota Vios",
        start: addHours(
          new Date(
            monday.getFullYear(),
            monday.getMonth(),
            monday.getDate(),
            9
          ),
          0
        ),
        end: addHours(
          new Date(
            monday.getFullYear(),
            monday.getMonth(),
            monday.getDate(),
            12
          ),
          0
        ),
        backgroundColor: "#E0EAFF",
        borderColor: "transparent",
        textColor: "#1F2937",
      },
      {
        title: "Booking: Mitsubishi Xpander",
        start: addHours(
          new Date(
            monday.getFullYear(),
            monday.getMonth(),
            monday.getDate() + 1,
            13
          ),
          0
        ),
        end: addHours(
          new Date(
            monday.getFullYear(),
            monday.getMonth(),
            monday.getDate() + 1,
            17
          ),
          0
        ),
        backgroundColor: "#EAF7EE",
        borderColor: "transparent",
        textColor: "#1F2937",
      },
      {
        title: "Maintenance: Nissan Almera",
        start: new Date(
          monday.getFullYear(),
          monday.getMonth(),
          monday.getDate() + 2
        ),
        end: new Date(
          monday.getFullYear(),
          monday.getMonth(),
          monday.getDate() + 3
        ),
        display: "background",
        backgroundColor: "#F8FAFC",
      },
      {
        title: "Booking: BMW 3 Series",
        start: addHours(
          new Date(
            monday.getFullYear(),
            monday.getMonth(),
            monday.getDate() + 4,
            10
          ),
          0
        ),
        end: addHours(
          new Date(
            monday.getFullYear(),
            monday.getMonth(),
            monday.getDate() + 4,
            14
          ),
          0
        ),
        backgroundColor: "#EEE5FF",
        borderColor: "transparent",
        textColor: "#1F2937",
      },
      {
        title: "Booking: Honda City",
        start: addHours(
          new Date(
            monday.getFullYear(),
            monday.getMonth(),
            monday.getDate() + 5,
            8
          ),
          0
        ),
        end: addHours(
          new Date(
            monday.getFullYear(),
            monday.getMonth(),
            monday.getDate() + 5,
            18
          ),
          0
        ),
        backgroundColor: "#FEF3C7",
        borderColor: "transparent",
        textColor: "#1F2937",
      },
    ];
    return { events: e };
  }, []);

  return (
    <Box className=" border bg-white p-3 " overflow="hidden">
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
        select={(info) => {
          setSelection({ start: info.start, end: info.end });
          setOpen(true);
        }}
        dayMaxEventRows={3}
        nowIndicator={true}
        firstDay={1}
      />

      <BaseModal
        title="Create Booking"
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        size="lg"
        hassFooter={false}
      >
        <Box p={5}>
          <VStack align="stretch" spacing={4}>
            <Text fontSize="sm" color="gray.600">
              Selected range:
            </Text>
            <HStack justify="space-between">
              <VStack align="start" spacing={0}>
                <Text fontWeight="semibold">Start</Text>
                <Text color="gray.700">
                  {selection?.start ? format(selection.start, "PPpp") : "—"}
                </Text>
              </VStack>
              <VStack align="start" spacing={0}>
                <Text fontWeight="semibold">End</Text>
                <Text color="gray.700">
                  {selection?.end ? format(selection.end, "PPpp") : "—"}
                </Text>
              </VStack>
            </HStack>
            <HStack justify="flex-end">
              <Button onClick={() => setOpen(false)}>Close</Button>
              <Button colorScheme="blue" variant="solid" isDisabled>
                Save (demo)
              </Button>
            </HStack>
          </VStack>
        </Box>
      </BaseModal>
    </Box>
  );
}
