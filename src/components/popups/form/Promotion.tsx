"use client";
import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const PromotionPopup = () => {
  return <DialogContent>
    <DialogHeader>
      <DialogTitle>Promotion</DialogTitle>
      <DialogDescription>Set Up Promotion</DialogDescription>
    </DialogHeader>
    <div className="max-h-[550px] grid gap-2 p-2 custom-scroller overflow-auto">
      <p>This is the promotion popup</p>
    </div>
  </DialogContent>
}

export default PromotionPopup;