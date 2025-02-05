"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@awesome.me/kit-10a739193a/icons/classic/light';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

const DateInput = ({ date, setDate, label = "", isActive = true }: { date: Date | undefined, setDate: (date: Date) => void, label?: string, isActive?: boolean }) => {
  return <div>
    <label className="px-1">{label}</label>
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant={"default"}
          className="w-full justify-between text-left font-normal text-primary-foreground"
          tabIndex={isActive ? 0 : -1}
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <FontAwesomeIcon icon={faCalendar} className="h-4 w-4 opacity-50" />
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

export default DateInput;