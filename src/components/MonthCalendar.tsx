import React from 'react';
import { MPEvent, getOrdinalSuffix, getFormattedDate, correctForTimezone, CalendarDate } from '@/lib/utils';

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