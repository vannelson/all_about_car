import { useMemo, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  VStack,
  Text,
  IconButton,
  Input,
  Select,
  Badge,
  Tooltip,
  Divider,
  useBreakpointValue,
  InputGroup,
  InputLeftElement,
  Button,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, SearchIcon, CheckCircleIcon, WarningTwoIcon, SmallCloseIcon, TimeIcon } from "@chakra-ui/icons";
import BaseModal from "../../base/BaseModal";

const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

function startOfMonth(d) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}
function endOfMonth(d) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + 1);
  x.setDate(0);
  x.setHours(23, 59, 59, 999);
  return x;
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function isWeekend(d) {
  const day = d.getDay();
  return day === 0 || day === 6;
}
function clampRangeToWindow(start, end, winStart, winEnd) {
  const s = start < winStart ? winStart : start;
  const e = end > winEnd ? winEnd : end;
  return [s, e];
}
function daysDiff(start, end) {
  const a = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const b = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

const statusColors = {
  Available: "green",
  Booked: "blue",
  Unavailable: "red",
  Overdue: "orange",
  Returned: "gray",
};

const statusIcon = {
  Booked: TimeIcon,
  Overdue: WarningTwoIcon,
  Unavailable: SmallCloseIcon,
  Returned: CheckCircleIcon,
};

function Legend() {
  return (
    <HStack spacing={3} wrap="wrap">
      {Object.entries(statusColors).map(([k, v]) => {
        const Icon = statusIcon[k];
        return (
          <Badge
            key={k}
            colorScheme={v}
            variant="subtle"
            px={3}
            py={1}
            borderRadius="full"
            display="inline-flex"
            alignItems="center"
            gap={2}
          >
            {Icon ? <Icon boxSize={3} /> : <Box boxSize={2} bg={`${v}.400`} borderRadius="full" />}
            <Text fontSize="sm">{k}</Text>
          </Badge>
        );
      })}
    </HStack>
  );
}

function CalendarHeader({ current, onPrev, onNext, onToday, view, setView, status, setStatus }) {
  const monthLabel = current.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  return (
    <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "stretch", md: "center" }} gap={4}>
      <HStack>
        <IconButton aria-label="Previous" icon={<ChevronLeftIcon />} onClick={onPrev} variant="ghost" />
        <IconButton aria-label="Today" icon={<CalendarIcon />} onClick={onToday} colorScheme="blue" />
        <IconButton aria-label="Next" icon={<ChevronRightIcon />} onClick={onNext} variant="ghost" />
        <Text fontWeight="bold" fontSize="xl" color="gray.800">
          {monthLabel}
        </Text>
      </HStack>
      <HStack>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} maxW="180px" size="sm" variant="filled" borderRadius="md">
          <option value="all">All Status</option>
          <option value="Booked">Booked</option>
          <option value="Overdue">Overdue</option>
          <option value="Unavailable">Unavailable</option>
          <option value="Returned">Returned</option>
        </Select>
        <Select value={view} onChange={(e) => setView(e.target.value)} maxW="140px" size="sm" variant="filled" borderRadius="md">
          <option value="month">Month</option>
          <option value="week">Week</option>
        </Select>
      </HStack>
    </Flex>
  );
}

function DayHeaderRow({ days, todayIndex }) {
  return (
    <Flex>
      {days.map((d, i) => (
        <Flex
          key={i}
          w="var(--day-w)"
          h="40px"
          align="center"
          justify="center"
          borderLeft="1px solid"
          borderColor="gray.100"
          bg={i === todayIndex ? "blue.50" : isWeekend(d) ? "gray.50" : "white"}
          color={i === todayIndex ? "blue.700" : isWeekend(d) ? "gray.600" : "gray.700"}
          fontSize="sm"
        >
          <VStack spacing={0}>
            <Text fontWeight="bold">{d.getDate()}</Text>
            <Text fontSize="xs" textTransform="uppercase">{d.toLocaleDateString(undefined, { weekday: "short" })}</Text>
          </VStack>
        </Flex>
      ))}
    </Flex>
  );
}

function BookingBar({ rangeStart, rangeEnd, winStart, days, color = "blue", label = "", onClick }) {
  const [clampedStart, clampedEnd] = clampRangeToWindow(rangeStart, rangeEnd, winStart, addDays(winStart, days - 1));
  const startOffset = daysDiff(winStart, clampedStart);
  const length = daysDiff(clampedStart, addDays(clampedEnd, 1)); // inclusive of end day
  const left = `calc(${startOffset} * var(--day-w))`;
  const width = `calc(${Math.max(length, 1)} * var(--day-w))`;
  return (
    <Tooltip label={label} hasArrow placement="top" openDelay={300}>
      <Box
        position="absolute"
        left={left}
        top="8px"
        h="28px"
        w={width}
        bg={`${color}.400`}
        borderRadius="full"
        boxShadow="sm"
        borderWidth="1px"
        borderColor={`${color}.500`}
        transition="all 0.15s ease-in-out"
        _hover={{ boxShadow: "md", filter: "brightness(1.03)" }}
        display="flex"
        alignItems="center"
        px={3}
        cursor="pointer"
        onClick={onClick}
      >
        <Text fontSize="xs" color="white" noOfLines={1}>
          {label}
        </Text>
      </Box>
    </Tooltip>
  );
}

