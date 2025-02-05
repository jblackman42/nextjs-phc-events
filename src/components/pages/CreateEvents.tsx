"use client";
import React, { useState, useEffect, useRef } from "react";

import { getCreateEventValues, getLocations } from "@/app/actions";
import { CreateEventValue, MPLocation } from "@/lib/types";

import { CreateEventProvider, useCreateEventData } from "@/context/CreateEventContext";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


import { FormPage1, FormPage2, FormPage3 } from "@/components/pages";

const numOfPages = 3;

const CreateEvents = () => {
  const { eventData } = useCreateEventData();

  const [eventTitle, setEventTitle] = useState<string>("");
  const [eventDate, setEventDate] = useState<Date>();
  const [eventStartTime, setEventStartTime] = useState<string>();
  const [eventEndTime, setEventEndTime] = useState<string>();
  const [estimatedAttendance, setEstimatedAttendance] = useState<string>("0");
  const [displayOnCalendar, setDisplayOnCalendar] = useState<boolean>(false);
  const [setupMinutes, setSetupMinutes] = useState<string>("0");
  const [cleanUpMinutes, setCleanUpMinutes] = useState<string>("0");
  const [eventDescription, setEventDescription] = useState<string>("");

  const [location, setLocation] = useState<number>();
  const [primaryContact, setPrimaryContact] = useState<number>();
  const [eventType, setEventType] = useState<number>();
  const [congregation, setCongregation] = useState<number>();

  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);

  const [allLocations, setAllLocations] = useState<MPLocation[]>([]);
  const [eventValues, setEventValues] = useState<CreateEventValue[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const previousPageIndex = useRef<number>(0);
  const [currentLocation, setCurrentLocation] = useState<MPLocation>();

  // Add openAccordions state at the component level
  const [openAccordionID, setOpenAccordionID] = useState<number>();

  const handlePageChange = (newIndex: number) => {
    previousPageIndex.current = currentPageIndex;
    setCurrentPageIndex(newIndex);
  };

  // Fetch event values and locations
  useEffect(() => {
    const fetchEventValues = async () => {
      const eventValues = await getCreateEventValues();
      const sortedEventValues = eventValues.sort((a, b) => a.Sort_Order - b.Sort_Order);
      const [locations, primaryContacts, eventTypes, congregations] = sortedEventValues;
      setEventValues(sortedEventValues);

      setLocation(locations.Default_ID);
      setPrimaryContact(primaryContacts.Default_ID);
      setEventType(eventTypes.Default_ID);
      setCongregation(congregations.Default_ID);
    };

    const fetchBuildings = async () => {
      const buildings = await getLocations();
      setAllLocations(buildings);
    };

    fetchEventValues();
    fetchBuildings();
  }, []);

  // Set the current building based on the location input
  useEffect(() => {
    setCurrentLocation(allLocations.find(building => building.Location_ID === location));
  }, [location, allLocations]);

  const pageContainerRef = useRef<HTMLDivElement>(null);


  return (
    <div className="max-w-screen-md h-full mx-auto flex flex-col justify-center">
      <div className="w-full my-2">
        <div className="flex gap-4">

          {Array.from({ length: numOfPages }, (_, index) => {
            const indexDiff = Math.abs(currentPageIndex - previousPageIndex.current);
            const transitionDelay = indexDiff > 1 ? ((index - 1) - previousPageIndex.current) * 300 : 0;

            return <div key={index} className={cn(index !== 0 && "w-full", "flex items-center gap-4")}>
              {index !== 0 && <div className={cn(
                currentPageIndex >= index ? "bg-accent after:w-full" : "after:w-0",
                "w-full h-[6px] border rounded-full bg-primary relative overflow-hidden"
              )}>
                <div
                  className="absolute inset-0 bg-accent origin-left"
                  style={{
                    transform: currentPageIndex >= index ? 'scaleX(1)' : 'scaleX(0)',
                    transition: 'transform 300ms ease-in-out',
                    transitionDelay: `${transitionDelay}ms`
                  }} />
              </div>}
              <Button
                variant="icon"
                onClick={() => handlePageChange(index)}
                className={cn(
                  currentPageIndex >= index ? "border-accent" : "",
                  "hover:bg-primary border-2 transition-colors duration-300 ease-in-out",
                  "transition-delay-[" + (transitionDelay + 300) + "ms]"
                )}>
                <h1 className={cn(
                  currentPageIndex >= index ? "text-accent" : "",
                  "text-md transition-colors duration-200 ease-in-out",
                  "transition-delay-[" + transitionDelay + "ms]"
                )}>{index + 1}</h1>
              </Button>
            </div>
          })}
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <div
          className="w-[768px] flex transition-transform duration-300 ease-in-out"
          ref={pageContainerRef}
          style={{
            width: `${numOfPages * 100}%`,
            transform: `translateX(-${currentPageIndex * (100 / numOfPages)}%)`
          }}
        >

          {/* Page 1 ------------------------------------------------------------------------------------------------- */}

          <FormPage1
            isActive={currentPageIndex === 0}
            eventValues={eventValues}
          />

          {/* Page 2 ------------------------------------------------------------------------------------------------- */}

          <FormPage2
            isActive={currentPageIndex === 1}
          />

          {/* Page 3 ------------------------------------------------------------------------------------------------- */}

          <FormPage3
            isActive={currentPageIndex === 2}
            allLocations={allLocations}
            openAccordionID={openAccordionID}
            setOpenAccordionID={setOpenAccordionID}
          />
        </div>
      </div>
      <div className="w-full my-2 flex justify-between">

        <Button variant="thin" disabled={currentPageIndex === 0} onClick={() => handlePageChange(currentPageIndex - 1)}>Previous</Button>
        {currentPageIndex !== numOfPages - 1 && <Button variant="thin" onClick={() => handlePageChange(currentPageIndex + 1)}>Next</Button>}
        {currentPageIndex === numOfPages - 1 && <Button variant="secondary" onClick={() => console.log(eventData)}>Submit</Button>}

      </div>
    </div>

  );
};


export default CreateEvents;