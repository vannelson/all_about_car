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
import { listBookingsApi, updateBookingApi } from "../../../services/bookings";
import { FaUser, FaCar } from "react-icons/fa";
import { BOOKING_COLOR_PALETTE } from "../../../utils/calendarColors";
import { formatDateTimeLocalToApi } from "../../../utils/booking";
import DateFilterPopover from "./DateFilterPopover";
import EventInfoTooltip from "./EventInfoTooltip";
import FocusedCarBanner from "./FocusedCarBanner";

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
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoPos, setInfoPos] = useState({ x: 0, y: 0 });
  const [infoBooking, setInfoBooking] = useState(null);
  const [focusedCarId, setFocusedCarId] = useState(null);

  const [pendingEventIds, setPendingEventIds] = useState(() => new Set());

  const markEventPending = useCallback((eventId, pending) => {
    if (eventId == null) return;
    const key = String(eventId);
    setPendingEventIds((prev) => {
      const next = new Set(prev);
      if (pending) next.add(key);
      else next.delete(key);
      return next;
    });
  }, []);

  const setCalendarEventPending = useCallback(
    (calendarEvent, pending) => {
      if (!calendarEvent) return;
      try {
        calendarEvent.setExtendedProp("tcPending", pending);
      } catch {}
      try {
        calendarEvent.setProp("editable", !pending);
      } catch {}
      try {
        calendarEvent.setProp("startEditable", !pending);
      } catch {}
      try {
        calendarEvent.setProp("durationEditable", !pending);
      } catch {}
    },
    []
  );

  const formatMonth = (dateLike) => {
    const d = new Date(dateLike);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${yyyy}-${mm}`;
  };

  const mapBookingToEvent = useCallback((b) => {
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

    const palette = BOOKING_COLOR_PALETTE;
    const colorSeed =
      b?.car?.id ??
      b?.car_id ??
      (b?.car?.info_make || b?.car?.info_model
        ? `${b?.car?.info_make || ""}-${b?.car?.info_model || ""}`
        : carLabel);
    const normalizedSeed = String(colorSeed || carLabel).toLowerCase();
    let acc = 0;
    for (let i = 0; i < normalizedSeed.length; i++) acc = (acc + normalizedSeed.charCodeAt(i)) % 9973;
    const idx = acc % palette.length;
    const colors = palette[idx];

    const eventId = String(b?.id ?? `${carLabel}-${fullName}`);

    return {
      id: eventId,
      title: `${carLabel} — ${fullName}`,
      start,
      end,
      allDay: true,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textColor: "#FFFFFF",
      extendedProps: { booking: { ...b, car_id: b?.car_id ?? b?.car?.id }, carModel: carLabel },
    };
  }, []);

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
  }, [mapBookingToEvent]);

  // Listen for car focus events from car cards
  useEffect(() => {
    const handler = (e) => {
      const id = e?.detail?.carId;
      if (id !== undefined && id !== null) setFocusedCarId(Number(id));
    };
    window.addEventListener("tc:focusCarSchedules", handler);
    return () => window.removeEventListener("tc:focusCarSchedules", handler);
  }, []);

  // Allow ESC to clear focus
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && focusedCarId != null) setFocusedCarId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusedCarId]);

  // Derive visible events if focusedCarId is set
  const displayEvents = useMemo(() => {
    if (focusedCarId == null) return events;
    return (events || []).filter((ev) => {
      const b = ev?.extendedProps?.booking || {};
      const candidates = [b?.car_id, b?.car?.id, b?.raw?.id, b?.car?.car_id];
      return candidates.some((v) => v != null && Number(v) === Number(focusedCarId));
    });
  }, [events, focusedCarId]);

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
  }, [mapBookingToEvent]);

  const upsertBookingEvent = useCallback(
    (booking) => {
      if (!booking) return;
      setEvents((prev) => {
        const nextEvent = mapBookingToEvent(booking);
        const list = Array.isArray(prev) ? [...prev] : [];
        const idx = list.findIndex((ev) => String(ev.id) === String(nextEvent.id));
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...nextEvent };
        } else {
          list.push(nextEvent);
        }
        return list;
      });
    },
    [mapBookingToEvent]
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handler = (e) => {
      const booking = e?.detail;
      if (!booking) return;
      upsertBookingEvent(booking);
    };
    window.addEventListener("tc:bookingCreated", handler);
    return () => window.removeEventListener("tc:bookingCreated", handler);
  }, [upsertBookingEvent]);

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
  const syncEventDates = useCallback(
    async (info) => {
      const event = info?.event;
      const revert = info?.revert;
      const booking = event?.extendedProps?.booking || {};
      const bookingId = booking?.id ?? booking?.booking_id ?? event?.id;

      if (!event?.start || !bookingId) {
        if (typeof revert === "function") revert();
        toast({ title: "Unable to update booking", status: "error" });
        return;
      }

      const bookingKey = String(bookingId);
      if (pendingEventIds.has(bookingKey)) {
        if (typeof revert === "function") revert();
        return;
      }

      setCalendarEventPending(event, true);
      markEventPending(bookingId, true);

      const startDate = event.start;
      const parseFromBooking = (value) => {
        if (!value) return null;
        const str = String(value);
        const candidate = new Date(str.includes("T") ? str : str.replace(" ", "T"));
        return Number.isNaN(candidate.getTime()) ? null : candidate;
      };
      const originalStart = parseFromBooking(booking.start_date);
      const originalEnd = parseFromBooking(booking.end_date);
      let endDate = event.end;
      if (!endDate) {
        if (originalStart && originalEnd) {
          const duration = Math.max(originalEnd.getTime() - originalStart.getTime(), 60 * 60 * 1000);
          endDate = new Date(startDate.getTime() + duration);
        } else {
          endDate = addHours(startDate, 24);
        }
      }
      const startStr = formatDateTimeLocalToApi(startDate);
      const endStr = formatDateTimeLocalToApi(endDate);

      try {
        const response = await updateBookingApi({
          id: bookingId,
          start_date: startStr,
          end_date: endStr,
        });
        const updated = response?.data || response || {};
        const nextBooking = {
          ...booking,
          ...updated,
          start_date: updated?.start_date || startStr,
          end_date: updated?.end_date || endStr,
        };
        const remapped = mapBookingToEvent(nextBooking);

        setEvents((prev) => {
          const list = Array.isArray(prev) ? prev : [];
          return list.map((ev) => {
            if (String(ev.id) !== String(event.id)) return ev;
            return { ...ev, ...remapped, id: ev.id };
          });
        });

        try {
          window.dispatchEvent(
            new CustomEvent("tc:bookingUpdated", {
              detail: {
                id: bookingId,
                start_date: nextBooking.start_date,
                end_date: nextBooking.end_date,
              },
            })
          );
        } catch {}

        toast({ title: "Booking dates updated", status: "success" });
      } catch (err) {
        if (typeof revert === "function") revert();
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to update booking dates";
        toast({ title: msg, status: "error" });
      } finally {
        setCalendarEventPending(event, false);
        markEventPending(bookingId, false);
      }
    },
    [mapBookingToEvent, markEventPending, pendingEventIds, setCalendarEventPending, toast]
  );

  const onEventDrop = useCallback(
    (info) => {
      syncEventDates(info);
    },
    [syncEventDates]
  );
  const onEventResize = useCallback(
    (info) => {
      syncEventDates(info);
    },
    [syncEventDates]
  );

  const eventAllow = useCallback(
    (_dropInfo, draggedEvent) => {
      const key =
        draggedEvent?.id != null
          ? String(draggedEvent.id)
          : draggedEvent?.extendedProps?.booking?.id != null
          ? String(draggedEvent.extendedProps.booking.id)
          : null;
      if (!key) return true;
      return !pendingEventIds.has(key);
    },
    [pendingEventIds]
  );

  // React to booking updates to patch local event data
  useEffect(() => {
    const handler = (e) => {
      const { id, status, actual_return_date, start_date, end_date } = e?.detail || {};
      if (id == null) return;
      setEvents((prev) =>
        (prev || []).map((ev) => {
          if (String(ev.id) !== String(id)) return ev;
          const booking = { ...(ev.extendedProps?.booking || {}) };
          if (status !== undefined) booking.status = status;
          if (actual_return_date !== undefined) booking.actual_return_date = actual_return_date;
          if (start_date !== undefined) booking.start_date = start_date;
          if (end_date !== undefined) booking.end_date = end_date;

          const nextEvent = { ...ev, extendedProps: { ...ev.extendedProps, booking } };
          const parseDate = (value, fallback) => {
            if (value == null) return fallback ?? null;
            const asString = String(value);
            const candidate = new Date(asString.includes('T') ? asString : asString.replace(' ', 'T'));
            return Number.isNaN(candidate.getTime()) ? fallback ?? null : candidate;
          };
          if (start_date !== undefined) {
            nextEvent.start = parseDate(start_date, ev.start);
          }
          if (end_date !== undefined) {
            nextEvent.end = parseDate(end_date, ev.end);
          }
          return nextEvent;
        })
      );
    };
    window.addEventListener("tc:bookingUpdated", handler);
    return () => window.removeEventListener("tc:bookingUpdated", handler);
  }, []);
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
        events={displayEvents}
        selectable={true}
        selectMirror={true}
        select={onSelect}
        editable={true}
        eventAllow={eventAllow}
        eventDrop={onEventDrop}
        eventResize={onEventResize}
        eventDisplay="block"
        eventDidMount={onEventDidMount}
        eventContent={eventContent}
        dayMaxEventRows={5}
        nowIndicator={true}
        firstDay={1}
        datesSet={onDatesSet}
        ref={calendarRef}
      />

      <FocusedCarBanner
        focusedCarId={focusedCarId}
        cars={cars}
        onClear={() => setFocusedCarId(null)}
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

      <EventInfoTooltip
        isOpen={infoOpen}
        onClose={() => setInfoOpen(false)}
        anchor={infoPos}
        booking={infoBooking}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setBookingOpen(false)}
        startAt={selectedStart}
        endAt={selectedEnd}
        onBookingCreated={upsertBookingEvent}
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



