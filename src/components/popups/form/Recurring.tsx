"use client";
import React, { useEffect } from 'react';
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

import { useCreateEventData } from "@/context/CreateEventContext";
import { useToast } from "@/components/ui/use-toast";

const RecurringPopup = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const { eventData } = useCreateEventData();
  const { toast } = useToast();

  const handleClearForm = () => {
    onOpenChange(false);
  }

  const handleSaveForm = () => {
    onOpenChange(false);
  }

  useEffect(() => {
    if (open && (!eventData?.Event_Date || !eventData?.Event_Start_Time || !eventData?.Event_End_Time)) {

      const missingFields: string[] = [];
      if (!eventData?.Event_Date) missingFields.push("Event Date");
      if (!eventData?.Event_Start_Time) missingFields.push("Event Start Time");
      if (!eventData?.Event_End_Time) missingFields.push("Event End Time");

      onOpenChange(false);
      toast({
        title: "Missing Required Fields",
        description: `Missing Fields: ${missingFields.join(", ")}`,
        variant: "destructive"
      });
    }
  }, [open]);

  return <DialogContent>
    <DialogHeader>
      <DialogTitle className="pb-1">Set Up Reccuring Event</DialogTitle>
      <DialogDescription className="hidden">Fill out the form below to set up recurring events.</DialogDescription>
    </DialogHeader>
    <div className="max-h-[550px] grid gap-2 custom-scroller overflow-auto">

      <div className="w-full flex">
        <button className="w-full p-2 hover:bg-accent hover:text-accent-foreground transition-colors duration-200">Daily</button>
        <Separator orientation="vertical" />
        <button className="w-full p-2 hover:bg-accent hover:text-accent-foreground transition-colors duration-200">Weekly</button>
        <Separator orientation="vertical" />
        <button className="w-full p-2 hover:bg-accent hover:text-accent-foreground transition-colors duration-200">Monthly</button>



      </div>

    </div>


    <DialogFooter className="px-2 pb-2 !justify-between">
      <DialogClose asChild>
        <Button variant="destructive" className="h-8 py-1" onClick={handleClearForm}>
          Cancel Registration
        </Button>
      </DialogClose>

      <DialogClose asChild>
        <Button
          variant="secondary"
          className="h-8 py-1"
          onClick={handleSaveForm}
          type="submit"
        >
          Save
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
}

export default RecurringPopup;