"use client"
import { useRouter } from 'next/navigation';
import { getOAuthConfig, encodeUrlForm, deleteAuthData } from "@/lib/utils";
import { useEffect } from "react";
import Cookies from 'js-cookie';
import { Loading } from '@/components';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const idToken = Cookies.get('id_token');
      const { end_session_endpoint } = await getOAuthConfig();
      const logoutConfig = encodeUrlForm({
        id_token_hint: idToken,
        post_logout_redirect_uri: `${window.location.origin}`
      });

      deleteAuthData();
      router.push(`${end_session_endpoint}?${logoutConfig}`);
    })();
  }, [router]);

  return <Loading />;
}