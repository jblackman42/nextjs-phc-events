"use client";
import React from "react";
import { useView } from "@/context/ViewContext";
import { useLoading } from "@/context/LoadingContext";
import { MPEventCount } from "@/lib/types";
import MonthCalendar from "@/components/month/MonthCalendar";
import WeekCalendar from "@/components/week/WeekCalendar";
import { Loading } from "@/components";

const Calendar = ({ initialEventCounts, initialDates }: { initialEventCounts: MPEventCount[], initialDates: string[] }) => {
  const { view } = useView();
  const { loading } = useLoading();

  return <>
    {loading && <Loading />}
    {view.periodical === 'month' && <MonthCalendar initialEventCounts={initialEventCounts} initialDates={initialDates} />}
    {view.periodical === 'week' && <WeekCalendar />}
    {view.periodical === 'day' && <h1>Day Calendar</h1>}
  </>
}

export default Calendar;