"use client";
import { MPEvent, MPEventCount } from '@/lib/types';
import { useSettings } from '@/context/SettingsContext';
import {
  Dialog,
  DialogTrigger
} from "@/components/ui/dialog";
import { useEffect, useState } from 'react';
import { useView } from '@/context/ViewContext';
import DayPopup from '../DayPopup';
import EventPopup from '../EventPopup';
import { getEventCounts } from '@/app/actions';

const fullDayCount = 21;

function getOrdinalSuffix(value: number | string): string {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(num)) {
    throw new Error('Invalid input: not a number');
  }

  const remainder = num % 100;

  if (remainder >= 11 && remainder <= 13) {
    return 'th';
  }

  switch (num % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}
export function getFormattedDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function getMonthDates(year: number, month: number): string[] {
  const startDate = new Date(Date.UTC(year, month, 1));
  const dates: string[] = [];
  while (startDate.getUTCMonth() === month) {
    dates.push(startDate.toISOString().slice(0, 10));
    startDate.setUTCDate(startDate.getUTCDate() + 1);
  }
  const currDate = new Date(dates[0]);
  const daysToGoBack = currDate.getUTCDay();
  for (let i = 0; i < daysToGoBack; i++) {
    currDate.setUTCDate(currDate.getUTCDate() - 1);
    dates.unshift(currDate.toISOString().slice(0, 10));
  }
  return dates;
}

const MonthCalendarClient = ({ eventCounts, dates }: { eventCounts: MPEventCount[], dates: string[] }) => {
  const { settings } = useSettings();
  const { view, setView } = useView();
  const [allDates, setAllDates] = useState<string[]>(dates);
  const [allCounts, setAllCounts] = useState<MPEventCount[]>(eventCounts);
  const [totalCounts, setTotalCounts] = useState<number[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MPEvent | undefined>(undefined);

  const [dayPopupOpen, setDayPopupOpen] = useState<boolean>(false);
  const [eventPopupOpen, setEventPopupOpen] = useState<boolean>(false);

  useEffect(() => {
    const newDates = getMonthDates(view.current_date.getUTCFullYear(), view.current_date.getUTCMonth());
    setAllDates(newDates);
    setAllCounts([]);
  }, [view.current_date])

  useEffect(() => {
    (async () => {
      const newEventCounts = await getEventCounts(allDates, view.location_id, view.building_id, view.room_id);
      setAllCounts(newEventCounts);
    })()
  }, [allDates, view.location_id, view.building_id, view.room_id]);

  useEffect(() => {
    const newTotalCounts = allCounts.map(count => {
      return settings.showCancelledEvents.value ? count.Event_Count + count.Cancelled_Count : count.Event_Count;
    });
    setTotalCounts(newTotalCounts);
  }, [allCounts, settings.showCancelledEvents]);

  const handleDateClick = (date: Date) => {
    setView('selected_date', date);
    setDayPopupOpen(true);
  }

  const handleEventClick = (event: MPEvent) => {
    setEventPopupOpen(true);
    setSelectedEvent(event);
  }

  return <>
    <Dialog open={eventPopupOpen} onOpenChange={setEventPopupOpen}>
      <EventPopup event={selectedEvent} />
    </Dialog>
    <Dialog open={dayPopupOpen && !eventPopupOpen} onOpenChange={setDayPopupOpen}>
      <DayPopup eventCounts={allCounts} handleEventClick={handleEventClick} />
      {allDates.map((date, i) => {
        const currDate = new Date(date);
        const dateNum = currDate.getUTCDate();
        const eventCount = totalCounts[i] ?? 0;

        const uniqueKey = `${date}-${i}-${allDates.length}`;

        return <DialogTrigger asChild key={uniqueKey}>
          <div style={{ animationDelay: `${15 * i}ms` }} className="opacity-0 animate-calendar-fade">
            <button onClick={() => handleDateClick(currDate)} className="text-[2vw] lg:text-[22px] bg-secondary text-secondary-foreground hover:bg-background hover:duration-75 transition-colors duration-1000 w-full aspect-square rounded-sm md:rounded-md shadow-sm flex flex-col">
              <h1 className="m-0 mx-auto mt-[0.5em] text-[1.25em] leading-[1.25em] font-normal md:font-semibold">{dateNum}<sup>{getOrdinalSuffix(dateNum)}</sup></h1>
              {eventCount !== undefined && <p className="mt-auto mx-[.15em] font-extralight">{eventCount} Event{eventCount !== 1 ? "s" : ""}</p>}
              <div className="w-full h-0.5 md:h-2">
                <div style={{ width: `${Math.floor(eventCount / fullDayCount * 100)}%` }} className={`bg-accent h-full w-0 max-w-full rounded-full transition-[width]`}></div>
              </div>
            </button>
          </div>
        </DialogTrigger>
      })}
    </Dialog>
  </>
};

export default MonthCalendarClient;