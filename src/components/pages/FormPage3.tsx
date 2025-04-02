"use client";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

import { MPLocation, MPBuildingWithRooms, MPRoom } from "@/lib/types";
import { cn, getISOTime } from "@/lib/util";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faCircleInfo } from "@awesome.me/kit-10a739193a/icons/classic/solid";
import { Checkbox } from "@/components/ui/checkbox";

import { useCreateEventData } from "@/context/CreateEventContext";
import { useToast } from '@/context/ToastContext';

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface FormPage3Props {
  isActive: boolean;
  allLocations: MPLocation[];
  openAccordionID: number | undefined;
  setOpenAccordionID: (id: number | undefined) => void;
}

interface BlockedRoom {
  Event_Room_ID: number;
  Event_ID: number;
  Room_ID: number;
  Event_Start_Date: string;
  Event_End_Date: string;
  Event_Title: string;

}

const FormPage3 = ({ isActive, allLocations, openAccordionID, setOpenAccordionID }: FormPage3Props) => {
  const { addToast } = useToast();
  const { eventData, updateEventData } = useCreateEventData();
  const [blockedRooms, setBlockedRooms] = useState<BlockedRoom[]>([]);
  const currentLocation = allLocations.find(location => location.Location_ID === eventData?.Location_ID);
  const filteredBuildings = currentLocation?.Buildings.filter(building => building.Rooms.length > 0) || [];
  
  // Add reference objects to track previous values
  const prevValues = useRef({
    locationId: undefined as number | undefined,
    patternString: "",
    eventLengthMinutes: 0,
    setupTime: 0,
    cleanupTime: 0
  });

  const handleRoomChecked = (roomID: number) => {
    if (!eventData) return;
    if (eventData.Selected_Rooms.includes(roomID)) {
      updateEventData({ ...eventData, Selected_Rooms: eventData.Selected_Rooms.filter(id => id !== roomID) });
    } else {
      updateEventData({ ...eventData, Selected_Rooms: [...eventData.Selected_Rooms, roomID] });
    }
  }

  const handleAllRoomsChecked = (building: MPBuildingWithRooms) => {
    if (!eventData) return;
    const buildingRoomIDs = building.Rooms.filter(room => !blockedRooms.map(blockedRoom => blockedRoom.Room_ID).includes(room.Room_ID)).map((room: MPRoom) => room.Room_ID);
    const allRoomsSelected = buildingRoomIDs.filter(id => !blockedRooms.map(room => room.Room_ID).includes(id)).every((id: number) => eventData.Selected_Rooms.includes(id));

    if (allRoomsSelected) {
      // Remove all rooms in this building
      updateEventData({ ...eventData, Selected_Rooms: eventData.Selected_Rooms.filter(id => !buildingRoomIDs.includes(id)) });
    } else {
      // Add all rooms in this building
      updateEventData({ ...eventData, Selected_Rooms: [...eventData.Selected_Rooms, ...buildingRoomIDs.filter(id => !eventData.Selected_Rooms.includes(id))] });
    }

  }

  useEffect(() => {
    const getBlockedRooms = async () => {
      try {
        if (eventData?.Location_ID === undefined || 
            eventData?.Recurring_Pattern === undefined || 
            eventData?.Event_Date === undefined || 
            eventData?.Event_Start_Time === undefined || 
            eventData?.Event_End_Time === undefined || 
            eventData?.Setup_Time === undefined || 
            eventData?.Cleanup_Time === undefined) {
          console.error('Error retrieving blocked rooms: missing required data');
          return;
        };

        const eventStart = new Date(eventData.Event_Date.toISOString().split("T")[0] + "T" + getISOTime(eventData.Event_Start_Time!));
        const eventEnd = new Date(eventData.Event_Date.toISOString().split("T")[0] + "T" + getISOTime(eventData.Event_End_Time!));
        
        const pattern = eventData.Recurring_Pattern.length > 0 ? eventData.Recurring_Pattern : [eventData.Event_Date];
        const patternString = pattern.map(date => date?.toISOString().split("T")[0] + "T" + getISOTime(eventData.Event_Start_Time!)).join(",");
        const eventLengthMinutes = (eventEnd.getTime() - eventStart.getTime()) / 60000;
        const setupTime = eventData.Setup_Time;
        const cleanupTime = eventData.Cleanup_Time;
        const locationId = eventData.Location_ID;

        // Check if any of the relevant values have changed
        if (
          prevValues.current.locationId === locationId &&
          prevValues.current.patternString === patternString &&
          prevValues.current.eventLengthMinutes === eventLengthMinutes &&
          prevValues.current.setupTime === setupTime &&
          prevValues.current.cleanupTime === cleanupTime
        ) {
          console.log('No relevant data changed, skipping getBlockedRooms call');
          return;
        }

        // Update the reference values
        prevValues.current = {
          locationId,
          patternString,
          eventLengthMinutes,
          setupTime,
          cleanupTime
        };

        console.log('Retrieving blocked rooms with new data');
        const { data: blockedRoomsData } = await axios.get<BlockedRoom[]>(`/api/events/blocked-rooms`, {
          params: {
            LocationID: locationId,
            PatternString: patternString,
            EventLengthMinutes: eventLengthMinutes,
            SetupTime: setupTime,
            CleanupTime: cleanupTime
          }
        });

        if (!Array.isArray(blockedRoomsData)) {
          console.error('Invalid blocked rooms data received');
          setBlockedRooms([]);
          return;
        }
        setBlockedRooms(blockedRoomsData);
      } catch (error) {
        console.error('Error retrieving blocked rooms', error);
      }
    }

    if (isActive) {
      getBlockedRooms();
    }
  }, [
    isActive,
    eventData?.Location_ID,
    eventData?.Recurring_Pattern,
    eventData?.Event_Date,
    eventData?.Event_Start_Time,
    eventData?.Event_End_Time,
    eventData?.Setup_Time,
    eventData?.Cleanup_Time
  ]);

  return (
    <div className="w-full h-max mx-auto grid grid-cols-2 items-start gap-4 p-1">
      {!currentLocation
        ? <p>Please select a location</p>
        : !filteredBuildings.length
          ? <p>No buildings found for this location</p>
          : filteredBuildings.map((building, index) => {
            const isOpen = openAccordionID === building.Building_ID;
            const isFullWidth = index % 2 === 0 && index === filteredBuildings.length - 1;
            const blockedRoomIDs = blockedRooms.map(room => room.Room_ID);
            return (
              <div key={index} className={cn("h-max border rounded-md [&>*]:rounded-md", isFullWidth && "col-span-2")}>
                <button
                  className="bg-primary w-full p-2 px-4 cursor-pointer flex items-center justify-between text-sm text-primary-foreground"
                  onClick={() => setOpenAccordionID(openAccordionID === building.Building_ID ? undefined : building.Building_ID)}
                  tabIndex={isActive ? 0 : -1}
                >
                  <p>{building.Building_Name}</p>
                  <FontAwesomeIcon icon={faChevronDown} className={cn("transition-transform duration-300 opacity-50", isOpen ? "rotate-180" : "")} />
                </button>
                <div
                  className={cn(
                    "relative bg-primary flex flex-col text-sm overflow-hidden transition-all duration-300 ease-in-out"
                  )}
                  style={{
                    height: isOpen ? `${building.Rooms.length * 28 + 8}px` : '0px'
                  }}
                >
                  {building.Rooms.map((Room, index) => {
                    const hasEventData = eventData && eventData.Selected_Rooms;
                    const isChecked = hasEventData && eventData.Selected_Rooms.includes(Room.Room_ID);
                    const id = `${building.Building_Name}-${Room.Room_Name}`;
                    const isBlocked = blockedRoomIDs.includes(Room.Room_ID);

                    const allowedRooms = building.Rooms.filter(room => !blockedRoomIDs.includes(room.Room_ID));

                    const currBlockedRooms = blockedRooms.filter(r => r.Room_ID === Room.Room_ID);
                    return (
                      <div key={index} className="flex items-center px-2 py-1 last:pb-2 first:pt-2 first:border-t text-primary-foreground">
                        <Checkbox id={id} disabled={!isOpen || isBlocked} checked={isChecked && !isBlocked} onCheckedChange={() => handleRoomChecked(Room.Room_ID)} />
                        <label htmlFor={id} className={cn("px-2 whitespace-nowrap", !isBlocked ? "w-full" : "opacity-50 line-through")}>{Room.Room_Name}</label>

                        {isBlocked && (
                          <Dialog>
                            <DialogTrigger className="mr-auto">
                              <FontAwesomeIcon icon={faCircleInfo}/>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle className="pb-1">{Room.Room_Name} Unavailable</DialogTitle>
                                <DialogDescription className="hidden">Room Unavailable</DialogDescription>
                              </DialogHeader>
                                <div className="max-h-[550px] grid gap-2 p-2 custom-scroller overflow-auto [&_[role='dialog']]:pointer-events-auto">
                                  {currBlockedRooms.map((r, i) => {
                                    const startDate = new Date(new Date(r.Event_Start_Date).getTime() - (new Date().getTimezoneOffset() * 60000));
                                    const endDate = new Date(new Date(r.Event_End_Date).getTime() - (new Date().getTimezoneOffset() * 60000));
                                    return <div key={r.Event_Room_ID}>
                                      <div className="flex justify-between">
                                        <div>
                                          <p className="whitespace-nowrap font-bold">{r.Event_Title}</p>
                                          <p className="whitespace-nowrap text-xs">{new Date(r.Event_Start_Date).toLocaleDateString('en-us', { month: 'short', day: 'numeric', year: 'numeric'})} | {startDate.toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' })} - {endDate.toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' })}</p>
                                        </div>
                                        <Link href={`/?eventId=${r.Event_ID}`} target="_blank" rel="noopener noreferrer">
                                          <Button variant="default" className="px-2">View Event</Button>
                                        </Link>
                                      </div>
                                      {i !== currBlockedRooms.length - 1 && <Separator />}
                                    </div>
                                  })}
                                </div>
                            </DialogContent>
                          </Dialog>
                        )}

                        {index === 0 && building.Rooms.length > 1 && <>
                          <label htmlFor={`${building.Building_Name}-all`} className={cn("px-2 whitespace-nowrap", allowedRooms.length === 0 && "opacity-50")}>Select All</label>
                          <Checkbox id={`${building.Building_Name}-all`} disabled={!isOpen} checked={allowedRooms.length > 0 && allowedRooms.every((room2: MPRoom) => hasEventData && eventData.Selected_Rooms.includes(room2.Room_ID))} onCheckedChange={() => handleAllRoomsChecked(building)} />
                        </>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
      }
    </div>
  );
};

export default FormPage3;
