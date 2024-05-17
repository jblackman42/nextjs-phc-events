"use client";
import { createContext } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from 'axios';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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

export interface User {
  amr: string;
  auth_hash: string;
  auth_time: string;
  display_name: string;
  email: string;
  email_verified: string;
  ext_Address_Line_1: string;
  ext_Address_Line_2: string;
  ext_City: string;
  ext_Congregation_Name: string;
  ext_Contact_GUID: string;
  ext_Contact_ID: string;
  ext_Contact_Status: string;
  ext_Display_Name: string;
  ext_Domain_GUID: string;
  ext_Email_Address: string;
  ext_Engagement_Level: string;
  ext_First_Name: string;
  ext_Home_Phone: string;
  ext_Household_ID: string;
  ext_Last_Name: string;
  ext_Latitude: string;
  ext_Longitude: string;
  ext_Member_Status: string;
  ext_Mobile_Phone: string;
  ext_Nickname: string;
  ext_Participant_Type: string;
  ext_Postal_Code: string;
  ext_Red_Flag_Notes: string;
  'ext_State/Region': string;
  ext_User_GUID: string;
  family_name: string;
  given_name: string;
  idp: string;
  locale: string;
  middle_name: string;
  name: string;
  nickname: string;
  roles: Array<string>;
  sub: string;
  userid: string;
  zoneinfo: string;
}

export interface AuthData {
  id_token: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface NavLink {
  type: 'navLink';
  label: string;
  icon: IconDefinition;
  link: string | null;
  action: (() => void) | null;
}

export interface Spacer {
  type: 'spacer';
}

export interface LinkOrButtonProps {
  navLink: NavLink;
}

export type NavbarItem = NavLink | Spacer;

export const encodeUrlForm = (obj: any): string => Object.keys(obj).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])).join('&');

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export function evictUnauthorized(path: string, router: AppRouterInstance): void {
  window.sessionStorage.setItem('desired_path', path);
  router.push('/login');
}

export function saveAuthData(authData: AuthData, session_state?: string): void {
  const { id_token, access_token, refresh_token, token_type, expires_in } = authData;
  const token_expire_date = new Date();
  token_expire_date.setSeconds(token_expire_date.getSeconds() + expires_in);

  window.localStorage.setItem('id_token', id_token);
  window.localStorage.setItem('access_token', token_type + ' ' + access_token);
  window.localStorage.setItem('refresh_token', refresh_token);
  window.localStorage.setItem('expires_in', token_expire_date.toISOString());
  if (session_state) window.localStorage.setItem('session_state', session_state);
}
export function deleteAuthData(): void {
  window.localStorage.removeItem('id_token');
  window.localStorage.removeItem('access_token');
  window.localStorage.removeItem('refresh_token');
  window.localStorage.removeItem('expires_in');
  window.localStorage.removeItem('session_state');
}

interface UserContextType {
  user: User | null,
  updateGlobalUser: (userData: User) => void
}

export const ThemeContext = createContext({
  theme: '',
  toggleTheme: () => { }
});
export const UserContext = createContext<UserContextType>({
  user: null,
  updateGlobalUser: () => { }
});