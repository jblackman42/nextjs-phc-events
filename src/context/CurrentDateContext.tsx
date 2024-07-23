"use client";
import React, { createContext, useContext } from 'react';
import { CalendarDate } from '@/lib/types';
const currentDateStorageName = "current_date";

type CurrentDateContextType = {
  currentDate: CalendarDate;
  setCurrentDate: (date: Date | CalendarDate) => void;
};

const defaultDate: CalendarDate = new CalendarDate();

const getCurrentDate = (): CalendarDate => {
  if (typeof window === 'undefined') {
    return defaultDate;
  }

  const storageDate = localStorage.getItem(currentDateStorageName);
  if (storageDate) {
    return new CalendarDate(storageDate);
  } else {
    return defaultDate;
  }
}

const CurrentDateContext = createContext<CurrentDateContextType | undefined>(undefined);

export const CurrentDateProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentDate, setCurrentDate] = React.useState<CalendarDate>(getCurrentDate());

  const updateCurrentDate = (date: Date | CalendarDate) => {
    setCurrentDate(new CalendarDate(date));
  }

  return (
    <CurrentDateContext.Provider value={{ currentDate: currentDate, setCurrentDate: updateCurrentDate }}>
      {children}
    </CurrentDateContext.Provider>
  );
};

export const useCurrentDate = () => {
  const context = useContext(CurrentDateContext);
  if (!context) {
    throw new Error('useCurrentDate must be used within a CurrentDateProvider');
  }
  return context;
};
