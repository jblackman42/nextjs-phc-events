"use client";
import React, { createContext, useContext } from 'react';
const calendarViewStorageName = "active_calendar_view";

export type View = 'month' | 'week' | 'day';

type ViewContextType = {
  view: View;
  setView: (view: View) => void;
};

const defaultView: View = "month"

const getActiveView = (): View => {
  if (typeof window === 'undefined') {
    return defaultView;
  }

  const storageView = localStorage.getItem(calendarViewStorageName);
  switch (storageView) {
    case 'month':
      return 'month';
    case 'week':
      return 'week';
    case 'day':
      return 'day';
    default:
      return defaultView;
  }
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export const ViewProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentView, setCurrentView] = React.useState<View>(getActiveView());

  return (
    <ViewContext.Provider value={{ view: currentView, setView: setCurrentView }}>
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
