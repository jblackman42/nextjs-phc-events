import { Calendar } from "@/components/pages";

import { getEventCounts, getMonthDates } from '@/app/actions';

const CalendarWrapper = async () => {
  const today = new Date();
  const monthDates = await getMonthDates(today.getUTCFullYear(), today.getUTCMonth());
  // const initialEventCounts = await getEventCounts(monthDates);

  return <>
    <Calendar initialDates={monthDates} />
  </>
}

export default CalendarWrapper;