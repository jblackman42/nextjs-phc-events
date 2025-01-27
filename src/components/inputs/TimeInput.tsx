"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@awesome.me/kit-10a739193a/icons/classic/light';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import Time from "@/components/inputs/Time";

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

export default TimeInput;