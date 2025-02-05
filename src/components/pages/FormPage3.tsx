"use client";
import React from "react";

import { MPLocation, MPBuildingWithRooms, MPRoom } from "@/lib/types";
import { cn } from "@/lib/utils";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@awesome.me/kit-10a739193a/icons/classic/solid";
import { Checkbox } from "@/components/ui/checkbox";

import { useCreateEventData } from "@/context/CreateEventContext";

interface FormPage3Props {
  isActive: boolean;
  allLocations: MPLocation[];
  openAccordionID: number | undefined;
  setOpenAccordionID: (id: number | undefined) => void;
}

const FormPage3 = ({ isActive, allLocations, openAccordionID, setOpenAccordionID }: FormPage3Props) => {
  const { eventData, updateEventData } = useCreateEventData();
  const currentLocation = allLocations.find(location => location.Location_ID === eventData?.Location_ID);
  const filteredBuildings = currentLocation?.Buildings.filter(building => building.Rooms.length > 0) || [];

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
    const buildingRoomIDs = building.Rooms.map((room: MPRoom) => room.Room_ID);
    const allRoomsSelected = buildingRoomIDs.every((id: number) => eventData.Selected_Rooms.includes(id));

    if (allRoomsSelected) {
      // Remove all rooms in this building
      updateEventData({ ...eventData, Selected_Rooms: eventData.Selected_Rooms.filter(id => !buildingRoomIDs.includes(id)) });
    } else {
      // Add all rooms in this building
      updateEventData({ ...eventData, Selected_Rooms: [...eventData.Selected_Rooms, ...buildingRoomIDs.filter(id => !eventData.Selected_Rooms.includes(id))] });
    }

  }

  return (
    <div className="w-full h-max mx-auto grid grid-cols-2 items-start gap-4 p-1">
      {!currentLocation
        ? <p>Please select a location</p>
        : !filteredBuildings.length
          ? <p>No buildings found for this location</p>
          : filteredBuildings.map((building, index) => {
            const isOpen = openAccordionID === building.Building_ID;
            const isFullWidth = index % 2 === 0 && index === filteredBuildings.length - 1;
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

                    return (
                      <div key={index} className="flex items-center px-2 py-1 last:pb-2 first:pt-2 first:border-t text-primary-foreground">
                        <Checkbox id={id} disabled={!isOpen} checked={isChecked} onCheckedChange={() => handleRoomChecked(Room.Room_ID)} />
                        <label htmlFor={id} className="w-full px-2">{Room.Room_Name}</label>
                        {index === 0 && building.Rooms.length > 1 && <>
                          <label htmlFor={`${building.Building_Name}-all`} className="px-2 whitespace-nowrap">Select All</label>
                          <Checkbox id={`${building.Building_Name}-all`} disabled={!isOpen} checked={building.Rooms.every(room2 => hasEventData && eventData.Selected_Rooms.includes(room2.Room_ID))} onCheckedChange={() => handleAllRoomsChecked(building)} />
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
