import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface HaQuestionData {
  Ministry_Question_ID: number;
  Question_Header: string;
  Question_Title: string;
  Question_Description: string;
  Answer_Format: 'C' | 'N0' | 'N2';
  Answer_Label: string;
  Current_Total: number;
  Previous_Total: number;
  Current_Year: number;
  Previous_Year: number;
}
export interface HaQuestion {
  Question_Category_ID: number;
  Question_Category: string;
  Question_Data: HaQuestionData[];
}
export interface HaSection {
  Question_Section_ID: number;
  Question_Section: string;
  Questions: HaQuestion[];
}
export interface Congregation {
  Congregation_ID: number;
  Congregation_Name: string;
  Description: string;
  Start_Date: string;
  Location: string;
  Time_Zone: string;
}
export interface AuthData {
  id_token: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}
export interface SessionData {
  id_token: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expiry_date: Date;
  session_state: string;
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

export interface NavLink {
  variant: 'link' | 'spacer';
  label: string | null;
  icon: IconDefinition | null;
  link: string | null;
  action: (() => void) | null;
}
export interface MPLocation {
  Location_ID: number;
  Location_Name: string;
  Retired: boolean;
  Buildings: MPBuildingWithRooms[];
}
export interface MPBuildingWithRooms {
  Building_ID: number;
  Building_Name: string;
  Rooms: MPRoom[]
}
export interface MPBuilding {
  Building_ID: number;
  Building_Name: string;
}
export interface MPRoom {
  Room_ID: number;
  Room_Name: string;
  Building_ID: number;
}
export interface MPService {
  Service_Name: string;
  Service_Contact: string;
  Approved: boolean;
}
export interface MPEquipment {
  Equipment_Name: string;
  Quantity: number;
  Approved: boolean;
}
export interface MPEvent {
  Booked_Buildings: MPBuilding[];
  Booked_Rooms: MPRoom[];
  Requested_Services: MPService[];
  Requested_Equipment: MPEquipment[];
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
  Event_Path: string;
  Event_Image_URL: string;
}

export interface MPEventCount {
  Date: string;
  Event_Count: number;
  Cancelled_Count: number;
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