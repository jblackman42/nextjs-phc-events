"use client";
import { useContext, useState } from "react";
import { Login, WithAuth, Navbar, AccountPopup } from "@/components";
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCalendar, faGear, faRightToBracket, faSun, faMoon } from '@awesome.me/kit-10a739193a/icons/classic/light';
import { User, ThemeContext, NavbarItem } from "@/lib/utils";

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
      action: null
    },
    {
      type: "spacer"
    },
    {
      type: 'navLink',
      label: theme === "dark" ? "Light Mode" : "Dark Mode",
      icon: theme === "dark" ? faSun : faMoon,
      link: null,
      action: toggleTheme
    },
    {
      type: "navLink",
      label: isAuthenticated ? "Account" : "Login",
      icon: isAuthenticated ? faGear : faRightToBracket,
      link: isAuthenticated ? null : "/login",
      action: isAuthenticated ? () => setPOpen(true) : null
    }
  ];

  return (
    <main className="bg-background flex min-h-screen gap-2 md:gap-4 md:p-4">
      <AccountPopup open={pOpen} setOpen={() => setPOpen(false)} />
      <Navbar navLinks={navLinks} />
      <article className="flex flex-col gap-2 md:gap-4 w-full">
        <div className="w-full bg-primary p-4 flex items-center md:rounded-sm shadow-sm h-12">
          <h1 className="h-max">test</h1>
        </div>
        <div className="w-full h-full bg-primary md:rounded-sm shadow-sm p-4"></div>
      </article>
    </main>
  );
};

export default WithAuth<Props>(Home);
