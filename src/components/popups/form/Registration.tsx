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


import { Button } from "@/components/ui/button";

import { useCreateEventData } from "@/context/CreateEventContext";


import { NumberInput, DateInput, BooleanInput, TextAreaInput } from '@/components/inputs';
import { useToast } from "@/components/ui/use-toast";

const RegistrationPopup = () => {
  const { eventData, updateEventData } = useCreateEventData();
  const { toast } = useToast();

  const [cost, setCost] = useState(eventData?.Registration_Cost);
  const [registrationOpenDate, setRegistrationOpenDate] = useState<Date | undefined>(eventData?.Registration_Open_Date);
  const [registrationCloseDate, setRegistrationCloseDate] = useState<Date | undefined>(eventData?.Registration_Close_Date);
  const [hasAutoResponse, setHasAutoResponse] = useState(eventData?.Has_Auto_Response);
  const [autoResponse, setAutoResponse] = useState(eventData?.Auto_Response);


  const handleClearForm = () => {
    setCost(0);
    setRegistrationOpenDate(undefined);
    setRegistrationCloseDate(undefined);
    setHasAutoResponse(false);
    setAutoResponse('');

    updateEventData({
      Registration_Cost: 0,
      Registration_Open_Date: undefined,
      Registration_Close_Date: undefined,
      Has_Auto_Response: false,
      Auto_Response: '',
    });
  }

  const handleSaveForm = (e: React.MouseEvent) => {
    const validCost = cost !== undefined && cost !== null;
    if (validCost && registrationOpenDate && registrationCloseDate) {
      updateEventData({
        Registration_Cost: cost,
        Registration_Open_Date: registrationOpenDate,
        Registration_Close_Date: registrationCloseDate,
        Has_Auto_Response: hasAutoResponse,
        Auto_Response: autoResponse,
      });
    } else {
      e.preventDefault(); // Prevent dialog from closing
      const missingFields: string[] = [];

      if (validCost) missingFields.push("Cost");
      if (!registrationOpenDate) missingFields.push("Registration Open Date");
      if (!registrationCloseDate) missingFields.push("Registration Close Date");
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
        value={cost}
        setValue={(value: number) => setCost(value)}
      />

      <DateInput
        label="Registration Open Date:"
        date={registrationOpenDate}
        setDate={setRegistrationOpenDate}
      />

      <DateInput
        label="Registration Close Date:"
        date={registrationCloseDate}
        setDate={setRegistrationCloseDate}
      />

      <BooleanInput
        label="Has Auto Response:"
        boolean={hasAutoResponse}
        setBoolean={setHasAutoResponse}
      />

      {hasAutoResponse && (
        <TextAreaInput
          label="Auto Response:"
          text={autoResponse}
          setText={setAutoResponse}
        />
      )}
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

export default RegistrationPopup;