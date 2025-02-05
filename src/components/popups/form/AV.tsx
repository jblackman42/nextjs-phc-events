"use client";
import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const AVPopup = () => {
  return <DialogContent>
    <DialogHeader>
      <DialogTitle>AV</DialogTitle>
      <DialogDescription>Set Up AV</DialogDescription>
    </DialogHeader>
    <div className="max-h-[550px] grid gap-2 p-2 custom-scroller overflow-auto">
      <p>This is the AV popup</p>
    </div>
  </DialogContent>
}

export default AVPopup;