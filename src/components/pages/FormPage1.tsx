"use client";
import React from "react";

import { CreateEventValue } from "@/lib/types";
import { TextInput, NumberInput, BooleanInput, DateInput, TimeInput, DropdownInput, TextAreaInput } from "@/components/inputs";

import { useCreateEventData } from "@/context/CreateEventContext";

const FormPage1 = ({ isActive, eventValues }: { isActive: boolean, eventValues: CreateEventValue[] }) => {
  const { eventData, updateEventData } = useCreateEventData();
  return (
    <div className="w-full mx-auto grid grid-cols-2 gap-4 p-1">

      <TextInput
        text={eventData?.Event_Title}
        setText={(value: string) => updateEventData({ Event_Title: value })}
        label="Event Title:"
        isActive={isActive}
      />

      <DropdownInput
        value={eventData?.Location_ID}
        setValue={(value: number) => updateEventData({ Location_ID: value })}
        options={eventValues.find(value => value.Name === "Location")}
        isActive={isActive}
      />


      <DateInput
        date={eventData?.Event_Date}
        setDate={(value: Date) => updateEventData({ Event_Date: value })}
        label="Event Date:"
        isActive={isActive}

      />

      <TimeInput
        time={eventData?.Event_Start_Time}
        setTime={(value: string) => updateEventData({ Event_Start_Time: value })}
        label="Event Start Time:"
        isActive={isActive}

      />

      <TimeInput
        time={eventData?.Event_End_Time}
        setTime={(value: string) => updateEventData({ Event_End_Time: value })}
        label="Event End Time:"
        isActive={isActive}

      />

      <DropdownInput
        value={eventData?.Primary_Contact}
        setValue={(value: number) => updateEventData({ Primary_Contact: value })}
        options={eventValues.find(value => value.Name === "Primary Contact")}
        isActive={isActive}

      />

      <DropdownInput
        value={eventData?.Event_Type_ID}
        setValue={(value: number) => updateEventData({ Event_Type_ID: value })}
        options={eventValues.find(value => value.Name === "Event Type")}
        isActive={isActive}

      />

      <NumberInput
        value={eventData?.Estimated_Attendance}
        setValue={(value: number) => updateEventData({ Estimated_Attendance: value })}
        label="Estimated Attendance:"
        isActive={isActive}

      />

      <DropdownInput
        value={eventData?.Congregation_ID}
        setValue={(value: number) => updateEventData({ Congregation_ID: value })}
        options={eventValues.find(value => value.Name === "Congregation")}
        isActive={isActive}

      />

      <NumberInput
        value={eventData?.Setup_Time}
        setValue={(value: number) => updateEventData({ Setup_Time: value })}
        label="Setup Time (Minutes):"
        isActive={isActive}

      />

      <NumberInput
        value={eventData?.Cleanup_Time}
        setValue={(value: number) => updateEventData({ Cleanup_Time: value })}
        label="Cleanup Time (Minutes):"
        isActive={isActive}

      />

      <BooleanInput
        boolean={eventData?.Public}
        setBoolean={(value: boolean) => updateEventData({ Public: value })}
        label="Display on Public Calendar:"
        isActive={isActive}

      />


      <TextAreaInput
        text={eventData?.Event_Description}
        setText={(value: string) => updateEventData({ Event_Description: value })}
        label="Event Description:"
        isActive={isActive}

      />
    </div>
  );
};

export default FormPage1;