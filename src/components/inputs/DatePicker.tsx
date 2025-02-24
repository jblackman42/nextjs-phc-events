"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@awesome.me/kit-10a739193a/icons/classic/solid";
import { CalendarDate } from "@/lib/types";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getCalendarDates(year: number, month: number): string[] {
  // get all dates of the month
  const startDate = new Date(Date.UTC(year, month, 1));
  const dates: string[] = [];
  while (startDate.getUTCMonth() === month) {
    dates.push(startDate.toISOString());
    startDate.setUTCDate(startDate.getUTCDate() + 1);
  }
  // go back so the array starts on a sunday
  const currDate = new Date(dates[0]);
  const daysToGoBack = currDate.getUTCDay();
  for (let i = 0; i < daysToGoBack; i++) {
    currDate.setUTCDate(currDate.getUTCDate() - 1);
    dates.unshift(currDate.toISOString());
  }
  // go forward so the array ends on a saturday
  const lastDate = new Date(dates[dates.length - 1]);
  const daysToGoForward = 6 - lastDate.getUTCDay();
  for (let i = 0; i < daysToGoForward; i++) {
    lastDate.setUTCDate(lastDate.getUTCDate() + 1);
    dates.push(lastDate.toISOString());
  }

  return dates;
}

export default function DatePicker({ year, month, week, day, calendarView, handleSubmit }: { year: number, month: number, week: number, day: number, calendarView: string, handleSubmit: (date: CalendarDate) => void }) {
  const [tempYear, setTempYear] = useState(year);
  const [tempMonth, setTempMonth] = useState(month);

  const handleBackClick = () => {
    if (calendarView === "month") {
      setTempYear(x => x - 1);
    } else if (calendarView === "week" || calendarView === "day") {
      if (tempMonth <= 0) {
        setTempMonth(11);
        setTempYear(tempYear - 1);
      } else {
        setTempMonth(tempMonth - 1);
      }
    }
  }
  const handleForwardClick = () => {
    if (calendarView === "month") {
      setTempYear(x => x + 1);
    } else if (calendarView === "week" || calendarView === "day") {
      if (tempMonth >= 11) {
        setTempMonth(0);
        setTempYear(tempYear + 1);
      } else {
        setTempMonth(tempMonth + 1);
      }
    }
  }

  const MonthPicker = () => {
    return (
      <div className="grid grid-cols-4 gap-1 group">
        {months.map((m, i) => <button key={i} onClick={() => handleSubmit(new CalendarDate(Date.UTC(tempYear, i, 1)))} data-selected={tempYear === year && month === i} className="bg-primary rounded-[2px] py-2 hover:!bg-accent hover:!text-white group-hover:bg-primary group-hover:text-textHeading data-[selected=true]:bg-accent data-[selected=true]:text-white">{m}</button>)}
      </div>
    )
  };

  const WeekPicker = () => {
    const dates = getCalendarDates(tempYear, tempMonth);
    const datesByWeek = [...Array(dates.length / 7)].map((_, i) => dates.slice(7 * i, (7 * i) + 7));
    return (
      <div className="week-picker grid gap-1">
        <div className="grid grid-cols-7 gap-1 *:text-center *:text-sm">
          <p>Su</p>
          <p>Mo</p>
          <p>Tu</p>
          <p>We</p>
          <p>Th</p>
          <p>Fr</p>
          <p>Sa</p>
        </div>
        {datesByWeek.map((weekArr, i) => {
          const weekStart = new CalendarDate(weekArr[0]);
          return <div key={i} className="grid grid-cols-7 gap-1 group">
            {weekArr.map((dateStr, i) => {
              const currDate = new CalendarDate(dateStr);
              const isSelected = currDate.getUTCFullYear() === year && currDate.getWeek() === week;
              return <button key={i} onClick={() => handleSubmit(weekStart)} data-selected={isSelected} className="group-hover:!bg-accent group-hover:!text-white bg-primary aspect-square grid place-items-center rounded-sm data-[selected=true]:bg-accent data-[selected=true]:text-white">{new CalendarDate(dateStr).getUTCDate()}</button>
            })}
          </div>
        })}
      </div>
    )
  }

  const DayPicker = () => {
    const dates = getCalendarDates(tempYear, tempMonth);
    return (
      <div className="grid grid-cols-7 gap-1 group">
        <p className="text-center text-sm">Su</p>
        <p className="text-center text-sm">Mo</p>
        <p className="text-center text-sm">Tu</p>
        <p className="text-center text-sm">We</p>
        <p className="text-center text-sm">Th</p>
        <p className="text-center text-sm">Fr</p>
        <p className="text-center text-sm">Sa</p>
        {dates.map((dateStr, i) => {
          const currDate = new CalendarDate(dateStr);
          const isSelected = currDate.getUTCFullYear() === year && currDate.getUTCMonth() === month && currDate.getUTCDate() === day;
          return <button key={i} onClick={() => handleSubmit(currDate)} data-selected={isSelected} className="group-hover:bg-primary group-hover:text-textHeading hover:!bg-accent hover:!text-white bg-primary aspect-square grid place-items-center rounded-sm data-[selected=true]:bg-accent data-[selected=true]:text-white">{new CalendarDate(dateStr).getUTCDate()}</button>
        })}
      </div>
    )
  }

  return <div className="grid gap-2 w-64 min-h-10 p-2 bg-background text-textHeading border border-input shadow-md rounded-md">
    <div className="flex justify-between text-2xl px-2 py-1">
      <button onClick={handleBackClick}><FontAwesomeIcon icon={faArrowLeft} /></button>
      <h1>{calendarView !== "month" && months[tempMonth]} {tempYear}</h1>
      <button onClick={handleForwardClick}><FontAwesomeIcon icon={faArrowRight} /></button>
    </div>
    {
      calendarView === "month"
        ? <MonthPicker />
        : calendarView === "week"
          ? <WeekPicker />
          : calendarView === "day"
            ? <DayPicker />
            : undefined
    }
  </div>;
}