"use client";
import { MPEventCount } from '@/lib/types';
import { useSettings } from '@/context/SettingsContext';
import {
  DialogTrigger
} from "@/components/ui/dialog";
import { useEffect, useState } from 'react';
import { useView } from '@/context/ViewContext';

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

const MonthCalendarClient = ({ eventCounts }: { eventCounts: MPEventCount[] }) => {
  const { settings } = useSettings();
  const { setView } = useView();
  const [totalCounts, setTotalCounts] = useState<number[]>([]);

  useEffect(() => {
    const newTotalCounts = eventCounts.map(count => {
      return settings.showCancelledEvents.value ? count.Event_Count + count.Cancelled_Count : count.Event_Count;
    });
    setTotalCounts(newTotalCounts);
  }, [eventCounts, settings.showCancelledEvents])

  return (<>
    {eventCounts.map((count, i) => {
      const currDate = new Date(count.Date);
      const dateNum = currDate.getUTCDate();
      const eventCount = totalCounts[i];


      return <DialogTrigger asChild key={i}>
        <button onClick={() => setView('selected_date', currDate)} className="text-[2vw] lg:text-[22px] bg-secondary text-secondary-foreground hover:bg-background w-full aspect-square rounded-sm md:rounded-md shadow-sm flex flex-col">
          <h1 className="m-0 mx-auto mt-[0.5em] text-[1.25em] leading-[1.25em] font-normal md:font-semibold">{dateNum}<sup>{getOrdinalSuffix(dateNum)}</sup></h1>
          <p className="mt-auto mx-[.15em] font-extralight">{eventCount} Event{eventCount !== 1 ? "s" : ""}</p>
          <div className="w-full h-0.5 md:h-2">
            <div style={{ width: `${Math.floor(eventCount / fullDayCount * 100)}%` }} className={`bg-accent h-full max-w-full rounded-full`}></div>
          </div>
        </button>
      </DialogTrigger>
    })}
  </>)
};

export default MonthCalendarClient;