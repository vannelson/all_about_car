import React, { useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// Note: FullCalendar v6+ packages may not ship CSS by default in ESM builds.
// You can add custom styles or include a CDN stylesheet if desired.

// A thin wrapper around FullCalendar to keep the Calendars page tidy
// Props:
// - events: array of { id, title, start, end, allDay? }
// - onEventsChange: fn(updatedEvents)
// - initialView: string (default 'dayGridMonth')
export default function Scheduler({ events = [], onEventsChange, initialView = "dayGridMonth" }) {
  const handleSelect = useCallback(
    (info) => {
      const newEvent = {
        id: Math.random().toString(36).slice(2),
        title: "New Booking",
        start: info.startStr,
        end: info.endStr,
        allDay: info.allDay,
      };
      onEventsChange?.([...(events || []), newEvent]);
    },
    [events, onEventsChange]
  );

  const updateEventInList = (changed) => {
    const next = (events || []).map((ev) =>
      ev.id === changed.id
        ? { ...ev, start: changed.startStr || changed.start, end: changed.endStr || changed.end, allDay: changed.allDay }
        : ev
    );
    onEventsChange?.(next);
  };

  const handleEventDrop = useCallback((info) => {
    updateEventInList(info.event);
  }, [events, onEventsChange]);

  const handleEventResize = useCallback((info) => {
    updateEventInList(info.event);
  }, [events, onEventsChange]);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView={initialView}
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      height="auto"
      selectable
      selectMirror
      dayMaxEvents
      events={events}
      select={handleSelect}
      editable
      eventDrop={handleEventDrop}
      eventResize={handleEventResize}
    />
  );
}
