"use client";
import React, { useState } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import { Button } from "@/components/ui/button";

import { useCreateEventData } from "@/context/CreateEventContext";


import { NumberInput, DateInput, BooleanInput, TextAreaInput } from '@/components/inputs';
import { useToast } from "@/components/ui/use-toast";

const HeartCrewPopup = () => {
  const { eventData, updateEventData } = useCreateEventData();
  const { toast } = useToast();

  const handleClearForm = () => {
    console.log("clear form");
  }

  const handleSaveForm = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("save form");
  }

  return <DialogContent>
    <DialogHeader>

      <DialogTitle className="pb-1">Set Up a Heart Crew</DialogTitle>
      <DialogDescription className="hidden">Fill out the form below to set up a Heart Crew for your event.</DialogDescription>
    </DialogHeader>

    <div className="max-h-[550px] grid grid-cols-2 gap-2 p-2 custom-scroller overflow-auto [&_[role='dialog']]:pointer-events-auto">
      <p>Form Fields Go Here</p>
    </div>

    <Separator />

    <DialogFooter className="p-2 !justify-between">
      <DialogClose asChild>

        <Button variant="destructive" className="h-8 py-1" onClick={handleClearForm}>
          Cancel Heart Crew
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

export default HeartCrewPopup;