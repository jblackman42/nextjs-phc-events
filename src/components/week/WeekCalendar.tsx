"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo, useContext } from 'react';
import { WeekEvent, correctForTimezone } from "@/lib/utils";


import { MPEvent } from "@/lib/types";

import { useView } from "@/context/ViewContext";
import { useSettings } from "@/context/SettingsContext";

import { getEvents, getFormattedDate } from "@/app/actions";

import { Dialog } from "@/components/ui/dialog";
import { EventPopup, EventHoverCard } from "@/components/popups";

const doEventsOverlap = (event1: MPEvent, event2: MPEvent): boolean => {
  // Convert to timestamps using string dates
  const start1 = new Date(event1.Event_Start_Date).getTime();
  const end1 = new Date(event1.Event_End_Date).getTime();
  const start2 = new Date(event2.Event_Start_Date).getTime();
  const end2 = new Date(event2.Event_End_Date).getTime();

  return start1 < end2 && start2 < end1;
};
const placeEventsInColumns = (events: MPEvent[], doEventsOverlap: (event1: MPEvent, event2: MPEvent) => boolean, hourHeightPx: number) => {
  const columns: WeekEvent[][] = [];
  const eventsWithColumns: WeekEvent[] = [];

  events.forEach(event => {
    const startDate = new Date(event.Event_Start_Date);
    const endDate = new Date(event.Event_End_Date);
    const eventLength = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const startHours = startDate.getUTCHours() + startDate.getUTCMinutes() / 60;

    // Add gap offset calculation (2px for each hour passed)
    const gapOffset = Math.floor(startHours) * 2;
    // Add gap pixels to the height (2px for each hour of event duration)
    const heightGaps = Math.floor(eventLength) * 2;

    const eventData: WeekEvent = {
      id: event.Event_ID,
      event: event,
      width: '',
      height: `${(eventLength * hourHeightPx) + heightGaps}px`,
      posX: '',
      posY: `${(startHours * hourHeightPx) + gapOffset}px`
    };

    let placed = false;

    for (let col = 0; col < columns.length; col++) {
      if (!columns[col].some(colEvent => doEventsOverlap(colEvent.event, event))) {
        columns[col].push(eventData);
        placed = true;
        break;
      }
    }

    if (!placed) {
      columns.push([eventData]);
    }

    eventsWithColumns.push(eventData);
  });

  return eventsWithColumns;
};

