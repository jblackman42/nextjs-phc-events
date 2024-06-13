"use client"
import { useEffect, useState, useCallback } from 'react'
import { Quicksand } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"
import { Loading } from '@/components'
import './globals.css'

import { ThemeContext, LoadingContext } from '@/lib/utils'

const quicksand = Quicksand({ weight: ['500'], subsets: ['latin'] })

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [theme, setTheme] = useState<string>('light') // This will now be set correctly at start
  const [loading, setLoading] = useState<boolean>(false)

  const updateLoading = (value: boolean) => setLoading(value)

  useEffect(() => {
    const preferredTheme = localStorage.getItem('preferred-color-scheme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    if (theme !== preferredTheme) {
      setTheme(preferredTheme)
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light'
      localStorage.setItem('preferred-color-scheme', newTheme)
      document.documentElement.className = newTheme
      return newTheme
    })
  }, [])

  return (
    <>
      <head>
        <script id="theme-script" dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('preferred-color-scheme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
              document.documentElement.className = theme
            })()
          `
        }} />
      </head>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <LoadingContext.Provider value={{ loading, updateLoading }}>
          <html lang="en" suppressHydrationWarning>
            <body>
              <Toaster />
              {loading && <Loading />}
              {children}
            </body>
          </html>
        </LoadingContext.Provider>
      </ThemeContext.Provider>
    </>
  )
}