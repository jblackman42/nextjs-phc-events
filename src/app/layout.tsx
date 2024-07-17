import { Quicksand } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { cookies } from 'next/headers';
import axios from 'axios';
import { UserProvider } from '@/context/UserContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css'; // Import Font Awesome CSS

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
  try {
    return axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/client/auth/user`,
      data: { session },
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => response.data);
  } catch (error) {
    return null;
  }
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  const user = sessionCookie ? await getUserData(sessionCookie) : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
      </head>
      <body className={font.className}>
        <ThemeProvider>
          <UserProvider user={user}>
            <SettingsProvider>
              <Toaster />
              {children}
            </SettingsProvider>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}