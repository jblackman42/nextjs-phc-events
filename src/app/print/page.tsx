"use client";
import axios from 'axios';
import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { LoadingContext, MPEvent } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

function EventLabel({ label, value, variant = "default", className = "" }: { label: string, value?: string | null, variant?: "default" | "wide", className?: string }) {
  return <div className={variant === "wide" ? `col-span-2` : `col-span-1` + className && ` ${className}`}>
    <p className="text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{label}:</p>
    {variant === "wide"
      ? <p className="bg-primary p-2 mt-1 rounded-sm shadow-md overflow-y-auto custom-scroller">{value}</p>
      : <p title={value ?? "None"} className="whitespace-nowrap overflow-hidden text-ellipsis">{value ?? "None"}</p>
    }
  </div>
}

export default function Print() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { updateLoading } = useContext(LoadingContext);
  const updateLoadingRef = useRef(updateLoading);
  const [event, setEvent] = useState<MPEvent | undefined>();

  const fetchSingleEvent = useCallback(async (id: string) => {
    return await axios({
      method: "GET",
      url: `/api/events/${id}`,
    }).then(response => response.data);
  }, []);

  const getEventInformation = useCallback(async () => {
    updateLoadingRef.current(true);
    try {
      const specificEventID = searchParams.get('id');
      if (!specificEventID) throw console.error("Missing Event ID");

      const currEvent = await fetchSingleEvent(specificEventID);
      setEvent(currEvent);
      console.log(currEvent);
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try Again" onClick={getEventInformation}>Try Again</ToastAction>,
        variant: "destructive"
      });
    }
    updateLoadingRef.current(false);
  }, []);

  useEffect(() => {
    getEventInformation();
  }, [getEventInformation]);

  return <article className="m-6">
    {event && <div className="grid grid-cols-3 w-full max-w-[1400px] mx-auto text-textHeading">
      <div className="bg-secondary p-4 rounded-sm shadow-md grid gap-4 grid-cols-4 col-span-3">
        <EventLabel label="Event Title" value={event.Event_Title} />
        <EventLabel label="Event Type" value={event.Event_Type} />
        <EventLabel label="Congregation" value={event.Congregation_Name} />
        <EventLabel label="Location" value={event.Location_Name} />
        <EventLabel label="Meeting Instructions" value={event.Meeting_Instructions} />
        <EventLabel variant="wide" label="Description" value={event.Description} />
        <EventLabel label="Program" value={event.Program_Name} />
        <EventLabel label="Minutes For Setup" value={event.Minutes_for_Setup.toString()} />
        <EventLabel label="Minutes For Cleanup" value={event.Minutes_for_Cleanup.toString()} />
      </div>
    </div>}
  </article>
}