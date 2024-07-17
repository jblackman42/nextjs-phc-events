import React from 'react';
import { MPEvent } from '@/lib/types';
export function correctForTimezone(date: string): Date {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + result.getTimezoneOffset());
  return result;
}
export function getOrdinalSuffix(value: number | string): string {
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
  events: MPEvent[];
  handleClick: (date: Date) => void;
}

const MonthCalendar: React.FC<CalendarProps> = ({ monthDates, events, handleClick }) => {
  return (<>
    <div className="w-full mb-2 text-center grid grid-cols-7 gap-1 lg:gap-2 max-w-screen-xl mx-auto">
      {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, i) => <div key={i}><h1 className="lg:uppercase font-normal text-base xl:text-xl"><span>{day.slice(0, 2)}</span><span className="hidden lg:inline-block">{day.slice(2, day.length)}</span></h1></div>)}
    </div>
    <div className="grid grid-cols-7 gap-1 lg:gap-2 max-w-screen-xl mx-auto">
      {monthDates.map((date, i) => {
        const currDate = correctForTimezone(date);
        const dateNum = currDate.getUTCDate();
        const daysEvents = events.filter(event => getFormattedDate(new Date(event.Event_Start_Date)) === getFormattedDate(currDate));

        const fullDayCount = 21;

        return <button key={i} onClick={() => handleClick(currDate)} style={{ animationDelay: `${20 * i}ms` }} className="text-[2vw] lg:text-[22px] opacity-0 animate-fade-slide-down bg-secondary text-secondary-foreground hover:bg-background w-full aspect-square rounded-sm md:rounded-md shadow-sm flex flex-col">
          <h1 className="m-0 mx-auto mt-[0.5em] text-[1.25em] leading-[1.25em] font-normal md:font-semibold">{dateNum}<sup>{getOrdinalSuffix(dateNum)}</sup></h1>
          <p className="mt-auto mx-[.15em] font-extralight">{daysEvents.length} Event{daysEvents.length !== 1 ? "s" : ""}</p>
          <div className="w-full h-0.5 md:h-2">
            <div style={{ width: `${Math.floor(daysEvents.length / fullDayCount * 100)}%` }} className={`bg-accent h-full max-w-full rounded-full`}></div>
          </div>
        </button>
      })}
    </div>
  </>)
};

export default MonthCalendar;