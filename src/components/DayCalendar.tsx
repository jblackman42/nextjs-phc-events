import React, { useEffect, useState, useRef } from 'react';
import { MPEvent, correctForTimezone, WeekEvent } from '@/lib/utils';
import EventHoverCard from './EventHoverCard';

interface CalendarProps {
  date: Date;
  events: MPEvent[];
  getFormattedDate: (date: Date) => string;
  handleClick: (event: MPEvent) => void;
}

const doEventsOverlap = (event1: MPEvent, event2: MPEvent): boolean => {
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

    const eventData: WeekEvent = {
      id: event.Event_ID,
      event: event,
      width: '',
      height: `${eventLength * hourHeightPx}px`,
      posX: '',
      posY: `${startHours * hourHeightPx}px`
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

const DayCalendar: React.FC<CalendarProps> = ({ date, events, getFormattedDate, handleClick }) => {
  const [hourHeightPx, setHourHeightPx] = useState(window.innerWidth < 768 ? 56 : 96);
  const calendarRef = useRef<HTMLDivElement>(null);

  const [daysEvents, setDaysEvents] = useState<Array<WeekEvent>>([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setHourHeightPx(56);
      } else {
        setHourHeightPx(96);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.scrollTop = 7 * hourHeightPx;
    }
  }, [hourHeightPx]);

  useEffect(() => {
    const currDate = new Date(date);
    const tempDaysEvents = events.filter(event => getFormattedDate(new Date(event.Event_Start_Date)) === getFormattedDate(currDate));
    tempDaysEvents.sort((a, b) => correctForTimezone(a.Event_Start_Date).getTime() - correctForTimezone(b.Event_Start_Date).getTime());

    const initialColumnsEvents = placeEventsInColumns(tempDaysEvents, doEventsOverlap, hourHeightPx);
    const adjustedDaysEvents = adjustForOverlap(initialColumnsEvents);
    setDaysEvents(adjustedDaysEvents);
  }, [events, date, getFormattedDate, hourHeightPx]);

  const adjustForOverlap = (weekEvents: WeekEvent[]) => {
    // Check if two events collide (i.e. overlap).
    function collides(a: WeekEvent, b: WeekEvent): boolean {
      return new Date(a.event.Event_End_Date) > new Date(b.event.Event_Start_Date) && new Date(a.event.Event_Start_Date) < new Date(b.event.Event_End_Date);
    }

    // Expands events at the far right to use up any remaining space.
    // Returns the number of columns the event can expand into, without colliding with other events.
    function expand(e: WeekEvent, colIdx: number, cols: WeekEvent[][]): number {
      let colSpan = 1;
      cols.slice(colIdx + 1).some(col => {
        if (col.some(evt => collides(e, evt))) return true;
        colSpan += 1;
        return false;
      });
      return colSpan;
    }

    // Each group contains columns of events that overlap.
    const groups: WeekEvent[][][] = [];
    // Each column contains events that do not overlap.
    let columns: WeekEvent[][] = [];
    let lastEventEnding: Date | undefined;

    // Place each event into a column within an event group.
    weekEvents
      .sort((e1, e2) => {
        // Sort by start time
        if (new Date(e1.event.Event_Start_Date) < new Date(e2.event.Event_Start_Date)) return -1;
        if (new Date(e1.event.Event_Start_Date) > new Date(e2.event.Event_Start_Date)) return 1;
        // Then sort by event length (longer events first)
        const e1Duration = new Date(e1.event.Event_End_Date).getTime() - new Date(e1.event.Event_Start_Date).getTime();
        const e2Duration = new Date(e2.event.Event_End_Date).getTime() - new Date(e2.event.Event_Start_Date).getTime();
        return e2Duration - e1Duration;
      })
      .forEach(e => {
        // Check if a new event group needs to be started.
        if (lastEventEnding && new Date(e.event.Event_Start_Date) >= lastEventEnding) {
          // The event is later than any of the events in the current group. There is no overlap. Output the current event group and start a new one.
          groups.push(columns);
          columns = [];
          lastEventEnding = undefined;
        }

        // Try to place the event inside an existing column.
        let placed = false;
        columns.some(col => {
          if (!collides(col[col.length - 1], e)) {
            col.push(e);
            placed = true;
          }
          return placed;
        });

        // It was not possible to place the event (it overlaps with events in each existing column). Add a new column to the current event group with the event in it.
        if (!placed) columns.push([e]);

        // Remember the last event end time of the current group.
        if (!lastEventEnding || new Date(e.event.Event_End_Date) > lastEventEnding) lastEventEnding = new Date(e.event.Event_End_Date);
      });

    groups.push(columns);

    // Adjust width and position for each event based on the calculated groups and columns.
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

  return (
    <div className="w-full max-w-screen-xl h-full mx-auto">
      <div className="h-full flex flex-col">
        <div ref={calendarRef} className="overflow-y-auto overflow-x-hidden custom-scroller">
          <div className="flex">
            <div className="w-12 ml-auto">
              {[...Array(24)].map((_, j) => {
                const hour = j === 0 ? 12 : j > 12 ? j - 12 : j;
                const period = j >= 12 ? 'PM' : 'AM';
                return (
                  <div key={j} style={{ height: `${hourHeightPx}px` }}>
                    <p className="text-center text-textHeading px-1 text-xs whitespace-nowrap">
                      {hour} {period}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="w-full">
              <div className="day-column hover:z-40 relative flex flex-col justify-between bg-secondary text-secondary-foreground w-full rounded-sm">
                {[...Array(24)].map((_, j) => (
                  <div key={j} style={{ height: `${hourHeightPx}px` }} className={`w-full border-b border-primary`}></div>
                ))}
                {daysEvents.map(eventData =>
                  <EventHoverCard key={eventData.id} eventData={eventData} handleClick={handleClick} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayCalendar;