"use client";
import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const HeartCrewPopup = () => {
  return <DialogContent>
    <DialogHeader>
      <DialogTitle>Heart Crew</DialogTitle>
      <DialogDescription>Set Up Heart Crew</DialogDescription>
    </DialogHeader>
    <div className="max-h-[550px] grid gap-2 p-2 custom-scroller overflow-auto">
      <p>This is the heart crew popup</p>
    </div>
  </DialogContent>

}

export default HeartCrewPopup;