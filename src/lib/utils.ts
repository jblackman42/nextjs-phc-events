// import { createContext } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from 'axios';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Cookies from 'js-cookie';
import { MPEvent } from "@/lib/types";

export interface AuthData {
  id_token: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
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

export interface WeekEvent {
  id: number;
  event: MPEvent;
  width: string;
  height: string;
  posX: string;
  posY: string;
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
  Buildings: MPBuildingWithRooms[];
}

export interface MPBuilding {
  Building_ID: number;
  Building_Name: string;
}
export interface MPBuildingWithRooms {
  Building_ID: number;
  Building_Name: string;
  Rooms: MPRoom[]
}

export interface MPRoom {
  Room_ID: number;
  Room_Name: string;
  Building_ID: number;
}

export interface MPEquipment {
  Equipment_Name: string;
  Quantity: number;
  Approved: boolean;
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

  const isSecure = window.location.protocol === 'https:';

  Cookies.set('id_token', id_token, { path: '/', secure: isSecure, sameSite: 'Strict' });
  Cookies.set('access_token', `${token_type} ${access_token}`, { path: '/', secure: isSecure, sameSite: 'Strict' });
  Cookies.set('refresh_token', refresh_token, { path: '/', secure: isSecure, sameSite: 'Strict' });
  Cookies.set('expires_in', token_expire_date.toISOString(), { path: '/', secure: isSecure, sameSite: 'Strict' });
  if (session_state) {
    Cookies.set('session_state', session_state, { path: '/', secure: isSecure, sameSite: 'Strict' });
  }
}

export function deleteAuthData(): void {
  Cookies.remove('id_token', { path: '/' });
  Cookies.remove('access_token', { path: '/' });
  Cookies.remove('refresh_token', { path: '/' });
  Cookies.remove('expires_in', { path: '/' });
  Cookies.remove('session_state', { path: '/' });
}

export function getUserType(roles: Array<string>): string {
  if (roles.includes('Administrators')) {
    return "Admin";
  } else {
    return "Member";
  }
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



// interface CalendarSettingsType {
//   settings: CalendarSettings | null,
//   updateSettings: (value: CalendarSettings) => void
// }

// export const SettingsContext = createContext<CalendarSettingsType>({
//   settings: null,
//   updateSettings: (value: CalendarSettings) => { }
// })

export const generateUid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function pullNumberFromString(str: string): number {
  const matches = str.match(/(\d+)/);
  return !matches ? Infinity : parseInt(matches[0])
}

export function formatDisplayName(name: string | null): string {
  return name ? `${name.split(', ')[1]} ${name.split(', ')[0]}` : '';
}

export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let result = '';

  if (hours > 0) {
    result += `${hours} hr${hours > 1 ? 's' : ''}`;
  }

  if (remainingMinutes > 0) {
    if (hours > 0) {
      result += ' ';
    }
    result += `${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`;
  }

  return result || '0 mins';
}

export function copy(text: string): Promise<void> {
  return new Promise((resolve, reject): void => {
    if (typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined" && typeof navigator.permissions !== "undefined") {
      const type = "text/plain";
      const blob = new Blob([text], { type });
      const data = [new ClipboardItem({ [type]: blob })];

      navigator.permissions.query({ name: "clipboard-write" as PermissionName }).then((permission) => {
        if (permission.state === "granted" || permission.state === "prompt") {
          navigator.clipboard.write(data).then(resolve, reject).catch(reject);
        } else {
          reject(new Error("Permission not granted!"));
        }
      });
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
      const textarea = document.createElement("textarea");
      textarea.textContent = text;
      textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
      textarea.style.width = '2em';
      textarea.style.height = '2em';
      textarea.style.padding = '0';
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.background = 'transparent';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        document.execCommand("copy");
        document.body.removeChild(textarea);
        resolve();
      } catch (e) {
        document.body.removeChild(textarea);
        reject(e);
      }
    } else {
      reject(new Error("None of copying methods are supported by this browser!"));
    }
  });
}

export const correctForTimezone = (date: string | Date): Date => {
  const inputDate = date instanceof Date ? date : new Date(date);
  const result = new Date(inputDate);
  result.setMinutes(result.getMinutes() + result.getTimezoneOffset());
  return result;
}