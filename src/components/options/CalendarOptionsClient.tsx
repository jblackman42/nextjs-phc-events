"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useView } from "@/context/ViewContext";
import { MPBuildingWithRooms, MPLocation } from "@/lib/types";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/inputs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faBars, faClose } from "@awesome.me/kit-10a739193a/icons/classic/light";
import { Button } from '@/components/ui/button';
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function CalendarOptionsClient({ locations }: { locations: MPLocation[] }) {
  const { view, setView, nextPeriod, prevPeriod } = useView();

  const [selectedLocation, setSelectedLocation] = useState<MPLocation | undefined>(undefined);
  const [selectedBuilding, setSelectedBuilding] = useState<MPBuildingWithRooms | undefined>(undefined);

  const [mobileFilterDropdownOpen, setMobileFilterDropdownOpen] = useState<boolean>(false);

  const [prevLocationID, setPrevLocationID] = useState<number | undefined>();
  const [prevBuildingID, setPrevBuildingID] = useState<number | undefined>();

  useEffect(() => {
    setPrevLocationID(view.location_id);
    const location = locations.find(l => l.Location_ID === view.location_id);
    setSelectedLocation(location);

    setPrevBuildingID(view.building_id);
    const building = location?.Buildings.find(b => b.Building_ID === view.building_id);
    setSelectedBuilding(building);
  }, [view.location_id, view.building_id, view.room_id, locations, setView]);

  useEffect(() => {
    if (view.location_id !== prevLocationID) {
      setView('building_id', 0);
    }
    if (view.building_id !== prevBuildingID) {
      setView('room_id', 0);
    }
  }, [view.location_id, view.building_id, prevLocationID, prevBuildingID, setView]);

  return (
    <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-2">
      <div className="flex items-center md:col-span-2 relative">
        <Button variant="icon" onClick={prevPeriod}><FontAwesomeIcon icon={faArrowLeft} /></Button>
        <button><h1 className="date-picker-trigger md:text-xl text-lg mx-2 min-w-40 text-center whitespace-nowrap hover:underline">{months[view.current_date.getUTCMonth()]} {view.current_date.getUTCFullYear()}</h1></button>
        <Button variant="icon" onClick={nextPeriod}><FontAwesomeIcon icon={faArrowRight} /></Button>
      </div>

      <button onClick={() => setMobileFilterDropdownOpen(v => !v)} className="grid place-items-center md:hidden bg-background rounded-full w-10 h-10 ml-auto overflow-hidden relative">
        <FontAwesomeIcon icon={mobileFilterDropdownOpen ? faClose : faBars} className="text-xl text-textHeading" />
      </button>

      <div className="hidden md:block w-full  ml-auto col-start-4">
        <SearchBar />
      </div>

      <div style={{ gridTemplateRows: mobileFilterDropdownOpen ? "1fr" : "0fr" }} className="md:block w-full col-span-full grid transition-[grid-template-rows]">
        <div className="col-span-full flex gap-2 flex-col md:flex-row md:mt-2 overflow-hidden">
          <div className="md:hidden"></div>
          <div className="md:hidden">
            <SearchBar />
          </div>
          <Select value={view.periodical} onValueChange={(val) => setView('periodical', val)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week" className="hidden md:block">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>

          <Select value={view.location_id.toString()} onValueChange={(val) => { setView('location_id', parseInt(val)); }}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Locations</SelectItem>
              {locations.map((l) => (
                <SelectItem key={l.Location_ID} value={l.Location_ID.toString()}>{l.Location_Name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={view.building_id.toString()} onValueChange={(val) => setView('building_id', parseInt(val))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Buildings</SelectItem>
              {selectedLocation?.Buildings.map((b) => (
                <SelectItem key={b.Building_ID} value={b.Building_ID.toString()}>{b.Building_Name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={view.room_id.toString()} onValueChange={(val) => setView('room_id', parseInt(val))}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Rooms</SelectItem>
              {selectedBuilding?.Rooms.map((r) => (
                <SelectItem key={r.Room_ID} value={r.Room_ID.toString()}>{r.Room_Name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

    </div>
  );
}

export default CalendarOptionsClient;