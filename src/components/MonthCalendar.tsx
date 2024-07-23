import { getEventCounts } from '@/app/actions';
import MonthCalendarClient from './MonthCalendarClient'

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

const MonthCalendar = async () => {
  const today = new Date();
  const monthDates = getMonthDates(today.getUTCFullYear(), today.getUTCMonth());
  const eventCounts = await getEventCounts(monthDates);

  return (<>
    <div className="w-full mb-2 text-center grid grid-cols-7 gap-1 lg:gap-2 max-w-screen-xl mx-auto">
      {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, i) => <div key={i}><h1 className="lg:uppercase font-normal text-base xl:text-xl"><span>{day.slice(0, 2)}</span><span className="hidden lg:inline-block">{day.slice(2, day.length)}</span></h1></div>)}
    </div>
    <div className="grid grid-cols-7 gap-1 lg:gap-2 max-w-screen-xl mx-auto">
      <MonthCalendarClient eventCounts={eventCounts} />
    </div>
  </>)
};

export default MonthCalendar;