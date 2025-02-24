"use client";
import React, { createContext, useContext, useEffect } from 'react';

export type Weekday = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Weekday" | "Weekend Day" | "Day";
export type DayPosition = "First" | "Second" | "Third" | "Fourth" | "Last";

export interface CreateEventData {
  Created_By_User?: string;
  Event_Title?: string;
  Location_ID?: number;
  Program_ID?: number;
  Event_Date?: Date;
  Event_Start_Time?: string;
  Event_End_Time?: string;
  Primary_Contact_ID?: number;
  Event_Type_ID?: number;
  Estimated_Attendance?: number;
  Congregation_ID?: number;
  Setup_Time?: number;
  Cleanup_Time?: number;
  Public?: boolean;
  Event_Description?: string;

  Registration_Cost?: number;
  Registration_Open_Date?: Date;
  Registration_Close_Date?: Date;
  Has_Auto_Response?: boolean;
  Auto_Response?: string;
  Registration: boolean;


  Recurring_Type?: "daily" | "weekly" | "monthly";

  Recurring_Daily_Pattern?: "days" | "weekdays";
  Recurring_Daily_Day_Interval?: number;

  Recurring_Weekly_Week_Interval?: number;
  Recurring_Weekly_Days: Weekday[];

  Recurring_Monthly_Pattern?: "date-of-month" | "weekday-of-month";
  Recurring_Monthly_Date?: number;
  Recurring_Monthly_Month_Date_Interval?: number;

  Recurring_Monthly_Day_Position?: DayPosition;
  Recurring_Monthly_Weekday?: Weekday;
  Recurring_Monthly_Weekday_Interval?: number;

  Recurring_End_By: "by-date" | "occurence";
  Recurring_End_By_Date?: Date;

  Recurring_End_Occurence_Count?: number;

  Recurring_Pattern: Date[];

  Selected_Rooms: number[];
}

export interface CreateEventContextType {
  eventData: CreateEventData | undefined;
  updateEventData: (eventData: Partial<CreateEventData>) => void;
};

export const defaultEventData: CreateEventData = {
  Event_Title: "PHC EVENTS - Test Event",
  Location_ID: 1,
  Event_Date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
  Event_Start_Time: "1:00 AM",
  Event_End_Time: "2:00 AM",
  Primary_Contact_ID: 1296,
  Event_Type_ID: 1,
  Congregation_ID: 1,
  Event_Description: "Test Description",

  // Event_Title: undefined,
  // Location_ID: undefined,
  Program_ID: 1,
  // Event_Date: undefined,
  // Event_Start_Time: undefined,
  // Event_End_Time: undefined,
  // Primary_Contact_ID: undefined,
  // Event_Type_ID: undefined,
  Estimated_Attendance: 0,
  // Congregation_ID: undefined,
  Setup_Time: 0,
  Cleanup_Time: 0,
  Public: false,
  // Event_Description: undefined,

  Registration_Cost: 0,
  Registration_Open_Date: undefined,
  Registration_Close_Date: undefined,
  Has_Auto_Response: undefined,
  Auto_Response: undefined,
  Registration: false,

  Recurring_Type: undefined,

  Recurring_Daily_Pattern: "days",
  Recurring_Daily_Day_Interval: undefined,

  Recurring_Weekly_Week_Interval: undefined,
  Recurring_Weekly_Days: [],

  Recurring_Monthly_Pattern: "date-of-month",
  Recurring_Monthly_Date: undefined,

  Recurring_Monthly_Day_Position: "First",
  Recurring_Monthly_Weekday: "Sunday",
  Recurring_Monthly_Weekday_Interval: undefined,

  Recurring_End_By: "by-date",
  Recurring_End_By_Date: undefined,

  Recurring_End_Occurence_Count: undefined,

  Recurring_Pattern: [],

  Selected_Rooms: [],
}

const CreateEventContext = createContext<CreateEventContextType | undefined>(undefined);


export const CreateEventProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentEventData, setCurrentEventData] = React.useState<CreateEventData>(defaultEventData);

  useEffect(() => {
    // Set Registration to true if any registration-related fields are filled out
    const hasRegistrationData = !!(
      currentEventData.Registration_Cost ||
      currentEventData.Registration_Open_Date ||
      currentEventData.Registration_Close_Date ||
      currentEventData.Has_Auto_Response ||
      currentEventData.Auto_Response
    );

    if (hasRegistrationData !== currentEventData.Registration) {
      setCurrentEventData(prev => ({
        ...prev,
        Registration: hasRegistrationData
      }));
    }
  }, [currentEventData]);


  const updateEventData = (value: Partial<CreateEventData>) => {
    setCurrentEventData(prevData => ({
      ...prevData,
      ...value
    }));
  };

  return (
    <CreateEventContext.Provider value={{ eventData: currentEventData, updateEventData: updateEventData }}>
      {children}
    </CreateEventContext.Provider>
  );

};

export const useCreateEventData = () => {
  const context = useContext(CreateEventContext);
  if (!context) {
    throw new Error('useCreateEventData must be used within a CreateEventProvider');
  }
  return context;
};