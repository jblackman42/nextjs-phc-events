import { Quicksand } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { cookies } from 'next/headers';
import axios from 'axios';
import { UserProvider } from '@/context/UserContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { ViewProvider } from '@/context/ViewContext';
import { CurrentDateProvider } from '@/context/CurrentDateContext';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import Font Awesome CSS
import { ToastClientComponent } from '@/components';

config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

const font = Quicksand({ weight: ['500'], subsets: ['latin'] });

const setInitialTheme = `
  (function() {
    const storageTheme = localStorage.getItem('preferred-color-scheme');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersLightScheme = window.matchMedia('(prefers-color-scheme: light)').matches;
    const defaultTheme = "dark";
    
    let theme = defaultTheme;
    
    if (storageTheme) {
      theme = storageTheme;
    } else if (prefersDarkScheme) {
      theme = "dark";
    } else if (prefersLightScheme) {
      theme = "light";
    }

    document.documentElement.classList.add(theme);
  })();
`;

const getUserData = async (session: string) => {
  return axios({
    method: "POST",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/client/auth/user`,
    data: { session },
    headers: {
      "Content-Type": "application/json"
    }
  }).then(response => response.data);
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  let user = null;
  let errorMessage = '';

  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    user = sessionCookie ? await getUserData(sessionCookie) : null;
  } catch (error) {
    // console.log('Failed to find user:', error);
    errorMessage = "Failed to find user object.";
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
      </head>
      <body className={font.className}>
        <ThemeProvider>
          <UserProvider user={user}>
            <SettingsProvider>
              <ViewProvider>
                <CurrentDateProvider>
                  <ToastProvider>
                    <Toaster />
                    {children}
                    {errorMessage && <ToastClientComponent key={errorMessage} message={errorMessage} variant="destructive" />}
                  </ToastProvider>
                </CurrentDateProvider>
              </ViewProvider>
            </SettingsProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
