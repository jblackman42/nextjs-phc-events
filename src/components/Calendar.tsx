"use client";
import { useState, useEffect } from "react";
import { MPEvent, MPLocation, CalendarDate } from "@/lib/types";
import MonthCalendar from "./MonthCalendar";
import { View, useView } from "@/context/ViewContext";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const Calendar = ({ initialDate, initialEvents, initialDates, locations }: { initialDate: Date, initialEvents: MPEvent[], initialDates: string[], locations: MPLocation[] }) => {
  const { view, setView } = useView();

  const currDate = new CalendarDate(initialDate);
  const [week, setWeek] = useState<number>(currDate.getWeek());
  const [month, setMonth] = useState<number>(currDate.getUTCMonth());
  const [year, setYear] = useState<number>(currDate.getUTCFullYear());
  const [day, setDay] = useState<number>(currDate.getUTCDate());
  const [monthDates, setMonthDates] = useState<Array<string>>(initialDates);
  const [weekDates, setWeekDates] = useState<Array<string>>([]);
  const [allEvents, setAllEvents] = useState<Array<MPEvent>>(initialEvents);
  const [events, setEvents] = useState<Array<MPEvent>>(initialEvents);
  const [selectedLocationID, setSelectedLocationID] = useState<string>("0");
  const [selectedBuildingID, setSelectedBuildingID] = useState<string>("0");
  const [selectedRoomID, setSelectedRoomID] = useState<string>("0");
  const [selectedEvent, setSelectedEvent] = useState<MPEvent | undefined>();

  const [searchTargetDate, setSearchTargetDate] = useState<string>();

  const [isDayPopupOpen, setIsDayPopupOpen] = useState<boolean | null>(null);
  const [isEventPopupOpen, setIsEventPopupOpen] = useState<boolean | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);

  const [mobileFilterDropdownOpen, setMobileFilterDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    setSelectedRoomID("0");
  }, [selectedBuildingID]);
  useEffect(() => {
    setSelectedRoomID("0");
    setSelectedBuildingID("0");
  }, [selectedLocationID]);

  return <>
    <article className="flex flex-col gap-2 md:gap-4 w-full overflow-hidden">
      <div className="w-full h-max bg-primary p-2 md:p-4 md:rounded-sm shadow-sm">
        <div className="mx-auto max-w-screen-xl grid grid-cols-4 md:grid-cols-2">

          <div className="col-span-3 md:col-span-1">
            <div className="w-max flex items-center relative">
              {/* {calendarView === "month" && <>
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
              )} */}
            </div>
          </div>

          {/* <div className="hidden md:block w-96 ml-auto">
            <SearchBar targetDate={searchTargetDate} handleClick={handleEventClick} />
          </div> */}

          {/* <div className="md:hidden bg-background rounded-full w-10 h-10 ml-auto overflow-hidden relative" onClick={() => setMobileFilterDropdownOpen(v => !v)}>
            <FontAwesomeIcon icon={mobileFilterDropdownOpen ? faClose : faBars} className="absolute top-0 right-0 text-textHeading grid place-items-center h-4 p-3 aspect-square" />
          </div> */}

          <div style={{ gridTemplateRows: mobileFilterDropdownOpen ? "1fr" : "0fr" }} className="md:block w-full col-span-4 grid transition-[grid-template-rows]">

            <div className="grid gap-2 overflow-hidden order-3 md:flex md:mt-2">
              <div className="md:hidden"></div>
              {/* <div className="md:hidden">
                <SearchBar targetDate={searchTargetDate} handleClick={handleEventClick} />
              </div> */}
              <Select value={view} onValueChange={(val: View) => setView(val)}>
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
        <MonthCalendar
          monthDates={monthDates}
          events={events}
          handleClick={(date: Date) => console.log(date)}
        />
      </div>
    </article>
  </>
}

export default Calendar;