import axios from "axios";
import { MPEvent, CalendarDate, MPLocation } from "@/lib/types";
import { Calendar, ToastClientComponent } from '@/components';

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
const getCalendarDates = (year: number, month: number): string[] => {
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

const getEvents = async (startDate: string, endDate: string): Promise<MPEvent[]> => {
  return axios({
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY
    },
    params: { startDate, endDate }
  }).then(response => response.data);
}
const getLocations = async (): Promise<MPLocation[]> => {
  return axios({
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/locations`,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY
    }
  }).then(response => response.data);
}

const CalendarPage = async () => {
  let locations: MPLocation[] = [];
  let events: MPEvent[] = [];
  let monthDates: string[] = [];
  let errorMessage = '';

  const today = new CalendarDate();
  let year = today.getUTCFullYear();
  let month = today.getUTCMonth();

  try {
    monthDates = getCalendarDates(year, month);

    const startDate = new Date(monthDates[0]);
    const lastDate = new Date(monthDates[monthDates.length - 1]);
    const formattedStartDate = getFormattedDate(startDate);
    const formattedLastDate = getFormattedDate(new Date(lastDate.setDate(lastDate.getDate() + 1)));
    events = await getEvents(formattedStartDate, formattedLastDate);
    locations = await getLocations();
  } catch (error) {
    console.log('Failed to get events:', error);
    errorMessage = "Failed to retrieve events.";
  }

  return <>
    <Calendar initialDate={today} initialDates={monthDates} initialEvents={events} locations={locations} />
    {errorMessage && <ToastClientComponent key={errorMessage} message={errorMessage} variant="destructive" />}
  </>;
};

export default CalendarPage;
