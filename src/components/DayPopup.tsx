import { useContext, useEffect } from 'react';
import Popup from './Popup';
import { UserContext, MPEvent, correctForTimezone } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';



function DayPopup({ open = null, setOpen, date, events }: { open: Boolean | null, setOpen: Function, date: Date, events: MPEvent[] }) {
  const { user } = useContext(UserContext);

  return user && <Popup open={open} setOpen={setOpen}>
    <div className="max-h-[600px]">
      <div>
        <h1>{date.toLocaleDateString('en-us', { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</h1>
        <p>{events.length} Events</p>
        <Separator className="my-4" />
      </div>
      <div>
        {events.map((event, i) => {
          const startTime = correctForTimezone(event.Event_Start_Date).toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' });
          const endTime = correctForTimezone(event.Event_End_Date).toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' });
          return <div key={i}>
            {i !== 0 && <Separator className="my-4" />}
            <div className="flex justify-between items-center">
              <h1 className="text-textHeading text-lg">{event.Event_Title}</h1>
              <Button variant="thin" size="sm">More Info</Button>
            </div>
            <div className="grid grid-cols-3">
              <p className="w-max">{startTime} - {endTime}</p>
              <p className="text-center">{event.Event_Type}</p>
              <p className="text-right">{event.Location_Name}</p>
            </div>
          </div>
        })}
      </div>
    </div>
  </Popup>
}

export default DayPopup;