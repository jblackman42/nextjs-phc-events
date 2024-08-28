'use server';
import { cache } from "react";
import { MPEvent, MPEventCount, MPLocation } from "@/lib/types";
import axios from "axios";

export const getEventCounts = cache(async (datesArr: string[], locationID?: number, buildingID?: number, roomID?: number): Promise<MPEventCount[]> => {
  // await new Promise((resolve) => setTimeout(resolve, 20000));
  const Location_ID = locationID && locationID !== 0 ? locationID : null;
  const Building_ID = buildingID && buildingID !== 0 ? buildingID : null;
  const Room_ID = roomID && roomID !== 0 ? roomID : null;
  let result: MPEventCount[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/count`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY ?? ""
        },
        body: JSON.stringify({
          dateList: datesArr.join(','),
          Location_ID: Location_ID,
          Building_ID: Building_ID,
          Room_ID: Room_ID
        })
      }
    );

    if (!res.ok) {
      throw new Error("Internal server error");
    }
    // return await res.json()
    result = await res.json();
  } catch (error) {
    console.error(error);
  }
  return result;
});



export const getEventByID = cache(async (id: string | null): Promise<MPEvent | undefined> => {
  try {
    return axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${id}`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY
      }
    }).then(response => response.data)
  } catch (error) {
    // console.error(error);
    return undefined;
  }
});



export const getEvents = cache(async (startDate: string, endDate: string, locationID?: number, buildingID?: number, roomID?: number): Promise<MPEvent[]> => {
  const Location_ID = locationID && locationID !== 0 ? locationID : null;
  const Building_ID = buildingID && buildingID !== 0 ? buildingID : null;
  const Room_ID = roomID && roomID !== 0 ? roomID : null;
  let result: MPEvent[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY ?? ""
        },
        body: JSON.stringify({
          startDate: startDate,
          endDate: endDate,
          Location_ID: Location_ID,
          Building_ID: Building_ID,
          Room_ID: Room_ID
        })
      });

    if (!res.ok) {
      throw new Error("Internal server error");
    }

    result = await res.json();
  } catch (error) {
    console.error(error);
  }
  return result;
});
export const getLocations = cache(async (): Promise<MPLocation[]> => {
  let result: MPLocation[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/locations`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.API_KEY ?? ""
        }
      }
    );
    result = await res.json();
  } catch (error) {
    // console.error(error);
  }
  return result;
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