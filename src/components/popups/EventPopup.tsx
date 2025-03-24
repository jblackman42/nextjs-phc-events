"use client";
import React, { useState } from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { MPEvent, MPRoom } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@awesome.me/kit-10a739193a/icons/classic/solid';
import { cn } from '@/lib/util';

function correctForTimezone(date: string): Date {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + result.getTimezoneOffset());
  return result;
}
function formatDisplayName(name: string | null): string {
  return name ? `${name.split(', ')[1]} ${name.split(', ')[0]}` : '';
}
function pullNumberFromString(str: string): number {
  const matches = str.match(/(\d+)/);
  return !matches ? Infinity : parseInt(matches[0])
}
function formatMinutes(minutes: number): string {
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
function copy(text: string): Promise<void> {
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

function EventLabel({ label, value, variant = "default", className }: { label: string, value?: string | null, variant?: "default" | "wide" | "none", className?: string }) {
  // {variant === "wide" ? `col-span-3` : `col-span-1` + className && ` ${className}`}
  return value && <div data-label={variant} className={cn(variant === "default" ? "sm:col-span-2" : variant === "wide" ? "col-span-full" : "", className)}>
    <p className="text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{label}:</p>
    {variant === "wide"
      ? <p className="text-textHeading bg-primary border p-2 mt-1 rounded-sm shadow-md max-h-24 overflow-y-auto custom-scroller">{value}</p>
      : <p title={value} className="text-textHeading whitespace-nowrap overflow-hidden text-ellipsis">{value}</p>
    }
  </div>
}

function EventPopup({ event }: { event: MPEvent | undefined }) {
  const [shareMsg, setShareMsg] = useState<string>("Share");

  if (!event) {
    return null;
  }

  const eventDate = correctForTimezone(event.Event_Start_Date).toLocaleDateString('en-us', { day: "numeric", month: "short", year: "numeric" });
  const startTime = correctForTimezone(event.Event_Start_Date).toLocaleTimeString('en-us', { hour: "numeric", minute: "2-digit" });
  const endTime = correctForTimezone(event.Event_End_Date).toLocaleTimeString('en-us', { hour: "numeric", minute: "2-digit" });
  const bookedRoomsNames = event.Booked_Rooms.map((r: MPRoom) => r.Room_Name).sort((a, b) => pullNumberFromString(a) - pullNumberFromString(b)).join(", ");

  const startDate = new Date(event.Event_Start_Date);
  const endDate = new Date(event.Event_End_Date);
  const correctedStartDate = new Date(startDate.getTime() + (startDate.getTimezoneOffset() * 60000)).toISOString()
  const correctedEndDate = new Date(endDate.getTime() + (endDate.getTimezoneOffset() * 60000)).toISOString()
  const addToCalendarLink = `https://outlook.office.com/calendar/0/deeplink/compose?allday=false&path=/calendar/action/compose&rru=addevent&enddt=${correctedEndDate}&startdt=${correctedStartDate}&subject=${event.Event_Title}${event.Location_Name ? `&location=${event.Location_Name}` : ""}`

  const copyLink = () => {
    try {
      const shareLink = `${window.location.href}?id=${event.Event_ID}`;
      copy(shareLink);
      setShareMsg("Link Copied!");
      setTimeout(() => setShareMsg("Share"), 3000);
    } catch (error) {
      setShareMsg("Copy Failed")
      setTimeout(() => setShareMsg("Share"), 5000);
    }
  }

  const isPublicEvent = event.Visibility_Level === "4 - Public";
  const visibilityIcon = isPublicEvent ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />

  return event && <DialogContent>
    <DialogHeader>
      <DialogTitle>{event.Event_Title}</DialogTitle>
      <DialogDescription>
        <span className="text-sm" title={isPublicEvent ? "Visible on PHC Website" : "Hidden on PHC Website"}>{visibilityIcon}</span>
        <span className="px-2">|</span>
        {eventDate}
        <span className="px-2 hidden sm:inline">|</span><br className="sm:hidden" />
        {`${startTime} - ${endTime}`}
      </DialogDescription>
    </DialogHeader>
    <div className="max-h-[550px] grid custom-scroller overflow-auto">
      <div className="max-h-[600px] grid grid-cols-6 gap-1 md:gap-2 p-2 custom-scroller overflow-auto">
        <div className="col-span-full grid grid-cols-2 sm:grid-cols-4 gap-1">
          <a href={event.Event_Path} target="_blank"><Button variant="thin" size="sm" className="w-full">View on MP</Button></a>
          <a href={addToCalendarLink} target="_blank"><Button variant="thin" size="sm" className="w-full">Add to Calendar</Button></a>
          <Button onClick={copyLink} variant="thin" size="sm" className="w-full">{shareMsg}</Button>
          <Link href={`/print?id=${event.Event_ID}`}><Button variant="thin" size="sm" className="w-full">Print</Button></Link>
        </div>
        <EventLabel label="Event Date" value={eventDate} />
        <EventLabel label="Event Time" value={`${startTime} - ${endTime}`} />
        <EventLabel label="Setup Time" value={formatMinutes(event.Minutes_for_Setup)} />
        <EventLabel label="Primary Contact" value={formatDisplayName(event.Primary_Contact)} />
        <EventLabel label="Event Type" value={event.Event_Type} />
        <EventLabel label="Cleanup Time" value={formatMinutes(event.Minutes_for_Cleanup)} />
        <EventLabel label="Location" value={event.Location_Name ?? "None"} />
        <EventLabel label="Congregation" value={event.Congregation_Name} />
        <EventLabel label="Program" value={event.Program_Name} />
        <EventLabel label="Visibility" value={event.Visibility_Level.includes(' - ') ? event.Visibility_Level.split(' - ')[1] : event.Visibility_Level} />
        <EventLabel label="Featured" value={event.Featured_On_Calendar ? "True" : "False"} />
        <EventLabel label="Created By" value={formatDisplayName(event.Created_By) ?? "API User"} />
        <EventLabel variant="wide" label="Description" value={event.Description} />
        <EventLabel variant="wide" label="Meeting Instructions" value={event.Meeting_Instructions} />
        <EventLabel variant="wide" label="Booked Rooms" value={bookedRoomsNames} />
        {event.Requested_Services.length > 0 && (
          <div className="col-span-full">
            <p className="text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis">Services Requested:</p>
            {event.Requested_Services.map((service, i) => {
              return <div key={i} className="bg-primary border p-2 mt-1 rounded-sm shadow-md grid grid-cols-3 gap-2">
                <EventLabel variant="none" label="Service" value={service.Service_Name} />
                <EventLabel variant="none" label="Contact" value={formatDisplayName(service.Service_Contact)} />
                <EventLabel variant="none" label="Approved" value={service.Approved ? "True" : "False"} />
              </div>
            })}
          </div>
        )}
        {event.Requested_Equipment.length > 0 && (
          <div className="col-span-full">
            <p className="text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis">Equipment Requested:</p>
            {event.Requested_Equipment.map((equipment, i) => {
              return <div key={i} className="bg-primary border p-2 mt-1 rounded-sm shadow-md grid grid-cols-5 gap-2">
                <EventLabel variant="none" className="!col-span-3" label="Equipment" value={equipment.Equipment_Name} />
                <EventLabel variant="none" className="!col-span-1" label="Quantity" value={equipment.Quantity.toString()} />
                <EventLabel variant="none" className="!col-span-1" label="Approved" value={equipment.Approved ? "True" : "False"} />
              </div>
            })}
          </div>
        )}
      </div>
    </div>
  </DialogContent>
}

export default EventPopup;