import axios from 'axios';
import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@awesome.me/kit-10a739193a/icons/classic/light';
import { LoadingContext, MPEvent, MPLocation, correctForTimezone, CalendarDate, getFormattedDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WeekCalendar from './WeekCalendar';
import MonthCalendar from './MonthCalendar';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getCalendarDates(year: number, month: number): string[] {
  const startDate = new Date(Date.UTC(year, month, 1));
  const dates: string[] = [];
  while (startDate.getUTCMonth() === month) {
    dates.push(startDate.toISOString());
    startDate.setUTCDate(startDate.getUTCDate() + 1);
  }
  const currDate = new Date(dates[0]);
  const daysToGoBack = currDate.getUTCDay();
  for (let i = 0; i < daysToGoBack; i++) {
    currDate.setUTCDate(currDate.getUTCDate() - 1);
    dates.unshift(currDate.toISOString());
  }
  return dates;
}

function getDatesOfWeek(weekNumber: number, year: number): string[] {
  if (weekNumber < 1 || weekNumber > 53) {
    throw new Error('Week number must be between 1 and 53.');
  }
  const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
  const firstThursday = new Date(firstDayOfYear);
  firstThursday.setUTCDate(firstDayOfYear.getUTCDate() + (4 - (firstDayOfYear.getUTCDay() || 7)));
  const firstDayOfWeek = new Date(firstThursday);
  firstDayOfWeek.setUTCDate(firstThursday.getUTCDate() + 7 * (weekNumber - 1) - 3);
  const firstDayOfWeekSunday = new Date(firstDayOfWeek);
  firstDayOfWeekSunday.setUTCDate(firstDayOfWeek.getUTCDate() - 1);
  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(firstDayOfWeekSunday);
    day.setUTCDate(firstDayOfWeekSunday.getUTCDate() + i);
    weekDates.push(day.toISOString());
  }
  return weekDates;
}

