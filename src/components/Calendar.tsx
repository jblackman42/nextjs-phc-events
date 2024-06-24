import axios from 'axios';
import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight, faBars, faClose, faCross, faHamburger, faMagnifyingGlass } from '@awesome.me/kit-10a739193a/icons/classic/light';
import { LoadingContext, MPEvent, MPLocation, correctForTimezone, CalendarDate, getFormattedDate, MPBuilding, settings } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import WeekCalendar from './WeekCalendar';
import DayCalendar from './DayCalendar';
import MonthCalendar from './MonthCalendar';
import DayPopup from './DayPopup';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function findCommonElement(array1: any[], array2: any[]) {
  for (let i = 0; i < array1.length; i++) {
    for (let j = 0; j < array2.length; j++) {
      if (array1[i] === array2[j]) {
        return true;
      }
    }
  }
  return false;
}

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
  const [buildingsRooms, setBuildingsRooms] = useState<Array<MPBuilding>>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("All Locations");
  const [selectedBuilding, setSelectedBuilding] = useState<string>("All Buildings");
  const [selectedRoom, setSelectedRoom] = useState<string>("All Rooms");
  const [calendarView, setCalendarView] = useState<string>('month');

  const [isDayPopupOpen, setIsDayPopupOpen] = useState<boolean>(true);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const [mobileFilterDropdownOpen, setMobileFilterDropdownOpen] = useState<boolean>(false);

  const setDateValuesFromDate = (date: CalendarDate): void => {
    // console.log(year
    //   , month
    //   , week
    //   , day);
    // console.log(date.getUTCFullYear()
    //   , date.getUTCMonth()
    //   , date.getWeek()
    //   , date.getUTCDate());
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
      // const testWeekDates = getDatesOfWeek(year, week);
      // if (week === 53 && new Date(testWeekDates[testWeekDates.length - 1]).getFullYear() > year) {
      //   setWeek(1);
      //   setYear(year + 1);
      //   return;
      // }
      const dates = calendarView === "month"
        ? getCalendarDates(year, month)
        : calendarView === "week"
          ? getDatesOfWeek(year, week)
          : calendarView === "day"
            ? [new Date(year, month, day).toISOString()]
            : [];

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
      const allBuildingRooms: MPBuilding[] = [];
      locationData.forEach(location => {
        const allBuildings = location.Buildings ? location.Buildings.split(", ") : [];
        allBuildings.forEach(buildingName => {
          const currBuildingRooms = location.Rooms ? location.Rooms.split(", ").filter(roomName => roomName.includes(buildingName)).map(roomName => roomName.split(":")[1]) : [];
          const building: MPBuilding = {
            Location_Name: location.Location_Name,
            Building_Name: buildingName,
            Rooms: currBuildingRooms
          };
          allBuildingRooms.push(building);
        })
      })
      const allLocations = locationData.filter(location => !location.Retired);
      setLocations(allLocations);
      setBuildingsRooms(allBuildingRooms);

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

  useEffect(() => {
    getCalendarInformation();
  }, [getCalendarInformation]);

  useEffect(() => {
    const currSelectedBuilding = buildingsRooms.find(b => b.Building_Name === selectedBuilding);
    setEvents(allEvents.filter(e => {
      const currEventRooms = e.Booked_Rooms ? e.Booked_Rooms.split(", ") : [];
      return (selectedLocation === 'All Locations' || e.Location_Name === selectedLocation)
        && (selectedBuilding === 'All Buildings' || findCommonElement(currEventRooms, currSelectedBuilding ? currSelectedBuilding.Rooms : []))
        && (selectedRoom === 'All Rooms' || currEventRooms.includes(selectedRoom))
        && (!e.Cancelled || settings.showCancelled)
    }
    ));
  }, [selectedLocation, allEvents, buildingsRooms, selectedBuilding, selectedRoom]);

  useEffect(() => {
    setSelectedRoom("All Rooms");
  }, [selectedBuilding]);
  useEffect(() => {
    setSelectedRoom("All Rooms");
    setSelectedBuilding("All Buildings");
  }, [selectedLocation]);

  return (
    <>
      <DayPopup open={isDayPopupOpen} setOpen={setIsDayPopupOpen} date={selectedDay} events={events.filter(e => sameDay(correctForTimezone(e.Event_Start_Date), selectedDay))} />
      <article className="flex flex-col gap-2 md:gap-4 w-full overflow-hidden">
        <div className="w-full h-max bg-primary p-2 md:p-4 md:rounded-sm shadow-sm">
          <div className="mx-auto max-w-screen-xl grid grid-cols-4 md:grid-cols-2 overflow-hidden">

            <div className="flex col-span-3 md:col-span-1 items-center">
              {calendarView === "month" && <>
                <Button variant="icon" onClick={prevMonth}><FontAwesomeIcon icon={faArrowLeft} /></Button>
                <h1 className="md:text-xl text-lg mx-2 text-center whitespace-nowrap">{months[month]} {year}</h1>
                <Button variant="icon" onClick={nextMonth}><FontAwesomeIcon icon={faArrowRight} /></Button>
              </>}
              {calendarView === "week" && <>
                <Button variant="icon" onClick={prevWeek}><FontAwesomeIcon icon={faArrowLeft} /></Button>
                <h1 className="md:text-xl text-base mx-2 text-center whitespace-nowrap">{correctForTimezone(weekDates[0]).toLocaleDateString('en-us', { month: "short", day: "numeric" })} - {correctForTimezone(weekDates[weekDates.length - 1]).toLocaleDateString('en-us', { month: "short", day: "numeric" })}, {year}</h1>
                <Button variant="icon" onClick={nextWeek}><FontAwesomeIcon icon={faArrowRight} /></Button>
              </>}
              {calendarView === "day" && <>
                <Button variant="icon" onClick={prevDay}><FontAwesomeIcon icon={faArrowLeft} /></Button>
                <h1 className="md:text-xl text-base mx-2 text-center whitespace-nowrap">{new Date(year, month, day).toLocaleDateString('en-us', { weekday: "short", month: "short", day: "numeric" })}, {year}</h1>
                <Button variant="icon" onClick={nextDay}><FontAwesomeIcon icon={faArrowRight} /></Button>
              </>}
            </div>

            <div className="hidden md:block bg-background rounded-full h-10 min-w-[294px] ml-auto overflow-hidden relative" onClick={() => setMobileFilterDropdownOpen(v => !v)}>
              <input type="text" placeholder="Search Events..." className="w-full h-full outline-none bg-transparent pl-4 pr-8 text-textHeading" />
              <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute top-0 right-0 text-textHeading grid place-items-center h-4 p-3 aspect-square" />
            </div>

            <div className="md:hidden bg-background rounded-full w-10 h-10 ml-auto overflow-hidden relative" onClick={() => setMobileFilterDropdownOpen(v => !v)}>
              <FontAwesomeIcon icon={mobileFilterDropdownOpen ? faClose : faBars} className="absolute top-0 right-0 text-textHeading grid place-items-center h-4 p-3 aspect-square" />
            </div>

            <div style={{ gridTemplateRows: mobileFilterDropdownOpen ? "1fr" : "0fr" }} className="md:block w-full col-span-4 grid transition-[grid-template-rows]">

              <div className="grid gap-2 order-3 overflow-hidden md:flex md:mt-2">
                <div className="md:hidden"></div>
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

                <Select value={selectedLocation} onValueChange={(val) => setSelectedLocation(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Locations">All Locations</SelectItem>
                    {locations.map((location, i) => <SelectItem key={i} value={location.Location_Name}>{location.Location_Name}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={selectedBuilding} onValueChange={(val) => setSelectedBuilding(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Buildings">All Buildings</SelectItem>
                    {buildingsRooms.filter(br => br.Location_Name === selectedLocation).map((building, i) => <SelectItem key={i} value={building.Building_Name}>{building.Building_Name}</SelectItem>)}
                  </SelectContent>
                </Select>

                <Select value={selectedRoom} onValueChange={(val) => setSelectedRoom(val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Rooms">All Rooms</SelectItem>
                    {buildingsRooms.find(br => br.Building_Name === selectedBuilding)?.Rooms.map((room, i) => <SelectItem key={i} value={room}>{room}</SelectItem>)}
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
            handleClick={() => console.log('yeet')}
          />}
          {calendarView === "day" && <DayCalendar
            date={new Date(Date.UTC(year, month, day))}
            events={events}
            getFormattedDate={getFormattedDate}
            handleClick={() => console.log('yeet')}
          />}
        </div>
      </article>
    </>
  );
};
