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
  week_dates: string[];
};

type ViewContextType = {
  view: View;
  setView: (field: string, value: any) => void;
  nextPeriod: () => void;
  prevPeriod: () => void;
};

const getWeekDates = (selected_date: CalendarDate): string[] => {
  const week_dates = [];
  // Get the day of week (0 = Sunday, 6 = Saturday)
  const dayOfWeek = selected_date.getUTCDay();
  // Calculate the date of Sunday (start of week)
  const startDate = new CalendarDate(
    selected_date.getUTCFullYear(),
    selected_date.getUTCMonth(),
    selected_date.getUTCDate() - dayOfWeek
  );

  // Generate array of dates from Sunday to Saturday
  for (let i = 0; i < 7; i++) {
    week_dates.push(new CalendarDate(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      startDate.getUTCDate() + i
    ).toISOString());
  }
  return week_dates;
}

const today = new Date();
const selected_date = new CalendarDate(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

const defaultView: View = {
  periodical: "month",
  location_id: 0,
  building_id: 0,
  room_id: 0,
  selected_date: selected_date,
  current_date: new CalendarDate(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1)),
  week_dates: getWeekDates(selected_date)
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
      setCurrentView({
        ...currentView,
        current_date: newDate
      });
    }
    if (currentView.periodical === "week") {
      const dateInNextWeek = new CalendarDate(currentView.current_date.getUTCFullYear(), currentView.current_date.getUTCMonth(), currentView.current_date.getUTCDate() + 7);
      const nextWeekDates = getWeekDates(dateInNextWeek);
      setCurrentView({
        ...currentView,
        week_dates: nextWeekDates,
        current_date: new CalendarDate(nextWeekDates[0])
      });
    }
  }

  const prevPeriod = (): void => {
    if (currentView.periodical === "month") {
      const currDate = currentView.current_date;
      const newDate = new CalendarDate(currDate.getUTCFullYear(), currDate.getUTCMonth() - 1, 1);
      setCurrentView({
        ...currentView,
        current_date: newDate
      });
    }
    if (currentView.periodical === "week") {
      const dateInPrevWeek = new CalendarDate(currentView.current_date.getUTCFullYear(), currentView.current_date.getUTCMonth(), currentView.current_date.getUTCDate() - 7);
      const prevWeekDates = getWeekDates(dateInPrevWeek);
      setCurrentView({
        ...currentView,
        week_dates: prevWeekDates,
        current_date: new CalendarDate(prevWeekDates[0])
      });
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
