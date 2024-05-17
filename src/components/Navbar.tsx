"use client";
import { useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faRightToBracket, faSun, faMoon } from '@awesome.me/kit-10a739193a/icons/classic/light';

import { ThemeContext, LinkOrButtonProps, NavLink, NavbarItem } from "@/lib/utils";






const LinkOrButton: React.FC<LinkOrButtonProps> = ({ navLink }) => {
  const { label, icon, link, action } = navLink;
  const elementClasses = "bg-transparent text-background-foreground hover:bg-accent hover:text-secondary focus-visible:bg-accent focus-visible:text-secondary transition-colors rounded-sm aspect-square w-[1.5em] text-xl md:text-3xl grid place-items-center cursor-pointer nav-label";

  if (link) {
    return (
      <a href={link} className={elementClasses} data-label={label}>
        <FontAwesomeIcon icon={icon} />
      </a>
    );
  } else if (action) {
    return (
      <button onClick={action} className={elementClasses} data-label={label}>
        <FontAwesomeIcon icon={icon} />
      </button>
    );
  }
  return null;
};

const Navbar: React.FC<{ navLinks: NavbarItem[] }> = ({ navLinks }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const loggedOut: NavLink = {
    type: 'navLink',
    label: "Login",
    icon: faRightToBracket,
    link: "/login",
    action: null
  };
  const loggedIn: NavLink = {
    type: 'navLink',
    label: "Account",
    icon: faGear,
    link: "/logout",
    action: null
  };
  const toggleThemeLink: NavLink = {
    type: 'navLink',
    label: theme === "dark" ? "Light Mode" : "Dark Mode",
    icon: theme === "dark" ? faSun : faMoon,
    link: null,
    action: toggleTheme
  };
  return (
    <nav className="bg-primary p-2 md:p-4 md:rounded-sm shadow-sm">
      <ul className="flex flex-col gap-2 md:gap-4 h-full">
        {navLinks.map((navLink, i) => (
          navLink.type === 'spacer'
            ? <li key={i} className="h-full"></li>
            : <li key={i}><LinkOrButton navLink={navLink} /></li>
        ))}
        {/* <li><LinkOrButton navLink={toggleThemeLink} /></li> */}
      </ul>
    </nav>
  );
};

export default Navbar;
