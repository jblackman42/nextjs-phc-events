"use client";
import React, { createContext, useContext, useEffect } from 'react';

export interface Setting {
  value: boolean;
  label: string;
}

export interface CalendarSettings {
  showCancelledEvents: Setting;
  showRetiredLocations: Setting;
}

export interface SettingsContextType {
  settings: CalendarSettings;
  updateSettings: (settings: CalendarSettings) => void;
};

const defaultSettings: CalendarSettings = {
  showCancelledEvents: {
    value: false,
    label: "Show Cancelled Events"
  },
  showRetiredLocations: {
    value: false,
    label: "Show Retired Locations"
  }
};

const getExistingSettings = (): CalendarSettings => {
  const storedSettings = { ...defaultSettings };
  Object.values(storedSettings).forEach(setting => {
    const localStorageName = setting.label.toLowerCase().split(" ").join("-");
    const storageSetting = typeof window !== "undefined" ? localStorage.getItem(localStorageName) : null;
    if (storageSetting) setting.value = storageSetting === "true";
  });
  return storedSettings;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSettings, setCurrentSettings] = React.useState<CalendarSettings>(defaultSettings);

  useEffect(() => {
    const existingSettings = getExistingSettings();
    setCurrentSettings(existingSettings);
  }, []);

  const updateSettings = (value: CalendarSettings) => {
    setCurrentSettings(value);
    Object.values(value).forEach(setting => {
      const localStorageName = setting.label.toLowerCase().split(" ").join("-");
      localStorage.setItem(localStorageName, setting.value.toString());
    });
  };

  return (
    <SettingsContext.Provider value={{
      settings: currentSettings,
      updateSettings: updateSettings}}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};