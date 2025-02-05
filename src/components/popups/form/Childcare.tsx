"use client";
import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const ChildcarePopup = () => {
  return <DialogContent>
    <DialogHeader>
      <DialogTitle>Childcare</DialogTitle>
      <DialogDescription>Set Up Childcare</DialogDescription>
    </DialogHeader>
    <div className="max-h-[550px] grid gap-2 p-2 custom-scroller overflow-auto">
      <p>This is the childcare popup</p>
    </div>
  </DialogContent>
}

export default ChildcarePopup;