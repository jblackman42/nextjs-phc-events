"use client";
import { useRouter } from 'next/navigation';
import { getOAuthConfig, encodeUrlForm } from "@/lib/util";
import { useEffect } from "react";
import { Loading } from '@/components';

export default function Login() {
  const router = useRouter()
  useEffect(() => {
    (async () => {
      const { authorization_endpoint } = await getOAuthConfig()
      const loginConfig = encodeUrlForm({
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID || process.env.CLIENT_ID,
        redirect_uri: `${window.location.origin}/callback`,
        response_type: 'code',
        scope: 'http://www.thinkministry.com/dataplatform/scopes/all openid offline_access'
      })
      router.push(`${authorization_endpoint}?${loginConfig}`)
    })()
  }, [router])

  return <Loading />;
}