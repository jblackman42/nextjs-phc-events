"use client";
import React, { useState, useEffect } from 'react';
import { getEquipment } from "@/app/actions";
import { cn } from "@/lib/util";
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
import { EquipmentType } from '@/lib/types';

const FacilitiesPopup = () => {
  const { eventData, updateEventData } = useCreateEventData();
  const { toast } = useToast();

  const [equipment, setEquipment] = useState<EquipmentType[]>([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      const equipment = await getEquipment();
      setEquipment(equipment);
    }
    fetchEquipment();
  }, [eventData]);

  const handleClearForm = () => {
    console.log("clear form");
  }

  const handleSaveForm = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("save form");
  }

  return <DialogContent>
    <DialogHeader>

      <DialogTitle className="pb-1">Set Up Facilities</DialogTitle>
      <DialogDescription className="hidden">Fill out the form below to set up facilities for your event.</DialogDescription>
    </DialogHeader>

    <div className="max-h-[550px] grid gap-2 p-2 custom-scroller overflow-auto [&_[role='dialog']]:pointer-events-auto">
      <BooleanInput label="Onsite Facilities Employee" boolean={false} setBoolean={() => {}} />
      {Array.from(new Set(equipment.map(e => e.Equipment_Type))).sort((a, b) => {
        if (a.toLowerCase() === 'other') return 1;
        if (b.toLowerCase() === 'other') return -1;
        return a.localeCompare(b);
      }).map(type => (
        <div key={type}>
          <p className="text-lg px-2">{type}:</p>
          {/* <Separator /> */}
          <div className="border rounded-md p-2 grid grid-cols-2 gap-2">
            {equipment.filter(e => e.Equipment_Type === type).map((e, i) => (
              <div key={e.Equipment_ID} className={cn(i % 2 === 0 && i === equipment.filter(e => e.Equipment_Type === type).length - 1 ? "col-span-2" : "col-span-1")}>
                <NumberInput label={e.Equipment_Name} value={0} setValue={(value) => {
                  console.log(value);
                }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <Separator />

    <DialogFooter className="p-2 !justify-between">
      <DialogClose asChild>

        <Button variant="destructive" className="h-8 py-1" onClick={handleClearForm}>
          Cancel Facilities
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

export default FacilitiesPopup;