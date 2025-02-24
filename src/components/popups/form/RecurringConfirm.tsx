"use client";
import React, { useEffect, useState } from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

import { useCreateEventData } from "@/context/CreateEventContext";

const getOrdinalSuffix = (value: number | string): string => {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;

  if (isNaN(num)) {
    throw new Error('Invalid input: not a number');
  }

  const remainder = num % 100;

  if (remainder >= 11 && remainder <= 13) {
    return 'th';
  }

  switch (num % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

const RecurringConfirm = ({ open, onOpenChange, setRecurringOpen }: { open: boolean, onOpenChange: (open: boolean) => void, setRecurringOpen: (open: boolean) => void }) => {
  const { eventData, updateEventData } = useCreateEventData();
  const { toast } = useToast();

  const [tempRecurringPattern, setTempRecurringPattern] = useState<Date[]>([]);

  const handleBack = () => {
    setRecurringOpen(true);
  }

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (tempRecurringPattern.length === 0) {
      toast({
        title: "No dates selected",
        description: "Please select at least one date",
        variant: "destructive"
      });
      return;
    }

    updateEventData({ Recurring_Pattern: tempRecurringPattern });
    onOpenChange(false);

  }

  const handleCheckedChange = (checked: boolean, date: Date) => {
    if (checked) {
      setTempRecurringPattern([...tempRecurringPattern, date]);
    } else {
      setTempRecurringPattern(tempRecurringPattern.filter(d => d !== date));
    }
  }

  useEffect(() => {
    setTempRecurringPattern(eventData?.Recurring_Pattern || []);
  }, [eventData]);



  return <DialogContent>
    <DialogHeader>

      <DialogTitle className="pb-1">Confirm Reccuring Event</DialogTitle>
      <DialogDescription className="hidden">Fill out the form below to set up recurring events.</DialogDescription>
    </DialogHeader>
    <div className="max-h-[550px] p-2 custom-scroller overflow-auto">
      <div className="w-full flex justify-center gap-2">
        <div className="">
          {eventData && eventData.Recurring_Pattern.map((_, i) => <p key={i} className="text-right">{i + 1}.</p>)}
        </div>

        <div>
          {eventData && eventData.Recurring_Pattern.map((date, index) => {

            const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
            const month = date.toLocaleDateString('en-US', { month: 'short' });
            const day = date.toLocaleDateString('en-US', { day: 'numeric' });
            const ordinalSuffix = getOrdinalSuffix(day);
            const year = date.toLocaleDateString('en-US', { year: 'numeric' });

            return (
              <div key={index} className="flex">
                <Checkbox id={`recurring-${index}`} checked={tempRecurringPattern.includes(date)} onCheckedChange={(checked) => handleCheckedChange(checked === true, date)} />
                <label htmlFor={`recurring-${index}`} className="pl-2">
                  {weekday}, {month} {day}<sup>{ordinalSuffix}</sup> {year}
                </label>

              </div>
            )
          })}
        </div>
      </div>
    </div>

    <Separator />

    <DialogFooter className="p-2 !justify-between">
      <DialogClose asChild>
        <Button variant="default" className="h-8 py-1" onClick={handleBack}>
          Back
        </Button>
      </DialogClose>

      <DialogClose asChild>
        <Button
          variant="secondary"
          className="h-8 py-1"
          onClick={handleSave}
        >
          Save
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
}

export default RecurringConfirm;