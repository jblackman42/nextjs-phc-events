"use client";
import React, { createContext, useContext } from 'react';
import { CalendarDate } from '@/lib/types';
const calendarViewStorageName = "active_calendar_view";

export type View = {
  periodical: 'month' | 'week' | 'day';
  location_id: number;
  building_id: number;
  room_id: number;
  selected_date: CalendarDate;
  current_date: CalendarDate;
};

type ViewContextType = {
  view: View;
  setView: (field: string, value: any) => void;
  nextPeriod: () => void;
  prevPeriod: () => void;
};

const today = new Date();

const defaultView: View = {
  periodical: "month",
  location_id: 0,
  building_id: 0,
  room_id: 0,
  selected_date: new CalendarDate(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())),
  current_date: new CalendarDate(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1))
}

const getActiveView = (): View => {
  return defaultView;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentView, setCurrentView] = React.useState<View>(getActiveView());

  const setView = (field: string, value: any) => {
    const newView = {
      ...currentView,
      [field]: value
    }
    setCurrentView(newView);
  }

  const nextPeriod = (): void => {
    if (currentView.periodical === "month") {
      const currDate = currentView.current_date;
      const newDate = new CalendarDate(currDate.getUTCFullYear(), currDate.getUTCMonth() + 1, 1);
      setView('current_date', newDate);
    }
  }
  const prevPeriod = (): void => {
    if (currentView.periodical === "month") {
      const currDate = currentView.current_date;
      const newDate = new CalendarDate(currDate.getUTCFullYear(), currDate.getUTCMonth() - 1, 1);
      setView('current_date', newDate);
    }
  }


  return (
    <ViewContext.Provider value={{ view: currentView, setView: setView, nextPeriod: nextPeriod, prevPeriod: prevPeriod }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
};
