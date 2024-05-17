"use client";
import { useRouter } from 'next/navigation'
import { getOAuthConfig, encodeUrlForm } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function Login() {
  const router = useRouter();
  const [loginURL, setLoginURL] = useState<string>('');
  useEffect(() => {
    (async () => {
      const { authorization_endpoint } = await getOAuthConfig();
      const loginConfig = encodeUrlForm({
        client_id: 'dev_testing',
        redirect_uri: `${window.location.origin}/callback`,
        response_type: 'code',
        scope: 'http://www.thinkministry.com/dataplatform/scopes/all openid offline_access'
      });
      setLoginURL(`${authorization_endpoint}?${loginConfig}`);
    })();
  }, []);

  const login = () => {
    router.push(loginURL);
  }

  return (
    <button className="bg-accent text-accent-foreground p-2 px-6 rounded-sm shadow-md border hover:-translate-y-1 transition-transform" onClick={login}>Login</button>
  );
}