"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faAngleLeft, faAngleRight } from '@awesome.me/kit-10a739193a/icons/classic/solid';
import { cn } from "@/lib/util";
import { useState } from "react";


const MonthSelector = ({ value, onValueChange }: { value: Date, onValueChange: (val: Date) => void }) => {
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [tempYear, setTempYear] = useState(value.getUTCFullYear());
  const today = new Date();
  const minYear = 2021;
  const maxYear = today.getUTCFullYear();

  const handleYearChange = (increment: -1 | 1) => {
    if ((increment < 0 && tempYear > minYear) || (increment > 0 && tempYear < maxYear)) {
      setTempYear(x => x + increment);
    }
  }

  const handleDateChange = (date: Date) => {
    onValueChange(date);
    setSelectorOpen(false);
  }

  return (
    <Popover open={selectorOpen} onOpenChange={setSelectorOpen}>
      <PopoverTrigger className="bg-primary rounded-md border px-3 py-2 text-sm flex justify-between items-center">
        <span>{months[value.getUTCMonth()]} {value.getUTCFullYear()}</span>
        <FontAwesomeIcon icon={faCalendar} />
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <div className="w-full flex justify-between items-center">
          <button onClick={() => handleYearChange(-1)} className="w-8 aspect-square rounded-sm bg-background hover:bg-accent transition-colors"><FontAwesomeIcon icon={faAngleLeft} /></button>
          <p className="text-lg font-semibold text-white">{tempYear}</p>
          <button onClick={() => handleYearChange(1)} className="w-8 aspect-square rounded-sm bg-background hover:bg-accent transition-colors"><FontAwesomeIcon icon={faAngleRight} /></button>
        </div>
        <div className="grid grid-cols-4 gap-1 mt-2">
          {months.map((month, i) => <button key={i} onClick={() => handleDateChange(new Date(Date.UTC(tempYear, i, 1)))} className={cn(i === value.getUTCMonth() && tempYear === value.getUTCFullYear() ? "bg-muted" : "bg-background", "hover:bg-accent rounded-sm p-2")}>{month}</button>)}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default MonthSelector;