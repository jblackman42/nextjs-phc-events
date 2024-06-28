"use client";
import { SetStateAction, createContext } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from 'axios';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";



export const settings: CalendarSettings = {
  showCancelledEvents: false,
  showRetiredLocations: false
}

interface CalendarSettings {
  showCancelledEvents: boolean;
  showRetiredLocations: boolean;
}

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

export interface MPEvent {
  Booked_Buildings: MPBuilding[];
  Booked_Rooms: MPRoom[];
  Requested_Services: MPService[];
  Event_ID: number;
  Event_Title: string;
  Event_Type: string;
  Congregation_Name: string;
  Location_Name: string;
  Location_ID: number;
  Meeting_Instructions: string | null;
  Description: string | null;
  Program_Name: string;
  Primary_Contact: string;
  Participants_Expected: number | null;
  Minutes_for_Setup: number;
  Minutes_for_Cleanup: number;
  Event_Start_Date: string;
  Event_End_Date: string;
  Cancelled: boolean;
  Featured_On_Calendar: boolean;
  Visibility_Level: string;
  Created_By: string | null;
}

export interface MPService {
  Service_Name: string;
  Service_Contact: string;
  Approved: boolean;
}

export interface MPLocation {
  Location_ID: number;
  Location_Name: string;
  Retired: boolean;
  Buildings: MPBuilding[];
}

export interface MPBuilding {
  Building_ID: number;
  Building_Name: string;
  Rooms: MPRoom[]
}

export interface MPRoom {
  Room_ID: number;
  Room_Name: string;
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
  user_type: string;
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

export function getUserType(roles: Array<string>): string {
  if (roles.includes('Administrators')) {
    return "Admin";
  } else {
    return "Member";
  }
}

export function correctForTimezone(date: string): Date {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + result.getTimezoneOffset());
  return result;
}
export function getOrdinalSuffix(value: number | string): string {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(num)) {
    throw new Error('Invalid input: not a number');
  }

  const remainder = num % 100;

  if (remainder >= 11 && remainder <= 13) {
    return 'th';
  }

  switch (num % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}
export function getFormattedDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export class CalendarDate extends Date {
  getWeek(this: CalendarDate): number {
    var date = new Date(this.getUTCFullYear(), this.getUTCMonth(), this.getUTCDate());
    date.setHours(0, 0, 0, 0);
    // Set the date to the nearest Sunday (the start of the week)
    date.setDate(date.getUTCDate() - date.getUTCDay());
    // January 1 is always in week 1
    var week1 = new Date(date.getUTCFullYear(), 0, 1);
    // Adjust to the nearest Sunday in week 1
    week1.setDate(week1.getUTCDate() - week1.getUTCDay());
    // Calculate the number of weeks from week1 to the current date
    return Math.ceil(((date.getTime() - week1.getTime()) / 86400000 + 1) / 7);
  }
}

interface UserContextType {
  user: User | null,
  updateGlobalUser: (userData: User) => void
}

export const LoadingContext = createContext({
  loading: false,
  updateLoading: (value: boolean) => { }
});
export const ThemeContext = createContext({
  theme: '',
  toggleTheme: () => { }
});
export const UserContext = createContext<UserContextType>({
  user: null,
  updateGlobalUser: () => { }
});