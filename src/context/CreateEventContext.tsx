"use client";
import React, { createContext, useContext, useEffect } from 'react';

export interface CreateEventData {
  Event_Title?: string;
  Location_ID?: number;
  Event_Date?: Date;
  Event_Start_Time?: string;
  Event_End_Time?: string;
  Primary_Contact?: number;
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

  Selected_Rooms: number[];
}

export interface CreateEventContextType {
  eventData: CreateEventData | undefined;
  updateEventData: (eventData: Partial<CreateEventData>) => void;
};

const defaultEventData: CreateEventData = {
  Registration_Cost: 0,
  Selected_Rooms: [],
  Registration: false,
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