export default function Calendar() {
  const { toast } = useToast();
  const { updateLoading } = useContext(LoadingContext);
  const updateLoadingRef = useRef(updateLoading);

  const today = new CalendarDate();
  const [week, setWeek] = useState<number>(today.getWeek());
  const [month, setMonth] = useState<number>(today.getMonth());
  const [year, setYear] = useState<number>(today.getFullYear());
  const [monthDates, setMonthDates] = useState<Array<string>>([]);
  const [weekDates, setWeekDates] = useState<Array<string>>([]);
  const [allEvents, setAllEvents] = useState<Array<MPEvent>>([]);
  const [events, setEvents] = useState<Array<MPEvent>>([]);
  const [locations, setLocations] = useState<Array<MPLocation>>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("All Locations");
  const [calendarView, setCalendarView] = useState<string>('month');

  const [earliestEventDate, setEarliestEventDate] = useState<Date | null>(null);
  const [latestEventDate, setLatestEventDate] = useState<Date | null>(null);

  const prevMonth = () => {
    setMonthDates([]);
    if (month > 0) {
      setWeek(new CalendarDate(Date.UTC(year, month - 1, 1)).getWeek());
      setMonth(month - 1);
    } else {
      setWeek(52);
      setMonth(11);
      setYear(year - 1);
    }
  }

  const nextMonth = () => {
    setMonthDates([]);
    if (month < 11) {
      setWeek(new CalendarDate(Date.UTC(year, month + 1, 1)).getWeek());
      setMonth(month + 1);
    } else {
      setWeek(1);
      setMonth(0);
      setYear(year + 1);
    }
  }

  const prevWeek = () => {
    setWeekDates([]);
    if (week > 1) {
      setWeek(v => v - 1);
    } else {
      setWeek(53);
      setYear(v => v - 1);
    }
  }

  const nextWeek = () => {
    setWeekDates([]);
    if (week < 53) {
      setWeek(v => v + 1);
    } else {
      setWeek(1);
      setYear(v => v + 1);
    }
  }

  const fetchEvents = useCallback(async (startDate: string, endDate: string) => {
    return await axios({
      method: "GET",
      url: "/api/events",
      params: { startDate, endDate }
    }).then(response => response.data);
  }, []);

  const fetchLocations = useCallback(async () => {
    return await axios({
      method: "GET",
      url: "/api/locations"
    }).then(response => response.data);
  }, []);


  const getCalendarInformation = useCallback(async () => {
    updateLoadingRef.current(true);
    try {
      const dates = calendarView === "month"
        ? getCalendarDates(year, month)
        : calendarView === "week"
          ? getDatesOfWeek(week, year)
          : [];

      const startDate = new Date(dates[0]);
      const lastDate = new Date(dates[dates.length - 1]);
      const formattedStartDate = getFormattedDate(startDate);
      const formattedLastDate = getFormattedDate(new Date(lastDate.setDate(lastDate.getDate() + 1)));

      setMonthDates(dates);
      setWeekDates(getDatesOfWeek(week, year));

      const locations = await fetchLocations();
      setLocations(locations);

      const events: MPEvent[] = await fetchEvents(formattedStartDate, formattedLastDate);
      setAllEvents(events);
    } catch (error) {
      console.error(error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try Again" onClick={getCalendarInformation}>Try Again</ToastAction>,
        variant: "destructive"
      });
    }
    updateLoadingRef.current(false);
  }, [calendarView, year, month, week, fetchEvents, fetchLocations, toast]);

  useEffect(() => {
    getCalendarInformation();
  }, [getCalendarInformation]);

  useEffect(() => {
    setEvents(allEvents.filter(e => selectedLocation === 'All Locations' || e.Location_Name === selectedLocation));
  }, [selectedLocation, allEvents]);

  return (
    <>
      <article className="grid grid-rows-12 gap-2 md:gap-4 w-full">
        <div className="row-span-1 w-full h-full bg-primary p-4 flex items-center md:rounded-sm shadow-sm">
          {calendarView === "month" && <>
            <Button variant="icon" onClick={prevMonth}><FontAwesomeIcon icon={faArrowLeft} /></Button>
            <h1 className="w-52 text-center">{months[month]} {year}</h1>
            <Button variant="icon" onClick={nextMonth}><FontAwesomeIcon icon={faArrowRight} /></Button>
          </>}
          {calendarView === "week" && <>
            <Button variant="icon" onClick={prevWeek}><FontAwesomeIcon icon={faArrowLeft} /></Button>
            <h1 className="mx-4 text-center">{correctForTimezone(weekDates[0]).toLocaleDateString('en-us', { month: "short", day: "numeric" })} - {correctForTimezone(weekDates[weekDates.length - 1]).toLocaleDateString('en-us', { month: "short", day: "numeric" })}, {year}</h1>
            <Button variant="icon" onClick={nextWeek}><FontAwesomeIcon icon={faArrowRight} /></Button>
          </>}

          <div className="mx-4">
            <Select value={calendarView} onValueChange={(val) => setCalendarView(val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mx-4">
            <Select value={selectedLocation} onValueChange={(val) => setSelectedLocation(val)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Locations">All Locations</SelectItem>
                {locations.map((location, i) => <SelectItem key={i} value={location.Location_Name}>{location.Location_Name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="row-span-11 w-full h-full bg-primary md:rounded-sm shadow-sm p-4">
          <div className="w-full h-full overflow-hidden">
            {calendarView === "month" && <MonthCalendar
              monthDates={monthDates}
              events={events}
              handleClick={() => console.log('yeet')}
            />}
            {calendarView === "week" && <WeekCalendar
              weekDates={weekDates}
              events={events}
              getFormattedDate={getFormattedDate}
              handleClick={() => console.log('yeet')}
            />
            }
          </div>
        </div>
      </article>
    </>
  );
};
