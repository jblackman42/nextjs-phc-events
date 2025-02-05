"use client";
import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const FacilitiesPopup = () => {
  return <DialogContent>
    <DialogHeader>
      <DialogTitle>Facilities</DialogTitle>
      <DialogDescription>Set Up Facilities</DialogDescription>
    </DialogHeader>
    <div className="max-h-[550px] grid gap-2 p-2 custom-scroller overflow-auto">
      <p>This is the childcare popup</p>
    </div>
  </DialogContent>
}

export default FacilitiesPopup;