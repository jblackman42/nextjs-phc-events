import React from "react";

function getMonthDates(year: number, month: number): string[] {
  const startDate = new Date(Date.UTC(year, month, 1));
  const dates: string[] = [];
  while (startDate.getUTCMonth() === month) {
    dates.push(startDate.toISOString());
    startDate.setUTCDate(startDate.getUTCDate() + 1);
  }
  const currDate = new Date(dates[0]);
  const daysToGoBack = currDate.getUTCDay();
  for (let i = 0; i < daysToGoBack; i++) {
    currDate.setUTCDate(currDate.getUTCDate() - 1);
    dates.unshift(currDate.toISOString());
  }
  return dates;
}
function getFormattedDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
const getOrdinalSuffix = async (value: number | string): Promise<string> => {
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

// Use a fixed pattern instead of random numbers
const SKELETON_WIDTHS = [
  25, 15, 35, 20, 30, 10, 40,  // Week 1
  30, 20, 15, 35, 25, 40, 10,  // Week 2
  15, 35, 25, 10, 30, 20, 40,  // Week 3
  35, 10, 30, 20, 40, 15, 25,  // Week 4
  20, 40, 15, 25, 35, 10, 30,  // Week 5
  30, 15, 35, 20, 25, 40, 10   // Week 6
];

const MonthCalendarSkeleton = () => {
  const today = new Date();
  const monthDates = getMonthDates(today.getUTCFullYear(), today.getUTCMonth());

  return (<>
    <div className="w-full mb-2 text-center grid grid-cols-7 gap-1 lg:gap-2 max-w-screen-xl mx-auto">
      {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, i) => <div key={i}><h1 className="lg:uppercase font-normal text-base xl:text-xl"><span>{day.slice(0, 2)}</span><span className="hidden lg:inline-block">{day.slice(2, day.length)}</span></h1></div>)}
    </div>
    <div className="grid grid-cols-7 gap-1 lg:gap-2 max-w-screen-xl mx-auto">
      {monthDates.map((_, i) => (
        <div key={i} className="text-[2vw] lg:text-[22px] bg-primary text-secondary-foreground hover:bg-background w-full aspect-square rounded-sm md:rounded-md shadow-sm flex flex-col">
          <div className="m-[0.5em] mx-auto w-11 h-11 bg-primary animate-skeleton-breathe rounded-md"></div>
          <div className="m-[.15em] mt-auto w-24 h-7 bg-primary animate-skeleton-breathe rounded-md"></div>
          <div
            className="m-[.15em] mt-0 h-0.5 md:h-2 bg-primary animate-skeleton-breathe rounded-md"
            style={{ width: `${SKELETON_WIDTHS[i]}%` }}
          ></div>
        </div>
      ))}
    </div>
  </>)
};

export default MonthCalendarSkeleton;