function ResourceLeftRow({ car, rowIndex, onDoubleClick, selected }) {
  const rowBg = rowIndex % 2 === 0 ? "white" : "gray.50";
  return (
    <>
      <HStack
        spacing={3}
        p={3}
        bg={rowBg}
        onDoubleClick={() => onDoubleClick?.(car)}
        cursor="pointer"
        borderLeftWidth={selected ? "3px" : "0"}
        borderLeftColor={selected ? "blue.400" : "transparent"}
        _hover={{ bg: "gray.100" }}
      >
        <Box boxSize="40px" bgImage={`url(${car.image})`} bgPos="center" bgSize="cover" borderRadius="md" />
        <Box>
          <Text fontWeight="semibold" color="gray.800" noOfLines={1}>{car.name}</Text>
          <Badge colorScheme={statusColors[car.status] || "gray"} variant="subtle" borderRadius="full">{car.status}</Badge>
        </Box>
      </HStack>
      <Divider m={0} />
    </>
  );
}

function TimelineRow({ bookings = [], days, winStart, rowIndex, onBookingClick }) {
  const rowBg = rowIndex % 2 === 0 ? "white" : "gray.50";
  return (
    <>
      <Box position="relative" h="44px" bg={rowBg} _before={{
        content: '""',
        position: "absolute",
        inset: 0,
        backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent calc(var(--day-w) - 1px), rgba(226,232,240,0.7) calc(var(--day-w) - 1px), rgba(226,232,240,0.7) var(--day-w))`,
        pointerEvents: "none",
      }}>
        {bookings.map((b, idx) => (
          <BookingBar
            key={idx}
            rangeStart={new Date(b.start)}
            rangeEnd={new Date(b.end)}
            winStart={winStart}
            days={days.length}
            color={statusColors[b.status] || "blue"}
            label={`${b.title || "Booking"} - ${b.status}`}
            onClick={() => onBookingClick?.(b)}
          />
        ))}
      </Box>
      <Divider m={0} />
    </>
  );
}

export default function CalendarTimeline({ resources = [], events = [] }) {
  // state
  const [current, setCurrent] = useState(() => startOfMonth(new Date()));
  const [view, setView] = useState("month"); // 'month' | 'week'
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selectedResourceId, setSelectedResourceId] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const dayWidth = useBreakpointValue({ base: "36px", md: "44px", lg: "52px" });

  // window days
  const days = useMemo(() => {
    if (view === "week") {
      const start = new Date(current);
      // align current to week start (Mon)
      const day = start.getDay();
      const diffToMon = (day + 6) % 7; // 0->6, 1->0 ...
      const winStart = addDays(start, -diffToMon);
      return Array.from({ length: 7 }, (_, i) => addDays(winStart, i));
    }
    const start = startOfMonth(current);
    const end = endOfMonth(current);
    const len = daysDiff(start, addDays(end, 1));
    return Array.from({ length: len }, (_, i) => addDays(start, i));
  }, [current, view]);

  const winStart = useMemo(() => days[0], [days]);
  const totalWidth = useMemo(() => `calc(${days.length} * var(--day-w))`, [days.length]);
  const todayIndex = useMemo(() => {
    const today = new Date();
    const tY = today.getFullYear();
    const tM = today.getMonth();
    const tD = today.getDate();
    return days.findIndex((d) => d.getFullYear() === tY && d.getMonth() === tM && d.getDate() === tD);
  }, [days]);

  const filteredResources = useMemo(() => {
    const s = search.trim().toLowerCase();
    let list = resources.filter((r) => {
      const matchName = !s || r.name.toLowerCase().includes(s);
      const matchStatus = status === "all" || r.status === status;
      return matchName && matchStatus;
    });
    if (selectedResourceId) list = list.filter((r) => r.id === selectedResourceId);
    return list;
  }, [resources, search, status, selectedResourceId]);

  const eventsByResource = useMemo(() => {
    const map = new Map();
    for (const r of resources) map.set(r.id, []);
    for (const e of events) {
      const list = map.get(e.resourceId) || [];
      list.push(e);
      map.set(e.resourceId, list);
    }
    return map;
  }, [resources, events]);
  const resourceById = useMemo(() => {
    const obj = {};
    for (const r of resources) obj[r.id] = r;
    return obj;
  }, [resources]);

  const goPrev = () => setCurrent((c) => (view === "week" ? addDays(c, -7) : addDays(c, -1 * new Date(c.getFullYear(), c.getMonth() + 1, 0).getDate())));
  const goNext = () => setCurrent((c) => (view === "week" ? addDays(c, 7) : addDays(c, new Date(c.getFullYear(), c.getMonth() + 1, 0).getDate())));
  const goToday = () => setCurrent(startOfMonth(new Date()));

  const handleRowDoubleClick = (car) => setSelectedResourceId(car.id);
  const clearSelection = () => setSelectedResourceId(null);
  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setBookingOpen(true);
  };

  return (
    <VStack align="stretch" spacing={4} sx={{ "--day-w": dayWidth }}>
      <Box p={4} borderWidth="1px" borderRadius="md" bg="white" boxShadow="sm">
        <CalendarHeader
          current={current}
          onPrev={goPrev}
          onNext={goNext}
          onToday={goToday}
          view={view}
          setView={setView}
          status={status}
          setStatus={setStatus}
        />
      </Box>
      <Legend />
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" boxShadow="sm">
        <Grid templateColumns="280px 1fr">
          {/* Left column: header + resources */}
          <GridItem borderRight="1px solid" borderColor="gray.100" bg="white">
            <Box position="sticky" top={0} zIndex={2} bg="white" p={3} borderBottom="1px solid" borderColor="gray.100">
              <VStack align="stretch" spacing={2}>
                <Text fontWeight="bold" color="gray.700">Car</Text>
                <InputGroup size="sm">
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search car..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    variant="filled"
                    borderRadius="md"
                  />
                </InputGroup>
                {selectedResourceId && (
                  <Button size="xs" variant="link" colorScheme="blue" onClick={clearSelection} alignSelf="flex-start">
                    Show all cars
                  </Button>
                )}
              </VStack>
            </Box>
            {filteredResources.map((r, idx) => (
              <ResourceLeftRow
                key={r.id}
                car={r}
                rowIndex={idx}
                onDoubleClick={handleRowDoubleClick}
                selected={selectedResourceId === r.id}
              />
            ))}
          </GridItem>

          {/* Right column: one shared horizontal scroll area for header + body */}
          <GridItem>
            <Box overflowX="auto" position="relative">
              <Box minW={totalWidth}>
                <Box position="sticky" top={0} zIndex={2} bg="white" borderBottom="1px solid" borderColor="gray.100">
                  <DayHeaderRow days={days} todayIndex={todayIndex} />
                </Box>
                {/* Today column highlight under header as well */}
                {todayIndex >= 0 && (
                  <Box
                    position="absolute"
                    left={`calc(${todayIndex} * var(--day-w))`}
                    top="40px"
                    bottom={0}
                    w="var(--day-w)"
                    bg="blue.50"
                    opacity={0.6}
                    pointerEvents="none"
                  />
                )}
                {filteredResources.map((r, idx) => (
                  <TimelineRow
                    key={r.id}
                    bookings={eventsByResource.get(r.id) || []}
                    days={days}
                    winStart={winStart}
                    rowIndex={idx}
                    onBookingClick={handleBookingClick}
                  />
                ))}
              </Box>
            </Box>
          </GridItem>
        </Grid>
      </Box>

      <BaseModal
        title={selectedBooking ? `${selectedBooking.title || "Booking"}` : "Booking"}
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        hassFooter={false}
        size="md"
      >
        <Box p={5}>
          {selectedBooking ? (
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between">
                <Badge colorScheme={statusColors[selectedBooking.status] || "gray"} borderRadius="full">
                  {selectedBooking.status}
                </Badge>
                <Text color="gray.500" fontSize="sm">ID: {selectedBooking.id}</Text>
              </HStack>
              <Divider />
              <Box>
                <Text fontSize="sm" color="gray.600">Start</Text>
                <Text fontWeight="semibold" color="gray.800">{new Date(selectedBooking.start).toLocaleString()}</Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">End</Text>
                <Text fontWeight="semibold" color="gray.800">{new Date(selectedBooking.end).toLocaleString()}</Text>
              </Box>
              {selectedBooking.resourceId && (
                <Box>
                  <Text fontSize="sm" color="gray.600">Car</Text>
                  <Text fontWeight="semibold" color="gray.800">
                    {resourceById[selectedBooking.resourceId]?.name || selectedBooking.resourceId}
                  </Text>
                </Box>
              )}
            </VStack>
          ) : (
            <Text color="gray.600">No booking selected.</Text>
          )}
        </Box>
      </BaseModal>
    </VStack>
  );
}
