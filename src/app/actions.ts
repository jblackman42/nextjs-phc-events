'use server';
import { cache } from "react";
import { MPEvent, MPEventCount, MPLocation } from "@/lib/types";
import axios from "axios";

export const getEventCounts = cache(async (datesArr: string[]): Promise<MPEventCount[]> => {
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/count`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY ?? ""
        },
        body: JSON.stringify({ dateList: datesArr.join(',') })
      }
    )
    return await res.json()
  } catch (error) {
    // console.error(error);
    return [];
  }
});
export const getEvents = cache(async (startDate: string, endDate: string): Promise<MPEvent[]> => {
  try {
    return axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY
      },
      params: { startDate: startDate, endDate: endDate }
    }).then(response => response.data)
  } catch (error) {
    // console.error(error);
    return [];
  }
});
export const getLocations = cache(async (): Promise<MPLocation[]> => {
  try {
    return axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/locations`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY
      }
    }).then(response => response.data);
  } catch (error) {
    // console.error(error);
    return [];
  }
});

export const getFormattedDate = async (date: Date): Promise<string> => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const getOrdinalSuffix = async (value: number | string): Promise<string> => {
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



export const getCalendarDates = async (year: number, month: number): Promise<string[]> => {
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