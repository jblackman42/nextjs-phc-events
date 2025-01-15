"use client";
import React, { useState, useEffect, useId } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock } from '@awesome.me/kit-10a739193a/icons/classic/light';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Time from "./Time";

const getUniqueId = (baseId: string) => {
  return `${baseId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

const TextInput = ({ text, setText, placeholder = "", label = "" }: { text: string, setText: (text: string) => void, placeholder?: string, label?: string }) => {
  const baseId = useId();
  const uniqueId = getUniqueId(baseId);

  return <div>
    <label htmlFor={uniqueId}>{label}</label>
    <div className="bg-primary rounded-md h-10 w-full relative border border-input">
      <input
        id={uniqueId}
        value={text}
        onChange={(e) => setText(e.target.value)}
        type="text"
        placeholder={placeholder}
        className="w-full h-full outline-none bg-transparent pl-4 pr-8 text-textHeading"
      />
    </div>
  </div>
}

const NumberInput = ({ value, setValue, min = 0, max = 100, label = "" }: { value: string, setValue: (value: string) => void, min?: number, max?: number, label?: string }) => {
  const baseId = useId();
  const uniqueId = getUniqueId(baseId);

  const handleBlur = () => {
    let validNumber = Number(value);
    if (validNumber < min) {
      validNumber = min;
    }
    if (validNumber > max) {
      validNumber = max;
    }
    setValue(validNumber.toString());
  };

  return <div>
    <label htmlFor={uniqueId}>{label}</label>
    <div className="bg-primary rounded-md h-10 w-full relative border border-input">
      <input
        id={uniqueId}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        type="number"
        className="w-full h-full outline-none bg-transparent pl-4 pr-8 text-textHeading"
        min={0}
        max={100}
      />
    </div>
  </div>
}

const BooleanInput = ({ boolean, setBoolean, label = "" }: { boolean: boolean, setBoolean: (boolean: boolean) => void, label?: string }) => {
  return <div>
    <label>{label}</label>
    <Select
      value={boolean ? "true" : "false"}
      onValueChange={(value) => setBoolean(value === "true")}
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="false">No</SelectItem>
        <SelectItem value="true">Yes</SelectItem>
      </SelectContent>
    </Select>
  </div>
}

const DateInput = ({ date, setDate, label = "" }: { date: Date | undefined, setDate: (date: Date) => void, label?: string }) => {
  return <div>
    <label>{label}</label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"default"}
          className={cn(
            "w-full justify-between text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <FontAwesomeIcon icon={faCalendar} className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date: Date | undefined) => date && setDate(date)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  </div>
}

const TimeInput = ({ time, setTime, label = "" }: {
  time: string | undefined,
  setTime: React.Dispatch<React.SetStateAction<string | undefined>>,
  label?: string
}) => {
  return <div>
    <label>{label}</label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"default"}
          className={cn(
            "w-full justify-between text-left font-normal",
            !time && "text-muted-foreground"
          )}
        >
          {time ? time : <span>Pick a time</span>}
          <FontAwesomeIcon icon={faClock} className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Time
          time={time}
          setTime={setTime}
        />
      </PopoverContent>
    </Popover>
  </div>
}

const CreateEvents = () => {
  const [eventTitle, setEventTitle] = useState<string>("");
  const [eventDate, setEventDate] = useState<Date>();
  const [eventStartTime, setEventStartTime] = useState<string>();
  const [eventEndTime, setEventEndTime] = useState<string>();
  const [estimatedAttendance, setEstimatedAttendance] = useState<string>("0");
  const [displayOnCalendar, setDisplayOnCalendar] = useState<boolean>(false);

  return <div className="w-full h-full">
    <div className="max-w-screen-md mx-auto grid grid-cols-2 gap-4">

      <TextInput text={eventTitle} setText={setEventTitle} label="Event Title:" />

      <NumberInput value={estimatedAttendance} setValue={setEstimatedAttendance} label="Estimated Attendance:" />

      <BooleanInput boolean={displayOnCalendar} setBoolean={setDisplayOnCalendar} label="Display on Calendar:" />

      <DateInput date={eventDate} setDate={setEventDate} label="Event Date:" />

      <TimeInput time={eventStartTime} setTime={setEventStartTime} label="Event Start Time:" />

      <TimeInput time={eventEndTime} setTime={setEventEndTime} label="Event End Time:" />

    </div>
  </div>
};

export default CreateEvents;