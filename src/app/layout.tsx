"use client";
import { useEffect, useState, useCallback } from 'react';
import { Quicksand } from 'next/font/google';
import './globals.css';

import { ThemeContext } from '@/lib/utils';

const quicksand = Quicksand({ weight: ['500'], subsets: ['latin'] });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const [theme, setTheme] = useState<string>('light'); // This will now be set correctly at start

  useEffect(() => {
    const preferredTheme = localStorage.getItem('preferred-color-scheme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme !== preferredTheme) {
      setTheme(preferredTheme);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('preferred-color-scheme', newTheme);
      document.documentElement.className = newTheme;
      return newTheme;
    });
  }, []);

  return (
    <>
      <head>
        <script id="theme-script" dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('preferred-color-scheme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.className = theme;
            })();
          `
        }} />
      </head>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <html lang="en" suppressHydrationWarning>
          <body className={quicksand.className}>{children}</body>
        </html>
      </ThemeContext.Provider>
    </>
  );
}