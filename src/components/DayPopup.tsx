"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { CalendarDate, MPEvent, MPEventCount } from '@/lib/types';
import { getEvents } from '@/app/actions';
import { useSettings } from '@/context/SettingsContext';
import { useView } from '@/context/ViewContext';
const correctForTimezone = (date: string): Date => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + result.getTimezoneOffset());
  return result;
}
const getDateString = (date: Date | CalendarDate) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${weekdays[date.getUTCDay()]}, ${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`
}
const sameDay = (d1: Date, d2: Date) => {
  return d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate();
}

const DayPopup = ({ eventCounts = [], handleEventClick }: { eventCounts?: MPEventCount[], handleEventClick: (value: MPEvent) => void }) => {

  const { settings } = useSettings();
  const { view } = useView();
  const [loading, setLoading] = useState<boolean>(true);
  const [eventCount, setEventCount] = useState<number | undefined>(undefined);
  const [events, setEvents] = useState<MPEvent[]>([]);

  useEffect(() => {
    const newEventCount = eventCounts.find(count => sameDay(new Date(count.Date), view.selected_date));
    if (newEventCount) setEventCount(settings.showCancelledEvents.value ? newEventCount?.Event_Count + newEventCount?.Cancelled_Count : newEventCount?.Event_Count)
  }, [view.selected_date, eventCounts, settings.showCancelledEvents]);

  useEffect(() => {
    (async () => {
      setEvents([]);
      setLoading(true);
      const startDate = view.selected_date.toISOString();
      const endDate = new Date(view.selected_date.getTime() + (86400000 - 1)).toISOString();

      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const newEvents = await getEvents(startDate, endDate, view.location_id, view.building_id, view.room_id);
      setEvents(newEvents);
      setLoading(false);
    })()
  }, [view.selected_date, view.location_id, view.building_id, view.room_id]);

  return <DialogContent>
    <DialogHeader>
      <DialogTitle>{getDateString(view.selected_date)}</DialogTitle>
      <DialogDescription>{eventCount ?? events.length} Events</DialogDescription>
    </DialogHeader>
    <div className="max-h-[550px] grid gap-2 p-2 custom-scroller overflow-auto">
      {loading ? (
        [...Array(eventCount ?? 5)].map((_, i) => {
          return (
            <div key={i} className="grid grid-cols-2 bg-secondary p-2 h-[84px] box-border gap-1 rounded-sm border-l-4 border-accent shadow-md *:rounded-md">
              <div style={{ animationDelay: `${50 * i}ms` }} className="col-start-1 w-16 h-4 bg-primary animate-skeleton-breathe"></div>
              <div style={{ animationDelay: `${50 * i}ms` }} className="col-start-2 w-20 h-4 ml-auto bg-primary animate-skeleton-breathe"></div>
              <div style={{ animationDelay: `${50 * i}ms` }} className="col-span-2 w-56 h-6 bg-primary animate-skeleton-breathe"></div>
              <div style={{ animationDelay: `${50 * i}ms` }} className="col-start-1 w-24 h-4 bg-primary animate-skeleton-breathe"></div>
              <div style={{ animationDelay: `${50 * i}ms` }} className="col-start-2 w-16 h-4 ml-auto bg-primary animate-skeleton-breathe"></div>
            </div>
          )
        })
      ) : (
        events.filter(event => settings.showCancelledEvents.value || !event.Cancelled).map((event, i) => {
          const startTime = correctForTimezone(event.Event_Start_Date).toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' });
          const endTime = correctForTimezone(event.Event_End_Date).toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' });
          const pcDisplayName = `${event.Primary_Contact.split(', ')[1]} ${event.Primary_Contact.split(', ')[0]}`
          return <button key={i} onClick={() => handleEventClick(event)}>
            <div style={{ borderColor: event.Cancelled ? "var(--destructive)" : event.Featured_On_Calendar ? "#27ae60" : "" }} className="grid grid-cols-2 text-sm bg-secondary p-2 rounded-sm border-l-4 border-accent duration-75 transition-[border-width] hover:border-l-8 shadow-md text-left">
              <p className="col-start-1">{event.Event_Type}</p>
              <p className="col-start-2 text-right">{pcDisplayName}</p>
              <p className="col-span-2 text-textHeading text-lg font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{event.Event_Title}</p>
              <p className="col-start-1">{startTime} - {endTime}</p>
              <p className="col-start-2 text-right">{event.Location_Name}</p>
            </div>
          </button>
        })
      )}
    </div>
  </DialogContent>
}

export default DayPopup;