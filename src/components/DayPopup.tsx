"use client";
import { useEffect, useRef, useState } from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useCurrentDate } from '@/context/CurrentDateContext';
import { CalendarDate, MPEvent } from '@/lib/types';
import { getEvents } from '@/app/actions';

const getDateString = (date: Date | CalendarDate) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${weekdays[date.getUTCDay()]}, ${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
}

const DayPopup = () => {
  const { currentDate } = useCurrentDate();
  const [event, setEvents] = useState<MPEvent[]>([]);

  useEffect(() => {
    (async () => {
      const startDate = currentDate.toISOString();
      const endDate = new Date(currentDate.getTime() + (86400000 - 1)).toISOString();

      const newEvents = await getEvents(startDate, endDate);
      console.log(newEvents);
    })()
  }, [currentDate]);

  return <DialogContent>
    <DialogHeader>
      <DialogTitle>{getDateString(currentDate)}</DialogTitle>
      <DialogDescription>{21} Events</DialogDescription>
    </DialogHeader>
    {/* <div className="max-h-[90dvh] h-max flex flex-col overflow-hidden">
      <div className="sticky top-0 bg-secondary p-2 border-b-4 border-accent shadow-md">
        <h1>{date.toLocaleDateString('en-us', { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</h1>
        <p>{events.length} Event{events.length !== 1 ? "s" : ""}</p>
      </div>
      <div ref={scrollContainerRef} className="max-h-[550px] grid gap-2 p-2 bg-secondary custom-scroller overflow-auto">
        {events.map((event, i) => {
          const startTime = correctForTimezone(event.Event_Start_Date).toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' });
          const endTime = correctForTimezone(event.Event_End_Date).toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' });
          const pcDisplayName = `${event.Primary_Contact.split(', ')[1]} ${event.Primary_Contact.split(', ')[0]}`
          return <button key={i} onClick={() => handleClick(event)}>
            <div style={{ borderColor: event.Featured_On_Calendar ? "#fcc200" : "" }} className="grid grid-cols-2 text-sm bg-primary p-2 rounded-sm border-l-4 border-accent duration-75 transition-[border-width] hover:border-l-8 shadow-md text-left">
              <p className="col-start-1">{event.Event_Type}</p>
              <p className="col-start-2 text-right">{pcDisplayName}</p>
              <p className="col-span-2 text-textHeading text-lg font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{event.Event_Title}</p>
              <p className="col-start-1">{startTime} - {endTime}</p>
              <p className="col-start-2 text-right">{event.Location_Name}</p>
            </div>
          </button>
        })}
      </div>
    </div> */}
  </DialogContent>
}

export default DayPopup;