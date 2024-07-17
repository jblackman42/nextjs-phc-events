"use client";
import { useState } from 'react';
import { Navbar, SettingsPopup, AccountPopup } from '@/components';
import { NavLink } from "@/lib/types";
import { faCalendar, faGear, faRightToBracket, faBrightness, faMoon, faUser } from '@awesome.me/kit-10a739193a/icons/classic/light';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';

const PageDefaults = () => {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const isAuthenticated = user !== null;
  const [sOpen, setSOpen] = useState<boolean | undefined>();
  const [aOpen, setAOpen] = useState<boolean | undefined>();

  const navLinks: NavLink[] = [
    {
      variant: "link",
      label: "Calendar",
      icon: faCalendar,
      link: "/",
      action: null
    },
    {
      variant: "spacer",
      label: null,
      icon: null,
      link: null,
      action: null
    },
    {
      variant: "link",
      label: theme === "dark" ? "Light Mode" : "Dark Mode",
      icon: theme === "dark" ? faBrightness : faMoon,
      link: null,
      action: toggleTheme,
    },
    {
      variant: "link",
      label: "Settings",
      icon: faGear,
      link: null,
      action: () => setSOpen(true)
    },
    {
      variant: "link",
      label: isAuthenticated ? "Account" : "Login",
      icon: isAuthenticated ? faUser : faRightToBracket,
      link: isAuthenticated ? null : "/login",
      action: isAuthenticated ? () => setAOpen(true) : null,
    }
  ];

  return (
    <>
      <SettingsPopup open={sOpen} setOpen={setSOpen} />
      <AccountPopup open={aOpen} setOpen={setAOpen} />
      <Navbar navLinks={navLinks} />
    </>
  );
};

export default PageDefaults;
