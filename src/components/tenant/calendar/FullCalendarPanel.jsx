import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { Box, Badge, Icon, Button, HStack, VStack, Text, useToast } from "@chakra-ui/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import BookingModal from "../booking/BookingModal";
import BaseModal from "../../base/BaseModal";
import CarProfile from "../CarProfile";
import { useSelector } from "react-redux";
import { listBookingsApi } from "../../../services/bookings";
import { FaUser, FaCar } from "react-icons/fa";
import DateFilterPopover from "./DateFilterPopover";

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
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedStart, setSelectedStart] = useState("");
  const [selectedEnd, setSelectedEnd] = useState("");
  const { items: cars } = useSelector((s) => s.cars);
  const calendarRef = useRef(null);
  const containerRef = useRef(null);
  const optionAnchorRef = useRef(null);
  const toast = useToast();

  const [events, setEvents] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentWeekKey, setCurrentWeekKey] = useState("");
  const [currentQueryMode, setCurrentQueryMode] = useState("month");
  const [optionOpen, setOptionOpen] = useState(false);
  const [optionPos, setOptionPos] = useState({ x: 0, y: 0 });
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [availStatus, setAvailStatus] = useState("available");

  const formatMonth = (dateLike) => {
    const d = new Date(dateLike);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}`;
  };

  const mapBookingToEvent = (b) => {
    const start = b?.start_date ? new Date(b.start_date) : null;
    const end = b?.end_date ? new Date(b.end_date) : null;

    const fullName = [
      b?.renter_first_name,
      b?.renter_middle_name,
      b?.renter_last_name,
    ]
      .filter(Boolean)
      .join(" ") || "Renter";

    const carLabel =
      b?.car?.info_model ||
      [b?.car?.info_make, b?.car?.info_model].filter(Boolean).join(" ") ||
      b?.car?.name ||
      b?.car_model ||
      b?.car_name ||
      "Car";

    const palette = [
      { bg: "#2563EB", border: "#1D4ED8" }, // blue
      { bg: "#059669", border: "#047857" }, // green
      { bg: "#7C3AED", border: "#6D28D9" }, // purple
      { bg: "#D97706", border: "#B45309" }, // amber
      { bg: "#EF4444", border: "#DC2626" }, // red
      { bg: "#0EA5E9", border: "#0284C7" }, // sky
      { bg: "#10B981", border: "#059669" }, // emerald
      { bg: "#475569", border: "#334155" }, // slate
    ];
    const key = String(b?.id || `${carLabel}-${fullName}`);
    let acc = 0;
    for (let i = 0; i < key.length; i++) acc = (acc + key.charCodeAt(i)) % 9973;
    const idx = acc % palette.length;
    const colors = palette[idx];

    return {
      id: String(b.id ?? key),
      title: `${carLabel} — ${fullName}`,
      start,
      end,
      allDay: true,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textColor: "#FFFFFF",
      extendedProps: { booking: b, carModel: carLabel },
    };
  };

  const fetchMonth = useCallback(async (monthStr) => {
    try {
      const res = await listBookingsApi({ month: monthStr, page: 1, includes: ["car"] });
      const list = Array.isArray(res?.data) ? res.data : [];
      setEvents(list.map(mapBookingToEvent));
      setCurrentMonth(monthStr);
      setCurrentQueryMode("month");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to load bookings", err);
      setEvents([]);
      setCurrentMonth(monthStr);
      setCurrentQueryMode("month");
    }
  }, []);

  // ISO week helpers (Monday as first day)
  const isoWeek = (dateLike) => {
    const d = new Date(Date.UTC(dateLike.getFullYear(), dateLike.getMonth(), dateLike.getDate()));
    const dayNum = (d.getUTCDay() + 6) % 7; // Monday=0
    d.setUTCDate(d.getUTCDate() - dayNum + 3); // Thursday
    const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
    const diff = d - firstThursday;
    return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
  };

  const isoWeekYear = (dateLike) => {
    const d = new Date(dateLike);
    d.setDate(d.getDate() + 4 - ((d.getDay() + 6) % 7));
    return d.getFullYear();
  };

  const fetchWeek = useCallback(async (weekNum, yearNum) => {
    const key = `${yearNum}-W${weekNum}`;
    try {
      const res = await listBookingsApi({ week: weekNum, year: yearNum, page: 1, includes: ["car"] });
      const list = Array.isArray(res?.data) ? res.data : [];
      setEvents(list.map(mapBookingToEvent));
      setCurrentWeekKey(key);
      setCurrentQueryMode("week");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to load weekly bookings", err);
      setEvents([]);
      setCurrentWeekKey(key);
      setCurrentQueryMode("week");
    }
  }, []);

  // Initial fetch for current month
  useEffect(() => {
    const now = new Date();
    fetchMonth(formatMonth(now));
  }, [fetchMonth]);
  const toLocalInput = (date) => {
    try {
      const d = new Date(date);
      const pad = (n) => String(n).padStart(2, "0");
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      const hh = pad(d.getHours());
      const mi = pad(d.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    } catch {
      return "";
    }
  };
  const onSelect = (info) => {
    // Set selection range and show small options popover at last pointer position
    const startStr = toLocalInput(info?.start);
    const endStr = toLocalInput(info?.end);
    setSelectedStart(startStr);
    setSelectedEnd(endStr);
    setRangeStart(startStr);
    setRangeEnd(endStr);
    setAvailStatus((prev) => prev || "available");
    if (containerRef.current && lastPointer.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setOptionPos({ x: lastPointer.current.x - rect.left, y: lastPointer.current.y - rect.top });
    } else {
      setOptionPos({ x: 12, y: 12 });
    }
    setOptionOpen(true);
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

  const resolveCarByModel = useCallback(
    (model) => {
      const list = Array.isArray(cars) ? cars : [];
      const lower = String(model || "").toLowerCase();
      return (
        list.find((c) => String(c?.raw?.info_model || c?.name || "").toLowerCase().includes(lower)) ||
        list[0] ||
        null
      );
    },
    [cars]
  );

  const onEventDidMount = useCallback(
    (info) => {
      const el = info.el;
      const model = info.event.extendedProps?.carModel;
      el.addEventListener("dblclick", () => {
        const car = resolveCarByModel(model);
        if (car) {
          setSelectedCar(car);
          setProfileOpen(true);
        }
      });
    },
    [resolveCarByModel]
  );

  const eventContent = useCallback(
    (arg) => {
      const b = arg?.event?.extendedProps?.booking || {};
      // Derive car label: prefer booking payload; fallback to store by car_id
      let carLabel =
        b?.car?.info_model ||
        [b?.car?.info_make, b?.car?.info_model].filter(Boolean).join(" ") ||
        b?.car?.name ||
        arg?.event?.extendedProps?.carModel;
      if (!carLabel || carLabel === "Car") {
        const vm = (cars || []).find((c) => Number(c?.id) === Number(b?.car_id));
        if (vm?.name) carLabel = vm.name;
      }
      carLabel = carLabel || `Car #${b?.car_id ?? ""}`;

      // Renter full name
      const fullName = [
        b?.renter_first_name,
        b?.renter_middle_name,
        b?.renter_last_name,
      ]
        .filter(Boolean)
        .join(" ") || "Renter";

      const status = b?.status || "";
      const isOngoing = String(status).toLowerCase() === "ongoing";

      return (
        <div style={{ padding: "2px 4px", lineHeight: 1.15 }}>
          {/* Inline keyframes for tiny pulse dot */}
          {isOngoing ? (
            <style>
              {`@keyframes tc-pulse { 0%{opacity:.4; transform: scale(.9);} 50%{opacity:1; transform: scale(1);} 100%{opacity:.4; transform: scale(.9);} }`}
            </style>
          ) : null}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Icon as={FaCar} boxSize={3} />
            <span style={{ fontSize: "0.92rem", fontWeight: 800 }}>{carLabel}</span>
            {status ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
                {isOngoing ? (
                  <span
                    aria-label="ongoing"
                    title="Ongoing"
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.85)",
                      animation: "tc-pulse 1.2s ease-in-out infinite",
                    }}
                  />
                ) : null}
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "1px 6px",
                    background: "rgba(255,255,255,0.22)",
                    borderRadius: 8,
                  }}
                >
                  {status}
                </span>
              </span>
            ) : null}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
            <Icon as={FaUser} boxSize={3} />
            <span style={{ fontSize: "0.84rem", fontWeight: 600, opacity: 0.95 }}>{fullName}</span>
          </div>
        </div>
      );
    },
    [cars]
  );

  const onDatesSet = useCallback(
    (arg) => {
      const view = arg?.view;
      const base = view?.currentStart || arg?.start || new Date();
      const type = String(view?.type || "");
      const isWeek = type.includes("Week") || type === "timeGridWeek" || type === "dayGridWeek";
      if (isWeek) {
        const w = isoWeek(base);
        const y = isoWeekYear(base);
        const key = `${y}-W${w}`;
        if (currentQueryMode !== "week" || key !== currentWeekKey) {
          fetchWeek(w, y);
        }
      } else {
        const monthStr = formatMonth(base);
        if (currentQueryMode !== "month" || monthStr !== currentMonth) {
          fetchMonth(monthStr);
        }
      }
    },
    [currentMonth, currentWeekKey, currentQueryMode, fetchMonth, fetchWeek]
  );

  // Track last pointer to anchor the small popover near click/drag end
  const lastPointer = useRef({ x: 0, y: 0 });
  const handleMouseDown = useCallback((e) => {
    lastPointer.current = { x: e.clientX, y: e.clientY };
  }, []);


  return (
    <Box className=" border border-gray-200 bg-white p-2" overflow="hidden" position="relative" ref={containerRef} onMouseDown={handleMouseDown}>
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
        eventDidMount={onEventDidMount}
        eventContent={eventContent}
        dayMaxEventRows={3}
        nowIndicator={true}
        firstDay={1}
        datesSet={onDatesSet}
        ref={calendarRef}
      />

      {/* Tiny options popover anchored to selection pointer */}
      <DateFilterPopover
        isOpen={optionOpen}
        onClose={() => setOptionOpen(false)}
        anchor={optionPos}
        startAt={rangeStart}
        endAt={rangeEnd}
        onChangeStart={(v) => setRangeStart(v)}
        onChangeEnd={(v) => setRangeEnd(v)}
        status={availStatus}
        onChangeStatus={(v) => setAvailStatus(v)}
        onCreate={() => setBookingOpen(true)}
        onApply={() => {
          try {
            const ev = new CustomEvent('tc:applyDateFilter', { detail: { start: rangeStart, end: rangeEnd, availability: availStatus } });
            window.dispatchEvent(ev);
          } catch {}
          toast({ title: 'Applied calendar date filter', status: 'info', duration: 2200 });
        }}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setBookingOpen(false)}
        startAt={selectedStart}
        endAt={selectedEnd}
      />

      <BaseModal
        title={selectedCar?.name || "Car Profile"}
        isOpen={isProfileOpen}
        onClose={() => setProfileOpen(false)}
        size="5xl"
        hassFooter={false}
      >
        {selectedCar ? <CarProfile raw={selectedCar.raw} /> : null}
      </BaseModal>
    </Box>
  );
}
