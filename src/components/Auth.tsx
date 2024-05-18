"use client";
import { useRouter } from 'next/navigation';
import { getOAuthConfig, evictUnauthorized } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import axios from 'axios';

const pathsToIgnore = ['/', '/callback'];

export default function Auth({ children }: Readonly<{ children: React.ReactNode; }>) {
  const router = useRouter();
  const initialized = useRef(false);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (initialized.current) return;
    (async () => {
      initialized.current = true;
      const { userinfo_endpoint } = await getOAuthConfig();
      const access_token = window.localStorage.getItem('access_token');
      if (!access_token) {
        evictUnauthorized(window.location.pathname, router);
        return;
      }

      try {
        const userInfo = await axios({
          method: "GET",
          url: userinfo_endpoint,
          headers: {
            Authorization: access_token
          }
        })
          .then(response => response.data);

        console.log({ ...userInfo, user_type: "Admin" });
        setUser(userInfo);
      } catch (error) {
        evictUnauthorized(window.location.pathname, router);
      }
    })();
  }, [router]);

  return pathsToIgnore.includes(window.location.pathname) ? children : (user ? children : <h1>Loading...</h1>);
}