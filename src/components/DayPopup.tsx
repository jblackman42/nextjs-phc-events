import Popup from './Popup';
import { MPEvent, correctForTimezone } from '@/lib/utils';

function DayPopup({ open = null, setOpen, date, events }: { open: Boolean | null, setOpen: Function, date: Date, events: MPEvent[] }) {
  return <Popup open={open} setOpen={setOpen}>
    <div className="max-h-[90dvh] h-max flex flex-col overflow-hidden">
      <div className="sticky top-0 bg-secondary p-2 border-b-4 border-primary shadow-md">
        <h1>{date.toLocaleDateString('en-us', { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</h1>
        <p>{events.length} Event{events.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="max-h-[550px] grid gap-2 p-2 bg-secondary custom-scroller overflow-auto">
        {events.map((event, i) => {
          const startTime = correctForTimezone(event.Event_Start_Date).toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' });
          const endTime = correctForTimezone(event.Event_End_Date).toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' });
          const pcDisplayName = `${event.Primary_Contact.split(', ')[1]} ${event.Primary_Contact.split(', ')[0]}`
          return <button key={i}>
            <div style={{ borderColor: event.Featured_On_Calendar ? "#fcc200" : "" }} className="grid grid-cols-2 text-sm bg-primary p-2 rounded-sm border-l-4 border-accent transition-[border-width] hover:border-l-8 shadow-md text-left">
              <p className="col-start-1">{event.Event_Type}</p>
              <p className="col-start-2 text-right">{pcDisplayName}</p>
              <p className="col-span-2 text-textHeading text-lg font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{event.Event_Title}</p>
              <p className="col-start-1">{startTime} - {endTime}</p>
              <p className="col-start-2 text-right">{event.Location_Name}</p>
            </div>
          </button>
        })}
      </div>
    </div>
  </Popup>
}

export default DayPopup;