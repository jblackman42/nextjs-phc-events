import React, { useEffect, useState } from 'react';

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

function getCalendarDates(month?: number): Date[] {
  const now = new Date();
  const year = now.getFullYear();
  const currentMonth = month !== undefined ? month : now.getMonth();
  const firstDayOfMonth = new Date(year, currentMonth, 1);
  const lastDayOfMonth = new Date(year, currentMonth + 1, 0);

  // Get the day of the week for the first day of the month (0 for Sunday, 6 for Saturday)
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Calculate the start date, which is the last Sunday before the first day of the month
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(firstDayOfMonth.getDate() - firstDayOfWeek);

  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  // Populate the array with dates from the start date to the last day of the month
  while (currentDate <= lastDayOfMonth || currentDate.getDay() !== 0) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Ensure the array does not extend beyond the last Saturday of the month
  while (dates[dates.length - 1].getMonth() !== currentMonth) {
    dates.pop();
  }

  return dates;
}

export default function Calendar() {
  const [monthDates, setMonthDates] = useState<Array<Date>>([]);
  useEffect(() => {
    setMonthDates(getCalendarDates());
  }, []);

  return (
    <article className="flex flex-col gap-2 md:gap-4 w-full">
      <div className="w-full bg-primary p-4 flex items-center md:rounded-sm shadow-sm h-12">
        <h1 className="h-max">test</h1>
      </div>
      <div className="w-full h-full bg-primary md:rounded-sm shadow-sm p-4">
        <div className="grid grid-cols-7 gap-2 lg:gap-4 max-w-screen-xl mx-auto">
          {monthDates.map((date, i) => {
            const dateNum = date.getDate();
            return <div key={i} style={{ animationDelay: `${20 * i}ms` }} className={`opacity-0 animate-fade-slide-down bg-secondary text-secondary-foreground hover:bg-background w-full aspect-square rounded-md shadow-md flex flex-col`}>
              <h1 className="text-center m-2">{dateNum}<sup>{getOrdinalSuffix(dateNum)}</sup></h1>
              <p className="mt-auto mx-1">27 Events</p>
              <div className="w-full h-2">
                <div className="bg-accent h-full w-[50%] rounded-full"></div>
              </div>
            </div>
          })}
        </div>
      </div>
    </article>
  );
};