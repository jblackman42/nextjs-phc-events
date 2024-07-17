"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@awesome.me/kit-10a739193a/icons/classic/light';

import { NavLink } from "@/lib/types";

const LinkOrButton = ({ navLink }: { navLink: NavLink }) => {
  const { label, icon, link, action } = navLink;
  const elementClasses = "bg-transparent text-background-foreground hover:bg-accent hover:text-white focus-visible:bg-accent focus-visible:text-secondary transition-colors rounded-sm aspect-square w-[1.5em] text-xl md:text-3xl grid place-items-center cursor-pointer nav-label";

  if (link) {
    return (
      <a href={link} className={elementClasses} data-label={label}>
        <FontAwesomeIcon icon={icon ?? faBan} />
      </a>
    );
  } else if (action) {
    return (
      <button onClick={action} className={elementClasses} data-label={label}>
        <FontAwesomeIcon icon={icon ?? faBan} />
      </button>
    );
  }
  return null;
};

const Navbar = ({ navLinks }: { navLinks: NavLink[] }) => {
  return (
    <nav className="bg-primary p-2 md:p-4 md:rounded-sm shadow-sm">
      <ul className="flex flex-col gap-2 md:gap-4 h-full">
        {navLinks.map((navLink, i) => (
          navLink.variant === 'spacer'
            ? <li key={i} className="h-full"></li>
            : <li key={i}><LinkOrButton navLink={navLink} /></li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
