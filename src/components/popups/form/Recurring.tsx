"use client";
import React, { useEffect } from 'react';

import { cn } from "@/lib/util";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { toast, useToast } from "@/components/ui/use-toast";

import { NumberInput, DropdownInput, DateInput } from "@/components/inputs";

import { DayPosition, useCreateEventData, Weekday } from "@/context/CreateEventContext";
import { CreateEventValue } from "@/lib/types";

const dayPositions: CreateEventValue = {
  Name: "Day Position",
  Labels: ["First", "Second", "Third", "Fourth", "Last"],
  Values: [0, 1, 2, 3, 4],
  Sort_Order: 1,
  Default_ID: 0
}

const weekdayPatterns: CreateEventValue = {
  Name: "Weekday Pattern",
  Labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Weekday", "Weekend Day", "Day"],
  Values: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  Sort_Order: 1,
  Default_ID: 0
}

const weekdays: Weekday[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const generateSequence = ({
  type,
  interval,
  startDate,
  endDate,
  totalOccurrences,
  day,
  dayPosition,
  weekdays = []
}: {
  type: "daily" | "weekly" | "monthly",
  interval?: number,
  startDate: Date,
  endDate?: Date,
  totalOccurrences?: number,
  day?: number,
  dayPosition?: "First" | "Second" | "Third" | "Fourth" | "Last",
  weekdays?: ("Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Weekday" | "Weekend Day" | "Day")[]
}): Date[] => {
  const MAX_LOOPS = 1000; // Safety limit to prevent infinite loops
  let loopCounter = 0;

  // Helper function: returns true if the date matches the target weekday criteria.
  function matchesWeekday(date: Date, weekday: string): boolean {
    const dayOfWeek = date.getDay();
    switch (weekday) {
      case "Monday": return dayOfWeek === 1;
      case "Tuesday": return dayOfWeek === 2;
      case "Wednesday": return dayOfWeek === 3;
      case "Thursday": return dayOfWeek === 4;
      case "Friday": return dayOfWeek === 5;
      case "Saturday": return dayOfWeek === 6;
      case "Weekday": return dayOfWeek >= 1 && dayOfWeek <= 5;
      case "Weekend Day": return dayOfWeek === 0 || dayOfWeek === 6;
      case "Day": return true;
      default: return false;
    }
  }
  const sequence: Date[] = [];

  const toastError = {
    title: "Something went wrong",
    description: "Defined recurrence pattern is invalid.",
    variant: "destructive" as const
  }

  if (!endDate && !totalOccurrences) {
    // invalid form
    toast(toastError);
    return [];
  }

  let currentDate = startDate;
  if (type === "daily") {
    // required fields: interval or weekdays
    if (!interval && !weekdays.length) {
      // invalid form
      toast(toastError);
      return [];
    }

    while (((endDate && currentDate <= endDate) || (totalOccurrences && sequence.length < totalOccurrences)) && loopCounter < MAX_LOOPS) {
      loopCounter++;
      // interval or every weekday
      if (interval) {
        sequence.push(currentDate);
        currentDate = new Date(currentDate.getTime() + interval * 24 * 60 * 60 * 1000);
      } else if (weekdays.length) {
        sequence.push(currentDate);
        // Get next weekday by incrementing days until not Saturday (6) or Sunday (0)
        do {
          currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        } while (currentDate.getDay() === 0 || currentDate.getDay() === 6);
      }
    }
  } else if (type === "weekly") {
    // required fields: interval, weekdays
    if (!interval || !weekdays.length) {
      // invalid form
      toast(toastError);
      return [];
    }

    const allWeekdays: ("Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday")[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    // Track when we need to start the next interval
    let weekCounter = 0;
    let currentWeek = Math.floor(startDate.getTime() / (7 * 24 * 60 * 60 * 1000));

    while (((endDate && currentDate <= endDate) || (totalOccurrences && sequence.length < totalOccurrences)) && loopCounter < MAX_LOOPS) {
      loopCounter++;
      // Only include dates in weeks that match our interval
      if (weekCounter === 0) {
        if (weekdays.includes(allWeekdays[currentDate.getDay()] as Weekday)) {
          sequence.push(currentDate);
        }
      }

      // Move to next day
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

      // Check if we've moved to a new week
      const newWeek = Math.floor(currentDate.getTime() / (7 * 24 * 60 * 60 * 1000));
      if (newWeek > currentWeek) {
        currentWeek = newWeek;
        weekCounter = (weekCounter + 1) % interval;
      }
    }

  } else if (type === "monthly") {
    // required fields: interval, day or dayPosition & weekdays
    if (!interval || (!day && (!dayPosition || !weekdays.length))) {
      // invalid form
      toast(toastError);
      return [];
    }

    while (((endDate && currentDate <= endDate) || (totalOccurrences && sequence.length < totalOccurrences)) && loopCounter < MAX_LOOPS) {
      loopCounter++;
      if (day) {
        if (currentDate.getDate() === day) {
          sequence.push(currentDate);
        }
        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + interval, day);
      } else {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        let candidate: Date | null = null;

        if (dayPosition === "Last") {
          // Get the last day of the month
          let lastDay = new Date(year, month + 1, 0);
          // Loop backwards until a matching day is found
          while (lastDay.getMonth() === month) {
            if (matchesWeekday(lastDay, weekdays[0])) {
              candidate = lastDay;
              break;
            }
            lastDay = new Date(year, month, lastDay.getDate() - 1);
          }
        } else {
          // For "First", "Second", "Third" or "Fourth", map the position to a number.
          const positions: { [key: string]: number } = {
            "First": 1,
            "Second": 2,
            "Third": 3,
            "Fourth": 4
          };
          const targetOccurrence = positions[dayPosition || "First"];
          if (targetOccurrence) {
            let occurrence = 0;
            // Iterate through the days of the month.
            for (let d = 1; d <= 31; d++) {
              const date = new Date(year, month, d);
              if (date.getMonth() !== month) break;
              if (matchesWeekday(date, weekdays[0])) {
                occurrence++;
                if (occurrence === targetOccurrence) {
                  candidate = date;
                  break;
                }
              }
            }
          }
        }

        if (candidate) {
          // Only add the candidate if it is on or after the startDate.
          if (candidate >= startDate) {
            sequence.push(candidate);
          }
        }

        // Advance currentDate to the first day of the month after adding the interval.
        currentDate = new Date(year, month + interval, 1);
      }
    }
  }

  if (loopCounter >= MAX_LOOPS) {
    toast({
      title: "Something went wrong",
      description: "Pattern generation exceeded safety limit. Please try different parameters.",
      variant: "destructive"
    });
    return [];
  }

  return sequence;
}

const RecurringPopup = ({ open, onOpenChange, setConfirmOpen }: { open: boolean, onOpenChange: (open: boolean) => void, setConfirmOpen: (open: boolean) => void }) => {
  const { eventData, updateEventData } = useCreateEventData();
  const { toast } = useToast();
  const [activePage, setActivePage] = React.useState(2);

  const getStartDateString = () => {
    if (!eventData || !eventData.Event_Date) return "Invalid Date";

    const startDate = new Date(eventData.Event_Date);
    const startDateString = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear().toString().slice(-2)}`;
    const startDateWeekday = startDate.toLocaleDateString("en-us", { weekday: "long" });

    return `${startDateWeekday} ${startDateString}`;
  }

  const handleClearForm = () => {
    updateEventData({
      Recurring_Daily_Pattern: "days",
      Recurring_Daily_Day_Interval: 1,
      Recurring_Weekly_Week_Interval: 1,
      Recurring_Weekly_Days: [],
      Recurring_Monthly_Pattern: "date-of-month",
      Recurring_Monthly_Date: undefined,
      Recurring_Monthly_Month_Date_Interval: 1,
      Recurring_Monthly_Day_Position: "First",
      Recurring_Monthly_Weekday: "Sunday",
      Recurring_Monthly_Weekday_Interval: 1,
      Recurring_End_By: "by-date",
      Recurring_End_By_Date: undefined,
      Recurring_End_Occurence_Count: 1,
      Recurring_Pattern: []
    });


    onOpenChange(false);
  }

  const handleSaveForm = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!eventData || !eventData.Event_Date || !eventData.Event_Start_Time || !eventData.Event_End_Time || !eventData.Recurring_Type) {
      // somehow the user got here without the required fields
      toast({
        title: "Something Went Wrong",
        description: "Internal Server Error.",
        variant: "destructive"
      });
      return;
    }

    const { Event_Date, Recurring_Type, Recurring_End_By } = eventData;

    if (Recurring_End_By === "by-date" && !eventData.Recurring_End_By_Date) {
      toast({
        title: "Missing Required Fields",
        description: "Please select an end by date.",
        variant: "destructive"
      });
      return;
    }


    let sequence: Date[] = [];
    if (Recurring_Type === "daily") {
      const { Recurring_Daily_Pattern, Recurring_Daily_Day_Interval } = eventData;

      if (Recurring_Daily_Pattern === "days") {
        // console.log("Every", Recurring_Daily_Day_Interval, "Day(s)");
        sequence = generateSequence({
          type: "daily",
          interval: Recurring_Daily_Day_Interval,
          startDate: Event_Date,
          endDate: eventData.Recurring_End_By === "by-date" ? eventData.Recurring_End_By_Date : undefined,
          totalOccurrences: eventData.Recurring_End_By === "occurence" ? eventData.Recurring_End_Occurence_Count : undefined
        });

      } else if (Recurring_Daily_Pattern === "weekdays") {
        // console.log("Every Weekday");
        sequence = generateSequence({
          type: "daily",
          weekdays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          startDate: Event_Date,
          endDate: eventData.Recurring_End_By === "by-date" ? eventData.Recurring_End_By_Date : undefined,
          totalOccurrences: eventData.Recurring_End_By === "occurence" ? eventData.Recurring_End_Occurence_Count : undefined
        });
      }

    } else if (Recurring_Type === "weekly") {
      const { Recurring_Weekly_Week_Interval, Recurring_Weekly_Days } = eventData;

      if (!Recurring_Weekly_Days.length) {
        // the user didn't select any weekdays
        toast({
          title: "Missing Required Fields",
          description: "Please select at least one weekday.",
          variant: "destructive"
        });
        return;
      }

      // console.log("Every", Recurring_Weekly_Week_Interval, "Week(s) on ", Recurring_Weekly_Days.join(", "));

      sequence = generateSequence({
        type: "weekly",
        interval: Recurring_Weekly_Week_Interval,
        weekdays: Recurring_Weekly_Days,
        startDate: Event_Date,
        endDate: eventData.Recurring_End_By === "by-date" ? eventData.Recurring_End_By_Date : undefined,
        totalOccurrences: eventData.Recurring_End_By === "occurence" ? eventData.Recurring_End_Occurence_Count : undefined
      });
    } else if (Recurring_Type === "monthly") {
      const { Recurring_Monthly_Pattern, Recurring_Monthly_Date, Recurring_Monthly_Month_Date_Interval, Recurring_Monthly_Day_Position, Recurring_Monthly_Weekday, Recurring_Monthly_Weekday_Interval } = eventData;

      if (Recurring_Monthly_Pattern === "date-of-month") {
        // console.log("Day", Recurring_Monthly_Date, "of every", Recurring_Monthly_Month_Date_Interval, "month(s)");
        sequence = generateSequence({
          type: "monthly",
          day: Recurring_Monthly_Date,
          interval: Recurring_Monthly_Month_Date_Interval,
          startDate: Event_Date,
          endDate: eventData.Recurring_End_By === "by-date" ? eventData.Recurring_End_By_Date : undefined,
          totalOccurrences: eventData.Recurring_End_By === "occurence" ? eventData.Recurring_End_Occurence_Count : undefined
        });
      } else if (Recurring_Monthly_Pattern === "weekday-of-month") {
        // console.log("The", Recurring_Monthly_Day_Position, Recurring_Monthly_Weekday, "of every", Recurring_Monthly_Weekday_Interval, "month(s)");
        sequence = generateSequence({
          type: "monthly",
          dayPosition: Recurring_Monthly_Day_Position,
          weekdays: Recurring_Monthly_Weekday ? [Recurring_Monthly_Weekday] : [],
          interval: Recurring_Monthly_Weekday_Interval,
          startDate: Event_Date,
          endDate: eventData.Recurring_End_By === "by-date" ? eventData.Recurring_End_By_Date : undefined,
          totalOccurrences: eventData.Recurring_End_By === "occurence" ? eventData.Recurring_End_Occurence_Count : undefined
        });
      }
    }

    if (sequence.length === 0) {
      toast({
        title: "Something went wrong",
        description: "Defined recurrence pattern is invalid.",
        variant: "destructive"
      });
      return;
    }

    updateEventData({ Recurring_Pattern: sequence });
    // close this popup
    onOpenChange(false);
    // open the confirm popup
    setConfirmOpen(true);
  }


  useEffect(() => {
    if (open && (!eventData?.Event_Date || !eventData?.Event_Start_Time || !eventData?.Event_End_Time)) {

      const missingFields: string[] = [];
      if (!eventData?.Event_Date) missingFields.push("Event Date");
      if (!eventData?.Event_Start_Time) missingFields.push("Event Start Time");
      if (!eventData?.Event_End_Time) missingFields.push("Event End Time");

      onOpenChange(false);
      toast({
        title: "Missing Required Fields",
        description: `Missing Fields: ${missingFields.join(", ")}`,
        variant: "destructive"
      });
    }
  }, [open]);

  useEffect(() => {
    if (activePage === 0) {
      updateEventData({ Recurring_Type: "daily" });
    } else if (activePage === 1) {
      updateEventData({ Recurring_Type: "weekly" });
    } else if (activePage === 2) {
      updateEventData({ Recurring_Type: "monthly" });
    }
  }, [activePage])

  return <DialogContent>
    <DialogHeader>
      <DialogTitle className="pb-1">Set Up Reccuring Event</DialogTitle>
      <DialogDescription className="hidden">Fill out the form below to set up recurring events.</DialogDescription>
    </DialogHeader>
    <div className="max-h-[550px] grid custom-scroller overflow-hidden">

      <div className="w-full flex relative">
        <div className="w-1/3 h-full bg-accent z-0 absolute top-0 left-0 transition-transform duration-300 ease-in-out" style={{ transform: `translateX(${activePage * 100}%)` }}></div>
        <button
          className={cn("w-full p-2 transition-colors duration-200 z-10", activePage === 0 ? "text-accent-foreground" : "")}
          onClick={() => setActivePage(0)}
        >
          Daily
        </button>
        <Separator orientation="vertical" />
        <button
          className={cn("w-full p-2 transition-colors duration-200 z-10", activePage === 1 ? "text-accent-foreground" : "")}
          onClick={() => setActivePage(1)}
        >
          Weekly
        </button>
        <Separator orientation="vertical" />
        <button
          className={cn("w-full p-2 transition-colors duration-200 z-10", activePage === 2 ? "text-accent-foreground" : "")}
          onClick={() => setActivePage(2)}
        >
          Monthly
        </button>
      </div>
      <Separator />

      <div className="w-full overflow-hidden">
        <div
          className="w-[300%] flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${activePage * 33.333}%)` }}
        >
          {/* PAGE 1 - Daily */}
          <div className="w-full p-2 px-4 flex items-center">
            <RadioGroup value={eventData?.Recurring_Daily_Pattern} onValueChange={(value) => updateEventData({ Recurring_Daily_Pattern: value as "days" | "weekdays" | undefined })}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="days" id="days" disabled={activePage !== 0} />
                <label htmlFor="days" className="flex items-center gap-2" style={{ opacity: eventData?.Recurring_Daily_Pattern !== "days" ? 0.5 : 1 }}>
                  Every
                  <NumberInput value={eventData?.Recurring_Daily_Day_Interval} setValue={(value) => updateEventData({ Recurring_Daily_Day_Interval: value })} showButtons={true} min={1} max={31} isActive={activePage === 0} disabled={eventData?.Recurring_Daily_Pattern !== "days"} />
                  Day(s)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="weekdays" id="weekdays" disabled={activePage !== 0} />
                <label htmlFor="weekdays" style={{ opacity: eventData?.Recurring_Daily_Pattern !== "weekdays" ? 0.5 : 1 }}>Every Weekday</label>
              </div>
            </RadioGroup>
          </div>
          {/* PAGE 2 - Weekly */}
          <div className="w-full p-2 px-4">
            <span className="flex items-center gap-2">
              Every
              <NumberInput value={eventData?.Recurring_Weekly_Week_Interval} setValue={(value) => updateEventData({ Recurring_Weekly_Week_Interval: value })} showButtons={true} min={1} max={31} isActive={activePage === 1} />
              week(s) on
            </span>
            <div className="grid grid-cols-3 gap-1 mt-2">
              {weekdays.map((day) => {
                return (
                  <div key={day} className="flex items-center">
                    <Checkbox
                      id={day}
                      disabled={activePage !== 1}
                      checked={eventData?.Recurring_Weekly_Days?.includes(day)}
                      onCheckedChange={(checked) => updateEventData({
                        Recurring_Weekly_Days: checked
                          ? [...(eventData?.Recurring_Weekly_Days ?? []), day]
                          : eventData?.Recurring_Weekly_Days?.filter((d: string) => d !== day) ?? []
                      })}
                    />
                    <label htmlFor={day} className="pl-2">{day}</label>
                  </div>
                );
              })}
            </div>
          </div>
          {/* PAGE 3 - Monthly */}
          <div className="w-full p-2 px-4 flex items-center">
            <RadioGroup value={eventData?.Recurring_Monthly_Pattern} onValueChange={(value) => updateEventData({ Recurring_Monthly_Pattern: value as "date-of-month" | "weekday-of-month" })}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="date-of-month" id="date-of-month" disabled={activePage !== 2} />
                <label htmlFor="date-of-month" className="flex items-center gap-2" style={{ opacity: eventData?.Recurring_Monthly_Pattern !== "date-of-month" ? 0.5 : 1 }}>
                  Day
                  <NumberInput value={eventData?.Recurring_Monthly_Date} setValue={(value) => updateEventData({ Recurring_Monthly_Date: value })} showButtons={true} min={1} max={31} isActive={activePage === 2} disabled={eventData?.Recurring_Monthly_Pattern !== "date-of-month"} />
                  of every
                  <NumberInput value={eventData?.Recurring_Monthly_Month_Date_Interval} setValue={(value) => updateEventData({ Recurring_Monthly_Month_Date_Interval: value })} showButtons={true} min={1} max={12} isActive={activePage === 2} disabled={eventData?.Recurring_Monthly_Pattern !== "date-of-month"} />
                  month(s)
                </label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="weekday-of-month" id="weekday-of-month" disabled={activePage !== 2} />
                <label htmlFor="weekday-of-month" className="flex items-center gap-2" style={{ opacity: eventData?.Recurring_Monthly_Pattern !== "weekday-of-month" ? 0.5 : 1 }}>
                  The
                  <DropdownInput
                    options={dayPositions}
                    value={dayPositions.Labels.indexOf(eventData?.Recurring_Monthly_Day_Position ?? "")}
                    setValue={(value) => updateEventData({ Recurring_Monthly_Day_Position: dayPositions.Labels[value] as DayPosition })}
                    showLabel={false}
                    isActive={activePage === 2}
                    disabled={eventData?.Recurring_Monthly_Pattern !== "weekday-of-month"}
                  />
                  <DropdownInput

                    options={weekdayPatterns}
                    value={weekdayPatterns.Labels.indexOf(eventData?.Recurring_Monthly_Weekday ?? "")}
                    setValue={(value) => updateEventData({ Recurring_Monthly_Weekday: weekdayPatterns.Labels[value] as Weekday })}
                    showLabel={false}
                    isActive={activePage === 2}
                    disabled={eventData?.Recurring_Monthly_Pattern !== "weekday-of-month"}
                  />
                  of every
                  <NumberInput
                    value={eventData?.Recurring_Monthly_Weekday_Interval}
                    setValue={(value) => updateEventData({ Recurring_Monthly_Weekday_Interval: value })}
                    showButtons={true}
                    min={1}
                    max={12}
                    isActive={activePage === 2}
                    disabled={eventData?.Recurring_Monthly_Pattern !== "weekday-of-month"}
                  />
                  month(s)
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <Separator />
        {/* Footer - End By */}
        <div className="w-full flex gap-2 p-2 px-4">
          <div className="flex flex-col gap-2">
            <p>Start By:</p>
            <p>End By:</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold">{getStartDateString()}</p>
            <RadioGroup value={eventData?.Recurring_End_By} onValueChange={(value) => updateEventData({ Recurring_End_By: value as "by-date" | "occurence" })}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="by-date" id="by-date" />
                <label htmlFor="by-date" className="flex items-center gap-2" style={{ opacity: eventData?.Recurring_End_By !== "by-date" ? 0.5 : 1 }}>
                  By Date
                  <DateInput date={eventData?.Recurring_End_By_Date} setDate={(value) => updateEventData({ Recurring_End_By_Date: value })} showLabel={false} disabled={eventData?.Recurring_End_By !== "by-date"} />
                </label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="occurence" id="occurence" />
                <label htmlFor="occurence" className="flex items-center gap-2" style={{ opacity: eventData?.Recurring_End_By !== "occurence" ? 0.5 : 1 }}>
                  After
                  <NumberInput value={eventData?.Recurring_End_Occurence_Count} setValue={(value) => updateEventData({ Recurring_End_Occurence_Count: value })} showButtons={true} min={1} max={52} disabled={eventData?.Recurring_End_By !== "occurence"} />
                  Occurrences
                </label>
              </div>
            </RadioGroup>
          </div>

        </div>
      </div>
    </div>

    <Separator />

    <DialogFooter className="p-2 !justify-between">
      <DialogClose asChild>
        <Button variant="destructive" className="h-8 py-1" onClick={handleClearForm}>
          Cancel Recurrence
        </Button>
      </DialogClose>

      <DialogClose asChild>
        <Button
          variant="secondary"
          className="h-8 py-1"
          onClick={handleSaveForm}
        >
          Save
        </Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
}

export default RecurringPopup;