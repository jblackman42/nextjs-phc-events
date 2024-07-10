"use client";
import { useState, useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { NextPage } from 'next';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getOAuthConfig, AuthData, saveAuthData, UserContext, User, getUserType } from "@/lib/utils";
import { Router } from 'next/router';

interface WithAuthProps {
  isAuthenticated: boolean;
}

export default function WithAuth<T extends object>(WrappedComponent: ComponentType<T & WithAuthProps> | NextPage<T & WithAuthProps>): NextPage<T & WithAuthProps> {
  const WithAuth: NextPage<T & WithAuthProps> = (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const updateGlobalUser = (userData: User): void => {
      setUser(userData);
    }

    const handleLoggedIn = (userData: any): void => {
      setIsAuthenticated(true);
      const user_type = getUserType(userData.roles);
      setUser({ ...userData, user_type: user_type });
    }

    const handleLoggedOut = (): void => {
      console.log("user not logged in");
      setIsAuthenticated(false);
      setUser(null);
      // router.push('/login');
    }

    useEffect(() => {
      const authenticate = async () => {
        const { userinfo_endpoint } = await getOAuthConfig();
        let access_token = Cookies.get('access_token');
        const expires_in = Cookies.get('expires_in');
        const refresh_token = Cookies.get('refresh_token');

        if (!access_token || !expires_in) {
          handleLoggedOut();
          return;
        }

        try {
          const expires_in_value = new Date(expires_in);
          if (new Date() > expires_in_value && refresh_token) {
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
      };

      if (typeof window !== "undefined") {
        authenticate();
      }
    }, []);

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