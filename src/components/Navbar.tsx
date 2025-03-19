"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@awesome.me/kit-10a739193a/icons/classic/light';

import { PROTECTED_ROUTES } from "@/lib/constants";
import { NavLink, User, userRole, userGroup } from "@/lib/types";
import { toast } from "@/components/ui/use-toast";

const LinkOrButton = ({ navLink }: { navLink: NavLink }) => {
  const { label, icon, link, action } = navLink;

  const elementClasses = "bg-transparent text-background-foreground hover:bg-accent hover:text-white focus-visible:bg-accent focus-visible:text-secondary transition-colors rounded-sm aspect-square w-[1.5em] text-xl md:text-3xl grid place-items-center cursor-pointer nav-label";

  if (link) {
    return (
      <a href={link} className={elementClasses} data-label={label}>
        <FontAwesomeIcon icon={icon ?? faBan} />
      </a>
    );
  }
  if (typeof action === 'function') {
    return (
      <button onClick={action} className={elementClasses} data-label={label}>
        <FontAwesomeIcon icon={icon ?? faBan} />
      </button>
    );
  }
  return null;
};

const Navbar = ({ navLinks, user }: { navLinks: NavLink[], user: User }) => {

  const [userRoles, setUserRoles] = useState<userRole[]>([]);
  const [userGroups, setUserGroups] = useState<userGroup[]>([]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user || !user.sub) return;
      await axios.post('/api/client/auth/user-roles', { sub: user.sub })
        .then(response => {
          const { Roles, User_Groups } = response.data;
          setUserRoles(Roles);
          setUserGroups(User_Groups);
        })
        .catch(() => {
          toast({
            title: "Something went wrong",
            description: 'Error retrieving user roles',
            variant: 'error'
          });
        });
    };
    fetchUserRoles();
  }, [user]);

  return (
    <nav className="bg-primary border p-2 md:p-4 shadow-sm">
      <ul className="flex flex-col gap-2 md:gap-4 h-full">
        {navLinks.filter((navLink) => {
          const route = PROTECTED_ROUTES.find((route) => route.path === navLink.link);
          if (navLink.variant === 'spacer') return true;
          if (route) {
            const userHasRole = route.requiredRoleID.some((role) => userRoles.some((userRole) => userRole.Role_ID === role));
            const userHasGroup = route.requiredGroupID.some((group) => userGroups.some((userGroup) => userGroup.User_Group_ID === group));
            return userHasRole || userHasGroup;
          }
          return true;
        }).map((navLink, i) => (
          navLink.variant === 'spacer'
            ? <li key={i} className="h-full"></li>
            : <li key={i}><LinkOrButton navLink={navLink} /></li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
