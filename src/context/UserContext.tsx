"use client";
import { User } from '@/lib/types';
import React, { createContext, useContext } from 'react';

type UserContextType = {
  user: User;
  setUser: (user: any) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children, user }: { children: React.ReactNode, user: any }) => {
  const [currentUser, setCurrentUser] = React.useState(user);

  return (
    <UserContext.Provider value={{ user: currentUser, setUser: setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
