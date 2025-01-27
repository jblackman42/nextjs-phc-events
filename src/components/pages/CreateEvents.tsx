"use client";
import React, { useState, useEffect, useRef } from "react";

import { getCreateEventValues, getLocations } from "@/app/actions";
import { CreateEventValue, MPLocation } from "@/lib/types";

import { TextInput, NumberInput, BooleanInput, DateInput, TimeInput, DropdownInput, TextAreaInput } from "@/components/inputs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FormPage = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full mx-auto grid grid-cols-2 gap-4">
    {children}
  </div>
}

const CreateEvents = () => {
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

  const [buildings, setBuildings] = useState<MPLocation[]>([]);
  const [eventValues, setEventValues] = useState<CreateEventValue[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const previousPageIndex = useRef<number>(0);
  const [currentBuilding, setCurrentBuilding] = useState<MPLocation>();


  const handlePageChange = (newIndex: number) => {
    previousPageIndex.current = currentPageIndex;
    setCurrentPageIndex(newIndex);
  };

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
      console.log(buildings);
      setBuildings(buildings);
    };

    fetchEventValues();
    fetchBuildings();
  }, []);

  useEffect(() => {
    setCurrentBuilding(buildings.find(building => building.Location_ID === location));
  }, [location, buildings]);

  const PageOne = () => {
    return <FormPage>
      <TextInput text={eventTitle} setText={setEventTitle} label="Event Title:" />

      <DropdownInput
        value={location}
        options={eventValues.find(value => value.Name === "Location")}
        setValue={setLocation}
      />

      <DateInput date={eventDate} setDate={setEventDate} label="Event Date:" />

      <TimeInput time={eventStartTime} setTime={setEventStartTime} label="Event Start Time:" />

      <TimeInput time={eventEndTime} setTime={setEventEndTime} label="Event End Time:" />

      <DropdownInput
        value={primaryContact}
        options={eventValues.find(value => value.Name === "Primary Contact")}
        setValue={setPrimaryContact}
      />

      <DropdownInput
        value={eventType}
        options={eventValues.find(value => value.Name === "Event Type")}
        setValue={setEventType}
      />

      <NumberInput value={estimatedAttendance} setValue={setEstimatedAttendance} label="Estimated Attendance:" />

      <DropdownInput
        value={congregation}
        options={eventValues.find(value => value.Name === "Congregation")}
        setValue={setCongregation}
      />

      <NumberInput value={setupMinutes} setValue={setSetupMinutes} label="Setup Time (Minutes):" />

      <NumberInput value={cleanUpMinutes} setValue={setCleanUpMinutes} label="Cleanup Time (Minutes):" />

      <BooleanInput boolean={displayOnCalendar} setBoolean={setDisplayOnCalendar} label="Display on Public Calendar:" />

      <TextAreaInput text={eventDescription} setText={setEventDescription} label="Event Description:" />
    </FormPage>
  }

  const PageTwo = () => {
    return <FormPage>
      <p>Page Two</p>
    </FormPage>
  }

  const PageThree = () => {

    return <FormPage>
      {!currentBuilding
      ? <p>Please select a location</p>
      : !currentBuilding.Buildings.length
      ? <p>No buildings found for this location</p>
      : currentBuilding.Buildings.map((building, index) => {
        return (
          <p key={index}>{building.Building_Name}</p>
        )
      })}
    </FormPage>
  }

  const pageContainerRef = useRef<HTMLDivElement>(null);
  const pages = [PageOne, PageTwo, PageThree];

  return <div className="max-w-screen-md h-full mx-auto flex flex-col justify-center">
    <div className="w-full my-2">
      <div className="flex gap-4">
        {pages.map((_, index) => {
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
          width: `${pages.length * 100}%`,
          transform: `translateX(-${currentPageIndex * (100 / pages.length)}%)`
        }}
      >
        {pages.map((Page, index) => (
          <div key={index} className="w-full">
            <Page />
          </div>
        ))}
      </div>
    </div>
    <div className="w-full my-2 flex justify-between">
      <Button variant="thin" disabled={currentPageIndex === 0} onClick={() => handlePageChange(currentPageIndex - 1)}>Previous</Button>
      <Button variant="thin" disabled={currentPageIndex === pages.length - 1} onClick={() => handlePageChange(currentPageIndex + 1)}>Next</Button>
    </div>
  </div>
};

export default CreateEvents;