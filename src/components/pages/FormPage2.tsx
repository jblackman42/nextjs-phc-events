"use client";
import React, { useState } from "react";


import {
  Dialog,
  DialogTrigger
} from "@/components/ui/dialog";
import { RegistrationPopup, ChildcarePopup, FacilitiesPopup, PromotionPopup, RecurringPopup, HeartCrewPopup, AVPopup } from "@/components/popups/form";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faChildReaching, faHammer, faRectangleAd, faCalendarDays, faPeopleGroup, faMicrophone } from "@awesome.me/kit-10a739193a/icons/classic/light";

import { useCreateEventData } from "@/context/CreateEventContext";
import { cn } from "@/lib/utils";

type FormPage2Props = {
  isActive: boolean;
};


const FormPage2 = ({
  isActive
}: FormPage2Props) => {
  const { eventData } = useCreateEventData();

  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isChildcareOpen, setIsChildcareOpen] = useState(false);
  const [isFacilitiesOpen, setIsFacilitiesOpen] = useState(false);
  const [isPromotionOpen, setIsPromotionOpen] = useState(false);
  const [isRecurringOpen, setIsRecurringOpen] = useState(false);
  const [isHeartCrewOpen, setIsHeartCrewOpen] = useState(false);
  const [isAVOpen, setIsAVOpen] = useState(false);

  return (
    <div className="w-full h-max mx-auto grid grid-cols-2 items-start gap-4 p-1">
      <Dialog open={isRegistrationOpen} onOpenChange={setIsRegistrationOpen}>
        <RegistrationPopup />
        <DialogTrigger asChild>
          <Button
            variant={"default"}
            className={cn("w-full justify-between text-left font-normal text-primary-foreground", eventData?.Registration ? "bg-accent" : "")}
            tabIndex={isActive ? 0 : -1}
          >
            <span>{eventData?.Registration ? "Edit Registration" : "Set Up Registration"}</span>
            <FontAwesomeIcon icon={faClipboard} className="h-4 w-4 opacity-50" />
          </Button>
        </DialogTrigger>
      </Dialog>

      <Dialog open={isChildcareOpen} onOpenChange={setIsChildcareOpen}>
        <ChildcarePopup />
        <DialogTrigger asChild>
          <Button
            variant={"default"}
            className="w-full justify-between text-left font-normal text-primary-foreground"
            tabIndex={isActive ? 0 : -1}
          >
            <span>Set Up Childcare</span>
            <FontAwesomeIcon icon={faChildReaching} className="h-4 w-4 opacity-50" />
          </Button>
        </DialogTrigger>
      </Dialog>

      <Dialog open={isPromotionOpen} onOpenChange={setIsPromotionOpen}>
        <PromotionPopup />
        <DialogTrigger asChild>
          <Button
            variant={"default"}
            className="w-full justify-between text-left font-normal text-primary-foreground"
            tabIndex={isActive ? 0 : -1}
          >
            <span>Set Up Promotion</span>
            <FontAwesomeIcon icon={faRectangleAd} className="h-4 w-4 opacity-50" />
          </Button>
        </DialogTrigger>
      </Dialog>

      <Dialog open={isAVOpen} onOpenChange={setIsAVOpen}>
        <AVPopup />
        <DialogTrigger asChild>
          <Button
            variant={"default"}
            className="w-full justify-between text-left font-normal text-primary-foreground"
            tabIndex={isActive ? 0 : -1}
          >
            <span>Set Up AV</span>
            <FontAwesomeIcon icon={faMicrophone} className="h-4 w-4 opacity-50" />
          </Button>
        </DialogTrigger>
      </Dialog>

      <Dialog open={isFacilitiesOpen} onOpenChange={setIsFacilitiesOpen}>
        <FacilitiesPopup />
        <DialogTrigger asChild>
          <Button
            variant={"default"}
            className="w-full justify-between text-left font-normal text-primary-foreground"
            tabIndex={isActive ? 0 : -1}
          >
            <span>Set Up Facilities</span>
            <FontAwesomeIcon icon={faHammer} className="h-4 w-4 opacity-50" />
          </Button>
        </DialogTrigger>
      </Dialog>

      <Dialog open={isHeartCrewOpen} onOpenChange={setIsHeartCrewOpen}>
        <HeartCrewPopup />
        <DialogTrigger asChild>
          <Button
            variant={"default"}
            className="w-full justify-between text-left font-normal text-primary-foreground"
            tabIndex={isActive ? 0 : -1}
          >
            <span>Set Up Heart Crew</span>
            <FontAwesomeIcon icon={faPeopleGroup} className="h-4 w-4 opacity-50" />
          </Button>
        </DialogTrigger>
      </Dialog>

      <Dialog open={isRecurringOpen} onOpenChange={setIsRecurringOpen}>
        <RecurringPopup open={isRecurringOpen} onOpenChange={setIsRecurringOpen} />
        <DialogTrigger asChild>
          <Button
            variant={"default"}
            className="w-full justify-between text-left font-normal text-primary-foreground col-span-2"
            tabIndex={isActive ? 0 : -1}
          >
            <span>Set Up Reccuring Event</span>
            <FontAwesomeIcon icon={faCalendarDays} className="h-4 w-4 opacity-50" />
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default FormPage2;