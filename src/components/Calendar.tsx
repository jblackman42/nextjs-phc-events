import axios from 'axios';
import React, { useEffect, useState, useRef, useContext } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { LoadingContext, MPEvent } from '@/lib/utils';

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

function getCalendarDates(year?: number, month?: number): string[] {
  const now = new Date();
  const currYear = year ?? now.getFullYear();
  const currMonth = month ?? now.getMonth();
  const startDate = new Date(currYear, currMonth, 1);

  const dates: string[] = [];

  while (startDate.getMonth() === currMonth) {
    dates.push(startDate.toISOString());
    startDate.setDate(startDate.getDate() + 1);
  }

  const currDate = new Date(dates[0]);
  const daysToGoBack = currDate.getDay();
  for (let i = 0; i < daysToGoBack; i++) {
    currDate.setDate(currDate.getDate() - 1);
    dates.unshift(currDate.toISOString());
  }

  return dates;
}

function getFormattedDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


export default function Calendar() {
  const { toast } = useToast();
  const { updateLoading } = useContext(LoadingContext);

  const initialized = useRef(false);
  const [monthDates, setMonthDates] = useState<Array<string>>([]);
  const [events, setEvents] = useState<Array<MPEvent>>([]);

  async function getEvents(startDate: string, endDate: string) {
    return await axios({
      method: "GET",
      url: "/api/events",
      params: {
        startDate: startDate,
        endDate: endDate
      }
    })
      .then(response => response.data);
  };


  useEffect(() => {
    async function getCalendarInformation() {
      updateLoading(true);
      try {
        const dates = getCalendarDates();
        console.log(dates);
        const startDate = dates[0];
        const lastDate = new Date(dates[dates.length - 1]);
        const endDate = getFormattedDate(new Date(lastDate.setDate(lastDate?.getDate() + 1)));

        const events = await getEvents(startDate, endDate);

        setMonthDates(dates);
        setEvents(events);
        console.log(events);
      } catch (error) {
        console.error(error);
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try Again" onClick={getCalendarInformation}>Try Again</ToastAction>,
          variant: "destructive"
        })
      }
      updateLoading(false);
    }

    if (initialized.current) return;
    (async () => {
      initialized.current = true;

      await getCalendarInformation();
    })();
  }, [toast, updateLoading]);

  return (
    <article className="flex flex-col gap-2 md:gap-4 w-full">
      <div className="w-full bg-primary p-4 flex items-center md:rounded-sm shadow-sm h-12">
        <h1 className="h-max">test</h1>
      </div>
      <div className="w-full h-full bg-primary md:rounded-sm shadow-sm p-4">
        <div className="mb-4 text-center grid grid-cols-7 gap-1 lg:gap-4 max-w-screen-xl mx-auto">
          {
            ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
              .map((day, i) => <div key={i}><h1 className="uppercase text-xl">{day}</h1></div>)
          }
        </div>
        <div className="grid grid-cols-7 gap-1 lg:gap-4 max-w-screen-xl mx-auto">
          {monthDates.map((date, i) => {
            const currDate = new Date(date);
            const dateNum = currDate.getDate();
            const eventCount = events.filter(event => getFormattedDate(new Date(event.Event_Start_Date)) === getFormattedDate(currDate)).length;

            const fullDayCount = 21;

            return <button key={i} style={{ animationDelay: `${20 * i}ms` }} className="opacity-0 animate-fade-slide-down bg-secondary text-secondary-foreground hover:bg-background w-full aspect-square rounded-md shadow-md flex flex-col">
              <h1 className="m-2 text-sm md:text-lg">{dateNum}<sup>{getOrdinalSuffix(dateNum)}</sup></h1>
              <p className="mt-auto mx-1">{eventCount} Events</p>
              <div className="w-full h-1 md:h-2">
                <div style={{ width: `${Math.floor(eventCount / fullDayCount * 100)}%` }} className={`bg-accent h-full max-w-full rounded-full`}></div>
              </div>
            </button>
          })}
        </div>
      </div>
    </article>
  );
};