const WeekCalendar = () => {
  const { view } = useView();
  const { settings } = useSettings();
  const [events, setEvents] = useState<MPEvent[]>([]);
  const [hourHeightPx, setHourHeightPx] = useState(96);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [selectedEvent, setSelectedEvent] = useState<MPEvent | undefined>(undefined);

  const [eventPopupOpen, setEventPopupOpen] = useState<boolean>(false);

  // Add synchronous version of getFormattedDate
  const formatDate = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const adjustForOverlap = (weekEvents: WeekEvent[]) => {
    // Check if two events collide (i.e. overlap).
    function collides(a: WeekEvent, b: WeekEvent): boolean {
      return new Date(a.event.Event_End_Date) > new Date(b.event.Event_Start_Date) &&
        new Date(a.event.Event_Start_Date) < new Date(b.event.Event_End_Date);
    }

    // Expands events at the far right to use up any remaining space.
    function expand(e: WeekEvent, colIdx: number, cols: WeekEvent[][]): number {
      let colSpan = 1;
      cols.slice(colIdx + 1).some(col => {
        if (col.some(evt => collides(e, evt))) return true;
        colSpan += 1;
        return false;
      });
      return colSpan;
    }

    const groups: WeekEvent[][][] = [];
    let columns: WeekEvent[][] = [];
    let lastEventEnding: Date | undefined;

    weekEvents
      .sort((e1, e2) => {
        if (new Date(e1.event.Event_Start_Date) < new Date(e2.event.Event_Start_Date)) return -1;
        if (new Date(e1.event.Event_Start_Date) > new Date(e2.event.Event_Start_Date)) return 1;
        const e1Duration = new Date(e1.event.Event_End_Date).getTime() - new Date(e1.event.Event_Start_Date).getTime();
        const e2Duration = new Date(e2.event.Event_End_Date).getTime() - new Date(e2.event.Event_Start_Date).getTime();
        return e2Duration - e1Duration;
      })
      .forEach(e => {
        if (lastEventEnding && new Date(e.event.Event_Start_Date) >= lastEventEnding) {
          groups.push(columns);
          columns = [];
          lastEventEnding = undefined;
        }

        let placed = false;
        columns.some(col => {
          if (!collides(col[col.length - 1], e)) {
            col.push(e);
            placed = true;
          }
          return placed;
        });

        if (!placed) columns.push([e]);

        if (!lastEventEnding || new Date(e.event.Event_End_Date) > lastEventEnding) {
          lastEventEnding = new Date(e.event.Event_End_Date);
        }
      });

    groups.push(columns);

    groups.forEach(cols => {
      cols.forEach((col, colIdx) => {
        col.forEach(e => {
          e.width = `${expand(e, colIdx, cols) / cols.length * 100}%`;
          e.posX = `${colIdx / cols.length * 100}%`;
        });
      });
    });

    return weekEvents;
  };

  const processedEvents = useMemo(() => {
    return view.week_dates.map((date) => {
      const currDate = new Date(date);
      let daysEvents = events.filter(event =>
        formatDate(new Date(event.Event_Start_Date)) === formatDate(currDate)
      );

      // Filter out cancelled events if setting is false
      if (!settings.showCancelledEvents.value) {
        daysEvents = daysEvents.filter(event => !event.Cancelled);
      }

      daysEvents.sort((a, b) =>
        correctForTimezone(a.Event_Start_Date).getTime() - correctForTimezone(b.Event_Start_Date).getTime()
      );

      const weekEvents = placeEventsInColumns(daysEvents, doEventsOverlap, hourHeightPx);
      return adjustForOverlap(weekEvents);
    });
  }, [events, view.week_dates, hourHeightPx, settings.showCancelledEvents.value]);

  useEffect(() => {
    setHourHeightPx(window.innerWidth < 768 ? 56 : 96);
  }, []);

  const handleClick = useCallback((event: MPEvent) => {
    setSelectedEvent(event);
    setEventPopupOpen(true);
  }, []);

  useEffect(() => {
    let mounted = true;
    // Clear existing events immediately when weekDates changes
    setEvents([]);

    (async () => {
      const fetchedEvents = await getEvents(view.week_dates[0], view.week_dates[view.week_dates.length - 1], view.location_id, view.building_id, view.room_id);
      if (mounted) {
        setEvents(fetchedEvents);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [view.week_dates, view.location_id, view.building_id, view.room_id]);

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.scrollTop = 7 * (hourHeightPx + 2);
    }
  }, [hourHeightPx]);

  return (
    <div className="max-w-screen-xl min-w-[1024px] h-full mx-auto">
      <Dialog open={eventPopupOpen} onOpenChange={setEventPopupOpen}>
        <EventPopup event={selectedEvent} />
      </Dialog>
      <div className="h-full flex flex-col">
        <div className="flex justify-around pl-12">
          {view.week_dates.map((day: string, i: number) => (
            <div key={i} className="w-full p-1 px-2 flex gap-1 justify-start place-items-end">
              <h1 className="uppercase text-base lg:text-xl xl:text-2xl">
                {correctForTimezone(day).toLocaleDateString('en-us', { day: 'numeric' })}
              </h1>
              <p className="text-textHeading text-sm">
                {correctForTimezone(day).toLocaleDateString('en-us', { weekday: 'long' })}
              </p>
            </div>
          ))}
        </div>
        <div ref={calendarRef} className="overflow-y-auto overflow-x-hidden custom-scroller">
          <div className="flex gap-[2px]">
            <div className="w-12 ml-auto grid gap-[2px]">
              {[...Array(24)].map((_, j) => {
                const hour = j === 0 ? 12 : j > 12 ? j - 12 : j;
                const period = j >= 12 ? 'PM' : 'AM';
                return <div key={j} style={{ height: `${hourHeightPx}px` }} className="grid grid-template-rows-[1fr_1fr] gap-[1px] overflow-hidden rounded-md">
                  <div className="bg-primary h-full relative">
                    <p className="text-center text-textHeading px-1 text-xs whitespace-nowrap absolute left-1/2 -translate-x-1/2">
                      {hour} {period}
                    </p>
                  </div>
                  <div className="bg-primary h-full"></div>
                </div>;
              })}
            </div>
            <div className="w-full grid grid-cols-7 gap-[2px]">
              {view.week_dates.map((_, i) => (
                <div key={i} style={{ animationDelay: `${20 * i}ms` }} className="day-column hover:z-40 relative flex flex-col gap-[2px] bg-secondary text-secondary-foreground w-full rounded-sm">
                  {[...Array(24)].map((_, j) => (
                    <div key={j} style={{ height: `${hourHeightPx}px` }} className={`w-full bg-primary rounded-md`}></div>
                  ))}

                  {processedEvents[i]?.map((eventData: WeekEvent) =>
                    <EventHoverCard key={eventData.id} index={i} eventData={eventData} handleClick={handleClick} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeekCalendar;