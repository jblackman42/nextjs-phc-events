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

const MonthCalendarSkeleton = () => {
  const today = new Date();
  const monthDates = getMonthDates(today.getUTCFullYear(), today.getUTCMonth());

  return (<>
    <div className="w-full mb-2 text-center grid grid-cols-7 gap-1 lg:gap-2 max-w-screen-xl mx-auto">
      {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, i) => <div key={i}><h1 className="lg:uppercase font-normal text-base xl:text-xl"><span>{day.slice(0, 2)}</span><span className="hidden lg:inline-block">{day.slice(2, day.length)}</span></h1></div>)}
    </div>
    <div className="grid grid-cols-7 gap-1 lg:gap-2 max-w-screen-xl mx-auto">
      {monthDates.map((date, i) => {
        const currDate = new Date(date);
        const dateNum = currDate.getUTCDate();

        return <div key={i} className="text-[2vw] lg:text-[22px] bg-secondary text-secondary-foreground hover:bg-background w-full aspect-square rounded-sm md:rounded-md shadow-sm flex flex-col">
          <div style={{ animationDelay: `${0 + (40 * i)}ms` }} className="m-[0.5em] mx-auto w-11 h-11 bg-primary animate-skeleton-breathe rounded-md"></div>
          <div style={{ animationDelay: `${500 + (40 * i)}ms` }} className="m-[.15em] mt-auto w-24 h-7 bg-primary animate-skeleton-breathe rounded-md"></div>
          <div className="w-full h-0.5 md:h-2">
            <div style={{ width: `100%`, animationDelay: `${1000 + (40 * i)}ms` }} className='bg-primary border border-secondary h-full max-w-full rounded-full animate-skeleton-breathe'></div>
          </div>
        </div>
      })}
      {/* {eventCounts.map((count, i) => {
        const { Date: date, Event_Count, Cancelled_Count } = count;
        const currDate = new Date(date);
        const dateNum = currDate.getUTCDate();

        const totalCount = settings.showCancelledEvents.value ? Event_Count + Cancelled_Count : Event_Count;
        const fullDayCount = 21;

        return <button key={i} onClick={() => handleClick(currDate)} style={{ animationDelay: `${20 * i}ms` }} className="text-[2vw] lg:text-[22px] opacity-0 animate-fade-slide-down bg-secondary text-secondary-foreground hover:bg-background w-full aspect-square rounded-sm md:rounded-md shadow-sm flex flex-col">
          <h1 className="m-0 mx-auto mt-[0.5em] text-[1.25em] leading-[1.25em] font-normal md:font-semibold">{dateNum}<sup>{getOrdinalSuffix(dateNum)}</sup></h1>
          <p className="mt-auto mx-[.15em] font-extralight">{totalCount} Event{totalCount !== 1 ? "s" : ""}</p>
          <div className="w-full h-0.5 md:h-2">
            <div style={{ width: `${Math.floor(totalCount / fullDayCount * 100)}%` }} className={`bg-accent h-full max-w-full rounded-full`}></div>
          </div>
        </button>
      })} */}
    </div>
  </>)
};

export default MonthCalendarSkeleton;