"use client";
import axios from 'axios';
import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
// import { LoadingContext, MPEvent, correctForTimezone, formatMinutes, pullNumberFromString, formatDisplayName } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClose } from '@awesome.me/kit-10a739193a/icons/classic/light';
import { MPEvent } from '@/lib/types';

function EventLabel({ label, value, variant = "default", className = "" }: { label: string, value?: string | null, variant?: "default" | "wide", className?: string }) {
  return <div className={variant === "wide" ? `col-span-full w-full` : `col-span-1` + className && ` ${className}`}>
    <p className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{label}:</p>
    {variant === "wide"
      ? <p className="text-lg">{value}</p>
      : <p className="text-lg" title={value ?? "None"}>{value ?? "None"}</p>
    }
  </div>
}

export default function Print() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  // const { updateLoading } = useContext(LoadingContext);
  // const updateLoadingRef = useRef(updateLoading);
  const [event, setEvent] = useState<MPEvent | undefined>();

  const fetchSingleEvent = useCallback(async (id: string) => {
    return await axios({
      method: "GET",
      url: `/api/events/${id}`,
    }).then(response => response.data);
  }, []);

  const getEventInformation = useCallback(async () => {
    try {
      const specificEventID = searchParams.get('id');
      if (!specificEventID) throw console.error("Missing Event ID");

      const currEvent = await fetchSingleEvent(specificEventID);
      setEvent(currEvent);
      // console.log(currEvent);
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try Again" onClick={getEventInformation}>Try Again</ToastAction>,
        variant: "destructive"
      });
    }
  }, [fetchSingleEvent, searchParams, toast]);

  useEffect(() => {
    getEventInformation();
  }, [getEventInformation]);

  return <article className="m-6">
    {event && <div className="flex flex-col gap-2 w-full max-w-[8.5in] mx-auto text-textPrimary">
      <div className="bg-secondary border border-input p-4 rounded-sm relative">
        <div className="w-max min-w-72 max-w-lg mx-auto">
          <a href={`/?id=${searchParams.get('id')}`} className="absolute top-0 left-0 text-xl p-2"><FontAwesomeIcon icon={faArrowLeft} /></a>
          <h1 className="text-center">{event.Event_Title}</h1>
          <div className="flex justify-between">
            {/* <p>{correctForTimezone(event.Event_Start_Date).toLocaleDateString('en-us', { day: "numeric", month: "short", year: "numeric" })}</p> */}
            {/* <p>{correctForTimezone(event.Event_Start_Date).toLocaleTimeString('en-us', { hour: "numeric", minute: "2-digit" })} - {correctForTimezone(event.Event_End_Date).toLocaleTimeString('en-us', { hour: "numeric", minute: "2-digit" })}</p> */}
          </div>
        </div>
      </div>
      <div className="bg-secondary border border-input p-4 rounded-sm grid grid-cols-2 gap-4 gap-x-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Event Location:</p>
          <p>{event.Location_Name}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Event Type:</p>
          <p>{event.Event_Type}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Primary Contact:</p>
          <p>{event.Primary_Contact}</p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Participants Expected:</p>
          <p>{event.Participants_Expected}</p>
        </div>
      </div>
      <div className="bg-secondary border border-input p-4 rounded-sm grid gap-4 grid-cols-4">
        <div className="flex gap-2 col-span-full">
          {event.Description && <EventLabel variant="wide" label="Description" value={event.Description} />}
          {event.Meeting_Instructions && <EventLabel variant="wide" label="Meeting Instructions" value={event.Meeting_Instructions} />}
        </div>
        <EventLabel label="Congregation" value={event.Congregation_Name} />
        <EventLabel label="Program" value={event.Program_Name} />
        {/* <EventLabel label="Setup Time" value={formatMinutes(event.Minutes_for_Setup)} /> */}
        {/* <EventLabel label="Cleanup Time" value={formatMinutes(event.Minutes_for_Cleanup)} /> */}
      </div>
      <div className="flex gap-2">
        {/* {event.Booked_Buildings.length > 0 && event.Booked_Rooms.length > 0 && (
          <div className="w-full bg-secondary border border-input p-4 rounded-sm flex flex-wrap gap-4">
            {event.Booked_Buildings.sort((a, b) => event.Booked_Rooms.filter(room => room.Building_ID === b.Building_ID).length - event.Booked_Rooms.filter(room => room.Building_ID === a.Building_ID).length).map(building => {
              return <div key={building.Building_ID}>
                <p className="text-sm font-semibold">{building.Building_Name}:</p>
                {event.Booked_Rooms.filter(room => room.Building_ID === building.Building_ID).sort((a, b) => pullNumberFromString(a.Room_Name) - pullNumberFromString(b.Room_Name)).map(room => {
                  return <p key={room.Room_ID}>- {room.Room_Name}</p>
                })}
              </div>
            })}
          </div>
        )} */}

        {event.Requested_Services.length > 0 && (
          <div className="flex flex-col gap-2 w-full">
            {event.Requested_Services.map((service, i) => {
              return <div key={i} className="bg-secondary border border-input p-4 rounded-sm grid grid-cols-2 gap-2">
                <EventLabel label="Service" value={service.Service_Name} />
                {/* <EventLabel label="Contact" value={formatDisplayName(service.Service_Contact)} /> */}
              </div>
            })}
          </div>
        )}
      </div>
    </div>}
  </article>
}

// "use client";

// export default function Print() {
//   return <div>
//     <h1>Print</h1>
//   </div>
// }
