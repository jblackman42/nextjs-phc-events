"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesUpDown, faCheck } from '@awesome.me/kit-10a739193a/icons/classic/light';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";

import { CreateEventValue } from "@/lib/types";

const DropdownInput = ({ value = 0, setValue, options }: {
  value?: number;
  setValue: (value: number) => void;
  options?: CreateEventValue;
}) => {
  const [open, setOpen] = useState(false);
  if (!options) return (
    <div className="grid gap-2">
      <Skeleton className="h-4 w-32 rounded-md" />
      <Skeleton className="h-10 w-full" />
    </div>
  );

  const { Name, Labels, Values } = options;
  return <Popover open={open} onOpenChange={setOpen}>
    <div>
      <label>{Name}:</label>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? Labels[Values.indexOf(value)]
            : `Select ${Name}...`}
          <FontAwesomeIcon icon={faAnglesUpDown} className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
    </div>
    <PopoverContent className="w-auto p-0">
      <Command>
        <CommandInput placeholder={`Search ${Name}...`} />
        <CommandList>
          <CommandEmpty>No {Name} found.</CommandEmpty>
          <CommandGroup>
            {Labels.map((label, index) => (
              <CommandItem
                key={Values[index]}
                value={label.toLowerCase()}
                onSelect={(currentValue) => {
                  setValue(currentValue === value.toString() ? 0 : Values[index])
                  setOpen(false)
                }}
              >
                <FontAwesomeIcon icon={faCheck}
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === Values[index] ? "opacity-100" : "opacity-0"
                  )}
                />
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
}

export default DropdownInput;