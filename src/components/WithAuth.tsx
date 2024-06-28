"use client";
import { useState, useEffect, useRef, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { NextPage } from 'next';
import axios from 'axios';

import { getOAuthConfig, AuthData, evictUnauthorized, saveAuthData, UserContext, User, getUserType } from "@/lib/utils";

// Define the extended props type
interface WithAuthProps {
  isAuthenticated: boolean;
}

export default function WithAuth<T extends object>(WrappedComponent: ComponentType<T & WithAuthProps> | NextPage<T & WithAuthProps>): NextPage<T & WithAuthProps> {
  const WithAuth: NextPage<T & WithAuthProps> = (props) => {
    const router = useRouter();
    const initialized = useRef(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

    const updateGlobalUser = (userData: User): void => {
      setUser(userData);
    }

    const handleLoggedIn = (userData: any): void => {
      setIsAuthenticated(true);
      const user_type = getUserType(userData.roles);
      setUser({ ...userData, user_type: user_type });
    }

    const handleLoggedOut = (): void => {
      setIsAuthenticated(false);
      setUser(null);
    }

    useEffect(() => {
      if (initialized.current) return;
      (async () => {
        initialized.current = true;
        const { userinfo_endpoint } = await getOAuthConfig();
        let access_token = window.localStorage.getItem('access_token');
        const expires_in = window.localStorage.getItem('expires_in');
        const refresh_token = window.localStorage.getItem('refresh_token');
        if (!access_token || !expires_in) {
          handleLoggedOut();
          return;
        }

        try {
          if (new Date() > new Date(expires_in) && refresh_token) {
            const auth: AuthData = await axios({
              method: 'POST',
              url: '/api/token',
              data: {
                grant_type: 'refresh_token',
                refresh_token: refresh_token
              }
            }).then(response => response.data);

            saveAuthData(auth);
            access_token = auth.token_type + ' ' + auth.access_token;
          }

          const userInfo = await axios({
            method: "GET",
            url: userinfo_endpoint,
            headers: {
              Authorization: access_token
            }
          }).then(response => response.data);

          handleLoggedIn(userInfo);
        } catch (error) {
          handleLoggedOut();
        }
      })();
    }, [router]);

    return (
      <UserContext.Provider value={{ user, updateGlobalUser }}>
        <WrappedComponent {...props} isAuthenticated={isAuthenticated} />
      </UserContext.Provider>
    );
  };

  if ('getInitialProps' in WrappedComponent) {
    WithAuth.getInitialProps = WrappedComponent.getInitialProps;
  }

  return WithAuth;
}