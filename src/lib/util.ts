"use client";

import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import Cookies from 'js-cookie';
import { OAuthConfig, User, MPEvent } from "@/lib/types";

import { CreateEventData } from "@/context/CreateEventContext";

export const getISOTime = (timeString: string) => {
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':');

  let hour = parseInt(hours);

  // Convert to 24 hour format
  if (period === 'PM' && hour !== 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  // Pad with leading zeros
  const paddedHour = hour.toString().padStart(2, '0');
  const paddedMinutes = minutes.padStart(2, '0');

  return `${paddedHour}:${paddedMinutes}:00.000Z`;
}

export const createEvent = async (eventData: CreateEventData, user: User, setLoading: (loading: boolean) => void, addToast: ({ title, description, variant, action, actionText }: { title: string, description: string, variant?: string, action?: () => void, actionText?: string }) => void) => {

  const requiredFields = ["Event_Title", "Location_ID", "Event_Date", "Event_Start_Time", "Event_End_Time", "Primary_Contact_ID", "Event_Type_ID", "Estimated_Attendance", "Congregation_ID", "Setup_Time", "Cleanup_Time", "Public", "Event_Description"];
  const missingFields = requiredFields.filter(field => {
    const value = eventData[field as keyof CreateEventData];
    return value === undefined || value === '';
  });
  if (missingFields.length > 0) {
    addToast({
      title: "Missing Required Fields",
      description: `Please fill out the following fields: ${missingFields.join(", ")}.`,
      variant: "destructive"
    });

    return;
  }


  setLoading(true);

  const Events: any[] = []
  if (eventData.Recurring_Pattern.length > 0) {
    const { Event_Start_Time, Event_End_Time } = eventData;
    eventData.Recurring_Pattern.forEach(Event_Date => {
      const startDate = Event_Date?.toISOString().split("T")[0] + "T" + getISOTime(Event_Start_Time!);
      const endDate = Event_Date?.toISOString().split("T")[0] + "T" + getISOTime(Event_End_Time!);

      Events.push({
        Event_Title: eventData.Event_Title!,
        Location_ID: eventData.Location_ID!,
        Program_ID: eventData.Program_ID!,
        Event_Start_Date: startDate,
        Event_End_Date: endDate,
        Primary_Contact_ID: eventData.Primary_Contact_ID!,
        Event_Type_ID: eventData.Event_Type_ID!,
        Estimated_Attendance: eventData.Estimated_Attendance!,
        Congregation_ID: eventData.Congregation_ID!,
        Setup_Time: eventData.Setup_Time!,
        Cleanup_Time: eventData.Cleanup_Time!,
        Public: eventData.Public!,
        Event_Description: eventData.Event_Description!
      })
    })
  } else {
    const { Event_Start_Time, Event_End_Time, Event_Date } = eventData;
    const startDate = Event_Date?.toISOString().split("T")[0] + "T" + getISOTime(Event_Start_Time!);
    const endDate = Event_Date?.toISOString().split("T")[0] + "T" + getISOTime(Event_End_Time!);

    Events.push({
      Event_Title: eventData.Event_Title!,
      Location_ID: eventData.Location_ID!,
      Program_ID: eventData.Program_ID!,
      Event_Start_Date: startDate,
      Event_End_Date: endDate,
      Primary_Contact_ID: eventData.Primary_Contact_ID!,
      Event_Type_ID: eventData.Event_Type_ID!,
      Estimated_Attendance: eventData.Estimated_Attendance!,
      Congregation_ID: eventData.Congregation_ID!,
      Setup_Time: eventData.Setup_Time!,
      Cleanup_Time: eventData.Cleanup_Time!,
      Public: eventData.Public!,
      Event_Description: eventData.Event_Description!
    })
  }

  try {
    // await new Promise(resolve => setTimeout(resolve, 500));
    await axios({
      method: "POST",
      // url: "/api/client/events/create",
      url: "/api/events/create",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        Display_Name: user.display_name,
        User_ID: user.userid,
        Events: JSON.stringify(Events),
        Selected_Rooms: eventData.Selected_Rooms.length > 0 ? eventData.Selected_Rooms.join(",") : null
      }
    })
  
    setLoading(false);
  
    addToast({
      title: "Event Created",
      description: `${Events.length} Event${Events.length > 1 ? "s" : ""} created successfully.`,
      variant: "success",
      action: () => { console.log(Events) },
      actionText: `View Event${Events.length > 1 ? "s" : ""}`
    });
  } catch (error) {
    setLoading(false);
    addToast({
      title: "Error Creating Event",
      description: "Please try again.",
      variant: "destructive"
    });
  }
}

export const getEvent = async (eventId: number): Promise<MPEvent> => {
  try {
    const response = await axios({
      method: "GET",
      url: `/api/client/event/${eventId}`
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to get event");
  }
}

// Basic utility functions
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateUid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const encodeUrlForm = (obj: any): string => Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');

// Date handling
export const correctForTimezone = (date: string | Date): Date => {
  const inputDate = date instanceof Date ? date : new Date(date);
  const result = new Date(inputDate);
  result.setMinutes(result.getMinutes() + result.getTimezoneOffset());
  return result;
}

// Authentication related functions
let currOAuthConfig: OAuthConfig;

export async function getOAuthConfig(): Promise<OAuthConfig> {
  if (!currOAuthConfig) {
    const data = await axios({
      method: 'GET',
      url: process.env.NEXT_PUBLIC_DISCOVER_URL
    })
      .then(response => response.data);
    currOAuthConfig = data;
    return currOAuthConfig;
  }
  return currOAuthConfig;
}

export function deleteAuthData(): void {
  Cookies.remove('id_token', { path: '/' });
  Cookies.remove('access_token', { path: '/' });
  Cookies.remove('refresh_token', { path: '/' });
  Cookies.remove('expires_in', { path: '/' });
  Cookies.remove('session_state', { path: '/' });
}

export const logout = async () => {
  // Revoke token & clear session cookie
  await axios({
    method: "POST",
    url: "/api/client/auth/logout"
  });
  window.location.reload(); // Force a full page reload
};