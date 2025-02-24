"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/util";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faAnglesUpDown } from '@awesome.me/kit-10a739193a/icons/classic/light';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const BooleanInput = ({ boolean = false, setBoolean, label = "", isActive = true }: { boolean?: boolean, setBoolean: (boolean: boolean) => void, label?: string, isActive?: boolean }) => {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(boolean ? 1 : 0);

  useEffect(() => {
    if (open) {
      // Reset highlighted index based on current value when opening
      setHighlightedIndex(boolean ? 1 : 0);
    }
  }, [open, boolean]);

  return <div>
    <label className="px-1">{label}</label>
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground border border-input hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full justify-between"
          tabIndex={isActive ? 0 : -1}
        >
          <span>{boolean ? "Yes" : "No"}</span>
          <FontAwesomeIcon icon={faAnglesUpDown} className="h-4 w-4 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div
          role="listbox"
          tabIndex={0}
          className="focus:outline-none"
          onKeyDown={(e) => {
            switch (e.key) {
              case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => Math.max(0, prev - 1));
                break;
              case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => Math.min(1, prev + 1));
                break;
              case 'Enter':
                e.preventDefault();
                setBoolean(highlightedIndex === 1);
                setOpen(false);
                break;
            }
          }}
        >
          <div
            role="option"
            aria-selected={!boolean}
            className={cn(
              "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent",
              highlightedIndex === 0 && "bg-accent"
            )}
            onClick={() => {
              setBoolean(false);
              setOpen(false);
            }}
          >
            <FontAwesomeIcon
              icon={faCheck}
              className={cn(
                "mr-2 h-4 w-4",
                !boolean ? "opacity-100" : "opacity-0"
              )}
            />
            No
          </div>
          <div
            role="option"
            aria-selected={boolean}
            className={cn(
              "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent",
              highlightedIndex === 1 && "bg-accent"
            )}
            onClick={() => {
              setBoolean(true);
              setOpen(false);
            }}
          >
            <FontAwesomeIcon
              icon={faCheck}
              className={cn(
                "mr-2 h-4 w-4",
                boolean ? "opacity-100" : "opacity-0"
              )}
            />
            Yes
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
}

export default BooleanInput;