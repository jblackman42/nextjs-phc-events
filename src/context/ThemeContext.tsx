"use client";
import React, { useCallback, createContext, useContext, useEffect } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const defaultTheme: Theme = "dark";

const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return defaultTheme;
  }

  const storageTheme = localStorage.getItem('preferred-color-scheme');
  if (storageTheme === "light") {
    return "light";
  } else if (storageTheme === "dark") {
    return "dark";
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return "dark";
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return "light";
  } else {
    return defaultTheme;
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = React.useState<Theme>(getPreferredTheme());

  useEffect(() => {
    document.documentElement.classList.add(currentTheme);
  }, [currentTheme]);

  const toggleTheme = useCallback(() => {
    setCurrentTheme((prevTheme: Theme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      document.documentElement.classList.remove(prevTheme);
      document.documentElement.classList.add(newTheme);
      localStorage.setItem('preferred-color-scheme', newTheme);
      return newTheme;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};