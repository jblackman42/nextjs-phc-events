import Popup from './Popup';
import { MPEvent, MPRoom, correctForTimezone } from '@/lib/utils';

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let result = '';

  if (hours > 0) {
    result += `${hours} hr${hours > 1 ? 's' : ''}`;
  }

  if (remainingMinutes > 0) {
    if (hours > 0) {
      result += ' ';
    }
    result += `${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`;
  }

  return result || '0 mins';
}

function formatDisplayName(name: string | null): string {
  return name ? `${name.split(', ')[1]} ${name.split(', ')[0]}` : '';
}

function EventLabel({ label, value, style = "default" }: { label: string, value?: string | null, style?: "default" | "wide" }) {
  return value && <div style={{ gridColumn: `span ${style === "wide" ? "3" : "1"}` }}>
    <p className="text-xs whitespace-nowrap">{label}:</p>
    {style === "wide"
      ? <p className="text-textHeading bg-primary p-2 mt-1 rounded-sm shadow-md max-h-24 overflow-y-auto custom-scroller">{value}</p>
      : <p title={value} className="text-textHeading whitespace-nowrap overflow-hidden text-ellipsis">{value}</p>
    }
  </div>
}

function pullNumberFromString(str: string): number {
  const matches = str.match(/(\d+)/);
  return !matches ? Infinity : parseInt(matches[0])
}

function EventPopup({ open = null, setOpen, event }: { open: Boolean | null, setOpen: Function, event: MPEvent }) {

  const eventDate = correctForTimezone(event.Event_Start_Date).toLocaleDateString('en-us', { day: "numeric", month: "short", year: "numeric" });
  const startTime = correctForTimezone(event.Event_Start_Date).toLocaleTimeString('en-us', { hour: "numeric", minute: "2-digit" });
  const endTime = correctForTimezone(event.Event_End_Date).toLocaleTimeString('en-us', { hour: "numeric", minute: "2-digit" });
  const bookedRoomsNames = event.Booked_Rooms.map((r: MPRoom) => r.Room_Name).sort((a, b) => pullNumberFromString(a) - pullNumberFromString(b)).join(", ");

  return event && <Popup open={open} setOpen={setOpen} >
    <div className="max-h-[90dvh] h-max flex flex-col overflow-hidden">
      <div className="sticky top-0 bg-secondary p-2 border-b-4 border-accent shadow-md">
        <h1 className="pr-6">{event.Event_Title}</h1>
      </div>
      <div className="max-h-[600px] grid grid-cols-3 gap-1 md:gap-2 p-1 md:p-2 bg-secondary custom-scroller overflow-auto">
        <EventLabel label="Event Date" value={eventDate} />
        <EventLabel label="Event Time" value={`${startTime} - ${endTime}`} />
        <EventLabel label="Minutes for Setup" value={formatMinutes(event.Minutes_for_Setup)} />
        <EventLabel label="Primary Contact" value={formatDisplayName(event.Primary_Contact)} />
        <EventLabel label="Event Type" value={event.Event_Type} />
        <EventLabel label="Minutes for Cleanup" value={formatMinutes(event.Minutes_for_Cleanup)} />
        <EventLabel label="Location" value={event.Location_Name} />
        <EventLabel label="Congregation" value={event.Congregation_Name} />
        <EventLabel label="Program" value={event.Program_Name} />
        <EventLabel label="Visibility" value={event.Visibility_Level.includes(' - ') ? event.Visibility_Level.split(' - ')[1] : event.Visibility_Level} />
        <EventLabel label="Featured" value={event.Featured_On_Calendar ? "True" : "False"} />
        <EventLabel label="Created By" value={formatDisplayName(event.Created_By)} />
        <EventLabel style="wide" label="Description" value={event.Description} />
        <EventLabel style="wide" label="Meeting Instructions" value={event.Meeting_Instructions} />
        <EventLabel style="wide" label="Booked Rooms" value={bookedRoomsNames} />
        {event.Requested_Services.length > 0 && (
          <div className="col-span-3">
            <p className="text-xs">Services Requested:</p>
            {event.Requested_Services.map((service, i) => {
              return <div key={i} className="bg-primary p-2 mt-1 rounded-sm shadow-md grid grid-cols-3 gap-2">
                <EventLabel label="Service" value={service.Service_Name} />
                <EventLabel label="Contact" value={formatDisplayName(service.Service_Contact)} />
                <EventLabel label="Approved" value={service.Approved ? "True" : "False"} />
              </div>
            })}
          </div>
        )}

      </div>
    </div>
  </Popup>
}

export default EventPopup;