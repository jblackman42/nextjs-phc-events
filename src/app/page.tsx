"use client";
import { useContext, useState } from "react";
import { WithAuth, Navbar, AccountPopup, Calendar } from "@/components";
import { faCalendar, faGear, faRightToBracket, faSun, faMoon } from '@awesome.me/kit-10a739193a/icons/classic/light';
import { ThemeContext, NavbarItem } from "@/lib/utils";

interface Props {
  isAuthenticated: boolean;
}

const Home: React.FC<Props> = ({ isAuthenticated }) => {
  const [pOpen, setPOpen] = useState<boolean | null>(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navLinks: NavbarItem[] = [
    {
      type: "navLink",
      label: "Calendar",
      icon: faCalendar,
      link: "/",
      action: null,
    },
    {
      type: "spacer",
    },
    {
      type: "navLink",
      label: theme === "dark" ? "Light Mode" : "Dark Mode",
      icon: theme === "dark" ? faSun : faMoon,
      link: null,
      action: toggleTheme,
    },
    {
      type: "navLink",
      label: isAuthenticated ? "Account" : "Login",
      icon: isAuthenticated ? faGear : faRightToBracket,
      link: isAuthenticated ? null : "/login",
      action: isAuthenticated ? () => setPOpen(true) : null,
    },
  ];

  return (
    <main className="bg-background h-[100dvh] max-w-[100vw] flex gap-2 md:gap-4 md:p-4">
      {pOpen !== null && <AccountPopup open={pOpen} setOpen={setPOpen} />}
      <Navbar navLinks={navLinks} />
      <Calendar />
    </main>
  );
};

export default WithAuth<Props>(Home);
