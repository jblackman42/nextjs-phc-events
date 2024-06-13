import React, { useEffect, useRef } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MPEvent, correctForTimezone } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faLocationDot, faFolderOpen } from '@awesome.me/kit-10a739193a/icons/classic/light';
import { faUpRightAndDownLeftFromCenter } from '@awesome.me/kit-10a739193a/icons/classic/solid';

interface WeekEvent {
  id: number;
  event: MPEvent;
  width: string;
  height: string;
  posX: string;
  posY: string;
}

interface CalendarProps {
  weekDates: string[];
  events: MPEvent[];
  getFormattedDate: (date: Date) => string;
  handleClick: () => void;
}

const doEventsOverlap = (event1: MPEvent, event2: MPEvent): boolean => {
  const start1 = new Date(event1.Event_Start_Date).getTime();
  const end1 = new Date(event1.Event_End_Date).getTime();
  const start2 = new Date(event2.Event_Start_Date).getTime();
  const end2 = new Date(event2.Event_End_Date).getTime();

  return start1 < end2 && start2 < end1;
};

const WeekCalendar: React.FC<CalendarProps> = ({ weekDates, events, getFormattedDate, handleClick }) => {
  const hourHeightPx = 96;
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.scrollTop = 7 * hourHeightPx;
    }
  }, []);

  const placeEventsInColumns = (events: MPEvent[], doEventsOverlap: (event1: MPEvent, event2: MPEvent) => boolean) => {
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
    <div className="w-[1280px] max-w-full h-full mx-auto">
      <div className="h-full flex flex-col">
        <div className="flex justify-around pl-12">
          {weekDates.map((day, i) => (
            <h1 key={i} className="uppercase text-base lg:text-xl xl:text-2xl">
              {correctForTimezone(day).toLocaleDateString('en-us', { month: 'short', day: 'numeric' })}
            </h1>
          ))}
        </div>
        <div ref={calendarRef} className="overflow-y-auto overflow-x-hidden custom-scroller">
          <div className="flex">
            <div className="w-12 ml-auto">
              {[...Array(24)].map((_, j) => {
                const hour = j === 0 ? 12 : j > 12 ? j - 12 : j;
                const period = j >= 12 ? 'PM' : 'AM';
                return (
                  <div key={j} className="h-24">
                    <p className="text-center text-textHeading px-1 text-xs">
                      {hour} {period}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="w-full grid grid-cols-7 gap-[2px]">
              {weekDates.map((date, i) => {
                const currDate = new Date(date);
                const daysEvents = events.filter(event => getFormattedDate(new Date(event.Event_Start_Date)) === getFormattedDate(currDate) && !event.Cancelled);

                daysEvents.sort((a, b) => correctForTimezone(a.Event_Start_Date).getTime() - correctForTimezone(b.Event_Start_Date).getTime());

                const weekEvents = placeEventsInColumns(daysEvents, doEventsOverlap);
                const adjustedWeekEvents = adjustForOverlap(weekEvents);

                return (
                  <div key={i} style={{ animationDelay: `${20 * i}ms` }} className="day-column hover:z-40 relative flex flex-col justify-between bg-secondary text-secondary-foreground w-full rounded-sm">
                    {[...Array(24)].map((_, j) => (
                      <div key={j} style={{ height: `${hourHeightPx}px` }} className={`w-full border-b border-primary`}></div>
                    ))}

                    {adjustedWeekEvents.map(eventData => {
                      const { id, event, width, height, posX, posY } = eventData;
                      const startDate = correctForTimezone(event.Event_Start_Date);
                      const endDate = correctForTimezone(event.Event_End_Date);
                      const weekdayShort = startDate.toLocaleDateString('en-us', { weekday: "short" });
                      const formattedDate = `${startDate.getUTCMonth()}/${startDate.getUTCDate()}/${startDate.getUTCFullYear()}`;
                      const startTime = startDate.toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' });
                      const endTime = endDate.toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' });
                      return (
                        <HoverCard key={id}>
                          <HoverCardTrigger asChild>
                            <div onClick={() => handleClick()} style={{ top: posY, left: posX, height: height, width: width }} className="absolute cursor-pointer rounded-md bg-accent hover:bg-accent-2 shadow-md border-accent-0 border-l-4 border-l-accent-3 border overflow-hidden">
                              <p className="font-bold text-textHeading text-xs mx-1 whitespace-nowrap overflow-hidden text-clip">{event.Event_Title}</p>
                              <p className="text-xs mx-1 whitespace-nowrap overflow-hidden text-clip">{event.Location_Name}</p>
                              <p className="text-xs mx-1 whitespace-nowrap overflow-hidden text-clip">{event.Primary_Contact}</p>
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80" align={i < 2 ? "start" : i > 4 ? "end" : "center"}>
                            <div className="overflow-hidden">
                              <div className="w-full bg-background py-1 px-2 flex justify-between">
                                <h1 className="font-light text-base overflow-hidden whitespace-nowrap text-ellipsis"><span className="font-semibold">{event.Congregation_Name}</span> - {event.Primary_Contact}</h1>
                                <button><FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} /></button>
                              </div>
                              <div className="p-2">
                                <h1 className="text-2xl mx-[2px] font-semibold overflow-hidden whitespace-nowrap text-ellipsis">{event.Event_Title}</h1>
                                <Separator className="my-2 opacity-25 w-full" />



                                <div className="flex gap-2 items-center">
                                  <div>
                                    <FontAwesomeIcon icon={faClock} className="text-xl aspect-square mb-2" />
                                  </div>
                                  <div className="w-full overflow-hidden">
                                    <p className="overflow-hidden whitespace-nowrap text-ellipsis">{weekdayShort} {formattedDate} {startTime} - {endTime}</p>
                                    <Separator className="my-2 opacity-25 w-full" />
                                  </div>
                                </div>

                                <div className="flex gap-2 items-center">
                                  <div>
                                    <FontAwesomeIcon icon={faLocationDot} className="text-xl aspect-square mb-2" />
                                  </div>
                                  <div className="w-full overflow-hidden">
                                    <p className="overflow-hidden whitespace-nowrap text-ellipsis">{event.Location_Name} | {event.Booked_Rooms}</p>
                                    <Separator className="my-2 opacity-25 w-full" />
                                  </div>
                                </div>

                                <div className="flex gap-2 items-center">
                                  <div>
                                    <FontAwesomeIcon icon={faFolderOpen} className="text-xl aspect-square" />
                                  </div>
                                  <div className="w-full overflow-hidden">
                                    <p className="overflow-hidden whitespace-nowrap text-ellipsis">{event.Event_Type}</p>
                                    <Separator className="opacity-0 w-full" />
                                  </div>
                                </div>



                              </div>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekCalendar;