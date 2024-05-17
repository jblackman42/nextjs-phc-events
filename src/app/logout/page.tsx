"use client";
import { useRouter } from 'next/navigation'
import { getOAuthConfig, encodeUrlForm, deleteAuthData } from "@/lib/utils";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const idToken = window.localStorage.getItem('id_token');
      const { end_session_endpoint } = await getOAuthConfig();
      const logoutConfig = encodeUrlForm({
        id_token_hint: idToken,
        post_logout_redirect_uri: `${window.location.origin}`
      });

      deleteAuthData();
      router.push(`${end_session_endpoint}?${logoutConfig}`);
    })();
  }, [router]);

  return <h1>Loading...</h1>;
}