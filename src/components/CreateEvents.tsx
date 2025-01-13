"use client";
import React, { useState } from "react"
import { useUser } from '@/context/UserContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Time from "./Time";



const TextInput = () => {
  return (
    <div className="bg-primary rounded-md h-10 w-full relative border border-input">
      <input
        type="text"
        placeholder="Search events"
        className="w-full h-full outline-none bg-transparent pl-4 pr-8 text-textHeading"
      />
    </div>
  )
}

const DateInput = () => {
  const [date, setDate] = useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

const TimeInput = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !true && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {/* {date ? format(date, "PPP") : <span>Pick a date</span>} */}
          <span>Pick a time</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Time />
      </PopoverContent>
    </Popover>
  )
}

const CreateEvents = () => {
  const { user } = useUser();
  console.log(user);
  return <div className="w-full h-full">
    <div className="max-w-screen-md mx-auto">
      <p>Event Creator: <span className="font-bold">{user.nickname} {user.family_name}</span></p>



      <TextInput />

      <DateInput />

      <TimeInput />

      <Select value="month">
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="month">Month</SelectItem>
          <SelectItem value="week" className="hidden md:block">Week</SelectItem>
          <SelectItem value="day">Day</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
};

export default CreateEvents;