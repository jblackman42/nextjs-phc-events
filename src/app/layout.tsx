"use client"
import { useEffect, useState, useCallback } from 'react'
import { Quicksand } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { Loading } from '@/components'
import './globals.css'

import { ThemeContext, LoadingContext, CalendarSettings, SettingsContext, createSetting } from '@/lib/utils'

const font = Quicksand({ weight: ['500'], subsets: ['latin'] });




export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const defaultSettings: CalendarSettings = {
    showCancelledEvents: createSetting(false, "Show Cancelled Events"),
    showRetiredLocations: createSetting(false, "Show Retired Locations")
  }
  const defaultTheme = "dark";

  const [theme, setTheme] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [settings, setSettings] = useState<CalendarSettings>(defaultSettings);

  const updateLoading = (value: boolean) => setLoading(value);

  const updateSettings = (value: CalendarSettings) => {
    setSettings(value);
    Object.values(value).forEach(setting => {
      const localStorageName = setting.name.toLowerCase().split(" ").join("-");
      localStorage.setItem(localStorageName, setting.value.toString());
    });
  };

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('preferred-color-scheme', newTheme);
      return newTheme
    })
  }, []);

  useEffect(() => {
    Object.values(settings).forEach(setting => {
      const localStorageName = setting.name.toLowerCase().split(" ").join("-");
      const preferredValue = localStorage.getItem(localStorageName) ?? setting.value;
      setting.value = JSON.parse(preferredValue.toString());
    });

    const preferredTheme = localStorage.getItem('preferred-color-scheme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    setTheme(preferredTheme ?? defaultTheme);
    setLoading(false);
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <LoadingContext.Provider value={{ loading, updateLoading }}>
        <SettingsContext.Provider value={{ settings, updateSettings }}>
          <html lang="en" className={theme ?? ''}>
            <body className={font.className}>
              <Toaster />
              {loading && <Loading />}
              {theme && children}
            </body>
          </html>
        </SettingsContext.Provider>
      </LoadingContext.Provider>
    </ThemeContext.Provider>
  )
}