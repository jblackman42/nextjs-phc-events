import axios from 'axios';
import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faBars, faClose } from '@awesome.me/kit-10a739193a/icons/classic/light';
import { LoadingContext, MPEvent, MPLocation, correctForTimezone, CalendarDate, getFormattedDate, MPBuilding, settings, MPRoom } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WeekCalendar from './WeekCalendar';
import DayCalendar from './DayCalendar';
import MonthCalendar from './MonthCalendar';
import DayPopup from './DayPopup';
import EventPopup from './EventPopup';
import SearchBar from './SearchBar';
import DatePicker from './DatePicker';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function sameDay(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

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

function getDatesOfWeek(year: number, weekNumber: number): string[] {
  const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
  const firstSunday = new Date(firstDayOfYear);
  firstSunday.setUTCDate(firstDayOfYear.getUTCDate() - firstDayOfYear.getUTCDay());
  const firstDayOfWeek = new Date(firstSunday);
  firstDayOfWeek.setUTCDate(firstSunday.getUTCDate() + 7 * (weekNumber - 1));
  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(firstDayOfWeek);
    day.setUTCDate(firstDayOfWeek.getUTCDate() + i);
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
  const [month, setMonth] = useState<number>(today.getUTCMonth());
  const [year, setYear] = useState<number>(today.getUTCFullYear());
  const [day, setDay] = useState<number>(today.getUTCDate());
  const [monthDates, setMonthDates] = useState<Array<string>>([]);
  const [weekDates, setWeekDates] = useState<Array<string>>([]);
  const [allEvents, setAllEvents] = useState<Array<MPEvent>>([]);
  const [events, setEvents] = useState<Array<MPEvent>>([]);
  const [locations, setLocations] = useState<Array<MPLocation>>([]);
  const [selectedLocationID, setSelectedLocationID] = useState<string>("0");
  const [selectedBuildingID, setSelectedBuildingID] = useState<string>("0");
  const [selectedRoomID, setSelectedRoomID] = useState<string>("0");
  const [selectedEvent, setSelectedEvent] = useState<MPEvent | undefined>();
  const [calendarView, setCalendarView] = useState<string>('month');

  const [searchTargetDate, setSearchTargetDate] = useState<string>();

  const [isDayPopupOpen, setIsDayPopupOpen] = useState<boolean | null>(null);
  const [isEventPopupOpen, setIsEventPopupOpen] = useState<boolean | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

  const [mobileFilterDropdownOpen, setMobileFilterDropdownOpen] = useState<boolean>(false);

  const setDateValuesFromDate = (date: CalendarDate): void => {
    setYear(date.getUTCFullYear());
    setMonth(date.getUTCMonth());
    setWeek(date.getWeek());
    setDay(date.getUTCDate());
  }

  const nextMonth = () => {
    setMonthDates([]);
    setDateValuesFromDate(new CalendarDate(year, month + 1, 1));
  }

  const prevMonth = () => {
    setMonthDates([]);
    setDateValuesFromDate(new CalendarDate(year, month - 1, 1));
  }

  const nextWeek = () => {
    setWeekDates([]);
    const nextWeekDates = getDatesOfWeek(year, week + 1);
    setDateValuesFromDate(new CalendarDate(nextWeekDates[0]));
  }

  const prevWeek = () => {
    setWeekDates([]);
    const prevWeekDates = getDatesOfWeek(year, week - 1);
    setDateValuesFromDate(new CalendarDate(prevWeekDates[0]));
  }

  const nextDay = () => {
    setDateValuesFromDate(new CalendarDate(year, month, day + 1));
  }
  const prevDay = () => {
    setDateValuesFromDate(new CalendarDate(year, month, day - 1));
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
      setEvents([]);
      const dates = calendarView === "month"
        ? getCalendarDates(year, month)
        : calendarView === "week"
          ? getDatesOfWeek(year, week)
          : calendarView === "day"
            ? [new Date(year, month, day).toISOString()]
            : [];

      setSearchTargetDate(new Date(year, month, calendarView === "day" ? day : 15).toISOString());

      const startDate = new Date(dates[0]);
      const lastDate = new Date(dates[dates.length - 1]);
      const formattedStartDate = getFormattedDate(startDate);
      const formattedLastDate = getFormattedDate(new Date(lastDate.setDate(lastDate.getDate() + 1)));

      if (calendarView === "month") {
        setMonthDates(dates);
      } else if (calendarView === "week") {
        setWeekDates(dates);
      }

      const locationData: MPLocation[] = await fetchLocations();
      const filteredLocations = locationData.filter(l => !l.Retired || settings.showRetiredLocations);
      setLocations(filteredLocations);

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
  }, [calendarView, year, month, week, day, fetchEvents, fetchLocations, toast]);

  const handleEventClick = (event: MPEvent): void => {
    setSelectedEvent(event);
    setIsEventPopupOpen(true);
  }

  useEffect(() => {
    getCalendarInformation();
  }, [getCalendarInformation]);

  useEffect(() => {
    setEvents(allEvents.filter(e => {
      const BookedBuildingIDs = e.Booked_Buildings ? e.Booked_Buildings.map((b: MPBuilding) => b.Building_ID) : [];
      const BookedRoomIDs = e.Booked_Rooms ? e.Booked_Rooms.map((r: MPRoom) => r.Room_ID) : [];
      return (selectedLocationID === '0' || e.Location_ID === parseInt(selectedLocationID))
        && (selectedBuildingID === '0' || BookedBuildingIDs.includes(parseInt(selectedBuildingID)))
        && (selectedRoomID === '0' || BookedRoomIDs.includes(parseInt(selectedRoomID)))
        && (!e.Cancelled || settings.showCancelledEvents)
    }
    ));
  }, [selectedLocationID, allEvents, selectedBuildingID, selectedRoomID]);

  useEffect(() => {
    setSelectedRoomID("0");
  }, [selectedBuildingID]);
  useEffect(() => {
    setSelectedRoomID("0");
    setSelectedBuildingID("0");
  }, [selectedLocationID]);

  useEffect(() => {
    const handleClick = (e: MouseEvent): void => {
      const datePickerContainerDOM = document.getElementById('date-picker-container');
      if (!datePickerContainerDOM || !e.target) return;

      const datePickerTriggers = Array.from(document.getElementsByClassName('date-picker-trigger'));
      const containerChildren = Array.from(datePickerContainerDOM.querySelectorAll("*"));
      const totalCheckElems = containerChildren.concat(datePickerTriggers);
      if (!totalCheckElems.find(elem => elem === e.target)) setIsDatePickerOpen(false);
    }
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    }
  }, []);

  return (
    <>
      {isDayPopupOpen !== null && !isEventPopupOpen && <DayPopup open={isDayPopupOpen} setOpen={setIsDayPopupOpen} date={selectedDay} handleClick={handleEventClick} events={events.filter(e => sameDay(correctForTimezone(e.Event_Start_Date), selectedDay))} />}
      {isEventPopupOpen !== null && selectedEvent && <EventPopup open={isEventPopupOpen} setOpen={setIsEventPopupOpen} event={selectedEvent} />}
      <article className="flex flex-col gap-2 md:gap-4 w-full overflow-hidden">
        <div className="w-full h-max bg-primary p-2 md:p-4 md:rounded-sm shadow-sm">
          <div className="mx-auto max-w-screen-xl grid grid-cols-4 md:grid-cols-2">

            <div className="col-span-3 md:col-span-1">
              <div className="w-max flex items-center relative">
                {calendarView === "month" && <>
                  <Button variant="icon" onClick={prevMonth}><FontAwesomeIcon icon={faArrowLeft} /></Button>
                  <button onClick={() => setIsDatePickerOpen(x => !x)} className="mx-2"><h1 className="date-picker-trigger md:text-xl text-lg mx-2 min-w-40 text-center whitespace-nowrap hover:underline">{months[month]} {year}</h1></button>
                  <Button variant="icon" onClick={nextMonth}><FontAwesomeIcon icon={faArrowRight} /></Button>
                </>}
                {calendarView === "week" && <>
                  <Button variant="icon" onClick={prevWeek}><FontAwesomeIcon icon={faArrowLeft} /></Button>
                  <button onClick={() => setIsDatePickerOpen(x => !x)} className="mx-2"><h1 className="date-picker-trigger md:text-xl text-base mx-2 text-center whitespace-nowrap hover:underline">{correctForTimezone(weekDates[0]).toLocaleDateString('en-us', { month: "short", day: "numeric" })} - {correctForTimezone(weekDates[weekDates.length - 1]).toLocaleDateString('en-us', { month: "short", day: "numeric" })}, {year}</h1></button>
                  <Button variant="icon" onClick={nextWeek}><FontAwesomeIcon icon={faArrowRight} /></Button>
                </>}
                {calendarView === "day" && <>
                  <Button variant="icon" onClick={prevDay}><FontAwesomeIcon icon={faArrowLeft} /></Button>
                  <button onClick={() => setIsDatePickerOpen(x => !x)} className="mx-2"><h1 className="date-picker-trigger md:text-xl text-base mx-2 text-center whitespace-nowrap hover:underline">{new Date(year, month, day).toLocaleDateString('en-us', { weekday: "short", month: "short", day: "numeric" })}, {year}</h1></button>
                  <Button variant="icon" onClick={nextDay}><FontAwesomeIcon icon={faArrowRight} /></Button>
                </>}

                {isDatePickerOpen && (
                  <div id="date-picker-container" className="absolute top-full left-1/2 -translate-x-1/2 translate-y-1 z-[999]">
                    <DatePicker year={year} month={month} week={week} day={day} calendarView={calendarView} handleSubmit={(d) => setDateValuesFromDate(d)} />
                  </div>
                )}
              </div>
            </div>

            <div className="hidden md:block w-96 ml-auto">
              <SearchBar targetDate={searchTargetDate} handleClick={handleEventClick} />
            </div>

            <div className="md:hidden bg-background rounded-full w-10 h-10 ml-auto overflow-hidden relative" onClick={() => setMobileFilterDropdownOpen(v => !v)}>
              <FontAwesomeIcon icon={mobileFilterDropdownOpen ? faClose : faBars} className="absolute top-0 right-0 text-textHeading grid place-items-center h-4 p-3 aspect-square" />
            </div>

            <div style={{ gridTemplateRows: mobileFilterDropdownOpen ? "1fr" : "0fr" }} className="md:block w-full col-span-4 grid transition-[grid-template-rows]">

              <div className="grid gap-2 overflow-hidden order-3 md:flex md:mt-2">
                <div className="md:hidden"></div>
                <div className="md:hidden">
                  <SearchBar targetDate={searchTargetDate} handleClick={handleEventClick} />
                </div>
                <Select value={calendarView} onValueChange={(val) => setCalendarView(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="week" className="hidden md:block">Week</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedLocationID} onValueChange={(val) => setSelectedLocationID(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Locations</SelectItem>
                    {locations.map(l => <SelectItem key={l.Location_ID} value={l.Location_ID.toString()}>{l.Location_Name}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={selectedBuildingID} onValueChange={(val) => setSelectedBuildingID(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Buildings</SelectItem>
                    {locations.find(l => l.Location_ID === parseInt(selectedLocationID))?.Buildings.map(b => <SelectItem key={b.Building_ID} value={b.Building_ID.toString()}>{b.Building_Name}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={selectedRoomID} onValueChange={(val) => setSelectedRoomID(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Rooms</SelectItem>
                    {locations.find(l => l.Location_ID === parseInt(selectedLocationID))?.Buildings.find(b => b.Building_ID === parseInt(selectedBuildingID))?.Rooms.map(r => <SelectItem key={r.Room_ID} value={r.Room_ID.toString()}>{r.Room_Name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

        </div>

        <div className="bg-primary grow md:rounded-sm shadow-sm p-2 md:p-4 overflow-auto">
          {calendarView === "month" && <MonthCalendar
            monthDates={monthDates}
            events={events}
            handleClick={(date: Date) => { setIsDayPopupOpen(true); setSelectedDay(date) }}
          />}
          {calendarView === "week" && <WeekCalendar
            weekDates={weekDates}
            events={events}
            getFormattedDate={getFormattedDate}
            handleClick={handleEventClick}
          />}
          {calendarView === "day" && <DayCalendar
            date={new Date(Date.UTC(year, month, day))}
            events={events}
            getFormattedDate={getFormattedDate}
            handleClick={handleEventClick}
          />}
        </div>
      </article>
    </>
  );
};
