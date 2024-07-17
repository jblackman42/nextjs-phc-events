"use client";
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { Loading } from '@/components';
import { AuthData, User } from '@/lib/types';
import { getOAuthConfig } from '@/lib/util';
import { useUser } from '@/context/UserContext';

function CallbackComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialized = useRef(false);
  const { setUser } = useUser();

  useEffect(() => {
    if (initialized.current) return;
    (async () => {
      try {
        initialized.current = true;
        const code = searchParams.get('code');
        const session_state = searchParams.get('session_state');
        if (!session_state) throw ("An unexpected error has occurred.")
        const auth: AuthData = await axios({
          method: 'POST',
          url: '/api/client/auth/token',
          data: {
            grant_type: 'authorization_code',
            redirect_uri: window.location.origin + window.location.pathname,
            code: code,
            session_state: session_state
          }
        }).then(response => response.data);

        const { token_type, access_token } = auth;
        const { userinfo_endpoint } = await getOAuthConfig();

        const user: User = await axios({
          method: 'POST',
          url: userinfo_endpoint,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${token_type} ${access_token}`
          }
        }).then(response => response.data);
        setUser(user);

        const token_expire_date = new Date();
        token_expire_date.setSeconds(token_expire_date.getSeconds() + auth.expires_in);
        // create user session
        await axios({
          method: 'POST',
          url: '/api/client/auth/login',
          data: {
            ...auth,
            expiry_date: token_expire_date,
            session_state: session_state
          }
        });

        router.push('/');
      } catch (error) {
        // router.push('/');
      }
    })();
  }, [searchParams, setUser, router]);

  return <Loading />;
}

export default function Callback() {
  return (
    <Suspense fallback={<Loading />}>
      <CallbackComponent />
    </Suspense>
  );
}