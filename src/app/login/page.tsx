"use client"
import { useRouter } from 'next/navigation'
import { getOAuthConfig, encodeUrlForm } from "@/lib/utils"
import { useEffect } from "react"

export default function Login() {
  const router = useRouter()
  useEffect(() => {
    (async () => {
      const { authorization_endpoint } = await getOAuthConfig()
      const loginConfig = encodeUrlForm({
        client_id: 'dev_testing',
        redirect_uri: `${window.location.origin}/callback`,
        response_type: 'code',
        scope: 'http://www.thinkministry.com/dataplatform/scopes/all openid offline_access'
      })
      router.push(`${authorization_endpoint}?${loginConfig}`)
    })()
  }, [router])

  return <h1>Loading...</h1>
}