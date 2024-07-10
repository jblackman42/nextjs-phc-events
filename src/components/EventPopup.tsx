import React, { useState } from 'react';
import Popup from './Popup';
import { MPEvent, MPRoom, correctForTimezone, copy, formatMinutes, pullNumberFromString, formatDisplayName } from '@/lib/utils';
import { Button } from './ui/button';
import Link from 'next/link';

function EventLabel({ label, value, variant = "default", className }: { label: string, value?: string | null, variant?: "default" | "wide", className?: string }) {
  return value && <div className={variant === "wide" ? `col-span-3` : `col-span-1` + className && ` ${className}`}>
    <p className="text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{label}:</p>
    {variant === "wide"
      ? <p className="text-textHeading bg-primary p-2 mt-1 rounded-sm shadow-md max-h-24 overflow-y-auto custom-scroller">{value}</p>
      : <p title={value} className="text-textHeading whitespace-nowrap overflow-hidden text-ellipsis">{value}</p>
    }
  </div>
}

function EventPopup({ open = null, setOpen, event }: { open: Boolean | null, setOpen: Function, event: MPEvent }) {
  const [shareMsg, setShareMsg] = useState<string>("Share");

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



  return event && <Popup open={open} setOpen={setOpen} >
    <div className="max-h-[90dvh] h-max flex flex-col overflow-hidden">
      <div className="sticky top-0 bg-secondary p-2 border-b-4 border-accent">
        <h1 className="pr-6">{event.Event_Title}</h1>
      </div>
      <div className="bg-secondary grid grid-cols-4 gap-1 p-1 pb-2">
        <a href={event.Event_Path} target="_blank"><Button variant="thin" size="sm" className="w-full">View on MP</Button></a>
        <a href={addToCalendarLink} target="_blank"><Button variant="thin" size="sm" className="w-full">Add to Calendar</Button></a>
        <Button onClick={copyLink} variant="thin" size="sm" className="w-full">{shareMsg}</Button>
        <Link href={`/print?id=${event.Event_ID}`}><Button variant="thin" size="sm" className="w-full">Print</Button></Link>
      </div>
      <div className="max-h-[600px] grid grid-cols-3 gap-1 md:gap-2 p-1 md:p-2 !pt-0 bg-secondary custom-scroller overflow-auto">
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
          <div className="col-span-3">
            <p className="text-xs">Services Requested:</p>
            {event.Requested_Services.map((service, i) => {
              return <div key={i} className="bg-primary p-2 mt-1 rounded-sm shadow-md grid grid-cols-3 gap-2">
                <EventLabel label="Service" value={service.Service_Name} />
                <EventLabel label="Contact" value={formatDisplayName(service.Service_Contact)} />
                <EventLabel label="Approved" value={service.Approved ? "True" : "False"} />
              </div>
            })}
          </div>
        )}
        {event.Requested_Equipment.length > 0 && (
          <div className="col-span-3">
            <p className="text-xs">Equipment Requested:</p>
            {event.Requested_Equipment.map((equipment, i) => {
              return <div key={i} className="bg-primary p-2 mt-1 rounded-sm shadow-md grid grid-cols-5 gap-2">
                <EventLabel className="col-span-3" label="Equipment" value={equipment.Equipment_Name} />
                <EventLabel className="col-span-1" label="Quantity" value={equipment.Quantity.toString()} />
                <EventLabel className="col-span-1" label="Approved" value={equipment.Approved ? "True" : "False"} />
              </div>
            })}
          </div>
        )}
      </div>
    </div>
  </Popup>
}

export default EventPopup;