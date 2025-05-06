"use client";
import { useState } from 'react';
import { Navbar } from '@/components';
import { SettingsPopup, AccountPopup } from '@/components/popups';
import { NavLink } from "@/lib/types";
import { faCalendar, faGear, faRightToBracket, faBrightness, faMoon, faUser, faFileExcel, faSquarePlus } from '@awesome.me/kit-10a739193a/icons/classic/light';
import { faPray, faHandsPraying } from '@awesome.me/kit-10a739193a/icons/classic/solid';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';

const PageDefaults = () => {
  const { user, isAuthenticated } = useUser();
  const { theme, toggleTheme } = useTheme();
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
      variant: "link",
      label: "Create",
      icon: faSquarePlus,
      link: "/create",
      action: null
    },
    {
      variant: "link",
      label: "Health Assessment",
      icon: faFileExcel,
      link: "/ha",
      action: null
    },
    {
      variant: "link",
      label: "Prayer Wall",
      icon: faPray,
      link: "/prayerwall",
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
      // label: theme === "dark" ? "Light Mode" : "Dark Mode",
      // icon: theme === "dark" ? faBrightness : faMoon,
      label: "dark",
      icon: faBrightness,
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
      // icon: faRightToBracket,
      icon: isAuthenticated ? faUser : faRightToBracket,
      link: isAuthenticated ? null : "/login",
      action: isAuthenticated ? () => setAOpen(true) : null,
    }
  ];

  return (
    <>
      <SettingsPopup open={sOpen} setOpen={setSOpen} />
      <AccountPopup open={aOpen} setOpen={setAOpen} />
      <Navbar navLinks={navLinks} user={user} />
    </>
  );
};

export default PageDefaults;
