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

const RegistrationPopup = () => {
  const { eventData, updateEventData } = useCreateEventData();
  const { toast } = useToast();

  const [Registration_Cost, Registration_Open_Date, Registration_Close_Date, Has_Auto_Response, Auto_Response] = [eventData?.Registration_Cost, eventData?.Registration_Open_Date, eventData?.Registration_Close_Date, eventData?.Has_Auto_Response, eventData?.Auto_Response];

  const handleClearForm = () => {

    updateEventData({
      Registration_Cost: 0,
      Registration_Open_Date: undefined,
      Registration_Close_Date: undefined,
      Has_Auto_Response: false,
      Auto_Response: '',
    });
  }

  const handleSaveForm = (e: React.MouseEvent) => {
    const validCost = Registration_Cost !== undefined && Registration_Cost !== null;
    if (validCost && Registration_Open_Date && Registration_Close_Date) {
      updateEventData({
        Registration_Cost: Registration_Cost,
        Registration_Open_Date: Registration_Open_Date,
        Registration_Close_Date: Registration_Close_Date,
        Has_Auto_Response: Has_Auto_Response,
        Auto_Response: Auto_Response,
      });
    } else {
      e.preventDefault(); // Prevent dialog from closing
      const missingFields: string[] = [];

      if (validCost) missingFields.push("Cost");
      if (!Registration_Open_Date) missingFields.push("Registration Open Date");
      if (!Registration_Close_Date) missingFields.push("Registration Close Date");
      toast({
        title: "Missing Required Fields",
        description: `Missing Fields: ${missingFields.join(", ")}`,
        variant: "destructive"
      });
    }
  }

  return <DialogContent>
    <DialogHeader>

      <DialogTitle className="pb-1">Set Up Registration</DialogTitle>
      <DialogDescription className="hidden">Fill out the form below to set up registration for your event.</DialogDescription>
    </DialogHeader>

    <div className="max-h-[550px] grid grid-cols-2 gap-2 p-2 custom-scroller overflow-auto [&_[role='dialog']]:pointer-events-auto">
      <NumberInput
        label="Cost:"
        value={Registration_Cost}
        setValue={(value: number) => updateEventData({ Registration_Cost: value })}
      />

      <DateInput
        label="Registration Open Date:"
        date={Registration_Open_Date}
        setDate={(value: Date) => updateEventData({ Registration_Open_Date: value })}
      />

      <DateInput
        label="Registration Close Date:"
        date={Registration_Close_Date}
        setDate={(value: Date) => updateEventData({ Registration_Close_Date: value })}
      />

      <BooleanInput
        label="Has Auto Response:"
        boolean={Has_Auto_Response}
        setBoolean={(value: boolean) => updateEventData({ Has_Auto_Response: value })}
      />

      {Has_Auto_Response && (
        <TextAreaInput
          label="Auto Response:"
          text={Auto_Response}
          setText={(value: string) => updateEventData({ Auto_Response: value })}
        />
      )}
    </div>

    <Separator />

    <DialogFooter className="p-2 !justify-between">
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

export default RegistrationPopup;