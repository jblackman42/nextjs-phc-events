"use client";
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react';
import { AuthData, saveAuthData } from "@/lib/utils";
import axios from 'axios';

export default function Callback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    (async () => {
      try {
        initialized.current = true;
        const code = searchParams.get('code');
        const session_state = searchParams.get('session_state');
        const auth: AuthData = await axios({
          method: 'POST',
          url: '/api/token',
          data: {
            grant_type: 'authorization_code',
            redirect_uri: window.location.origin + window.location.pathname,
            code: code,
            session_state: session_state
          }
        })
          .then(response => response.data);

        const desiredPath = window.sessionStorage.getItem('desired_path') ?? '/';

        saveAuthData(auth, session_state ?? '');

        router.push(desiredPath);
      } catch (error) {
        // console.log(error);
        router.push('/');
        // handle the error
      }
    })();
  }, [searchParams, router]);

  return (
    <h1>Loading...</h1>
  );
}