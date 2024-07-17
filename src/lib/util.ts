"use client";

import axios from "axios";

export const generateUid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export const logout = async () => {
  // Revoke token & clear session cookie
  await axios({
    method: "POST",
    url: "/api/client/auth/logout"
  });
  window.location.reload(); // Force a full page reload
};

export interface OAuthConfig {
  issuer: string;
  jwks_uri: string;
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  end_session_endpoint: string;
  check_session_iframe: string;
  revocation_endpoint: string;
  introspection_endpoint: string;
  frontchannel_logout_supported: boolean;
  frontchannel_logout_session_supported: boolean;
  scopes_supported: Array<string>;
  claims_supported: Array<string>;
  response_types_supported: Array<string>;
  response_modes_supported: Array<string>;
  grant_types_supported: Array<string>;
  subject_types_supported: Array<string>;
  id_token_signing_alg_values_supported: Array<string>;
  code_challenge_methods_supported: Array<string>;
  token_endpoint_auth_methods_supported: Array<string>;
}

let currOAuthConfig: OAuthConfig;
export async function getOAuthConfig(): Promise<OAuthConfig> {
  if (!currOAuthConfig) {
    const data = await axios({
      method: 'GET',
      url: process.env.NEXT_PUBLIC_DISCOVER_URL
    })
      .then(response => response.data);
    currOAuthConfig = data;
    return currOAuthConfig;
  }
  return currOAuthConfig;
}