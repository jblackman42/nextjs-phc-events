"use client";
import React, { useEffect, useState } from 'react';
import { MPEvent, MPEventCount } from '@/lib/types';
import { useSettings } from '@/context/SettingsContext';
import { useCurrentDate } from '@/context/CurrentDateContext';
import {
  DialogTrigger
} from "@/components/ui/dialog";

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
interface CalendarProps {
  monthDates: string[];
  eventCounts: MPEventCount[];
  handleClick: (date: Date) => void;
}

const MonthCalendarClient = ({ eventCounts }: { eventCounts: MPEventCount[] }) => {
  const { settings } = useSettings();
  const { setCurrentDate } = useCurrentDate();

  return (<>
    {eventCounts.map((count, i) => {
      const { Date: date, Event_Count, Cancelled_Count } = count;
      const currDate = new Date(date);
      const dateNum = currDate.getUTCDate();

      const totalCount = settings.showCancelledEvents ? Event_Count + Cancelled_Count : Event_Count;

      return <DialogTrigger asChild key={i}>
        <button onClick={() => setCurrentDate(currDate)} className="text-[2vw] lg:text-[22px] bg-secondary text-secondary-foreground hover:bg-background w-full aspect-square rounded-sm md:rounded-md shadow-sm flex flex-col">
          <h1 className="m-0 mx-auto mt-[0.5em] text-[1.25em] leading-[1.25em] font-normal md:font-semibold">{dateNum}<sup>{getOrdinalSuffix(dateNum)}</sup></h1>
          <p className="mt-auto mx-[.15em] font-extralight">{totalCount} Event{totalCount !== 1 ? "s" : ""}</p>
          <div className="w-full h-0.5 md:h-2">
            <div style={{ width: `${Math.floor(totalCount / fullDayCount * 100)}%` }} className={`bg-accent h-full max-w-full rounded-full`}></div>
          </div>
        </button>
      </DialogTrigger>
    })}
  </>)
};

export default MonthCalendarClient;