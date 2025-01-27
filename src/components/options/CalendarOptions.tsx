import { getLocations } from "@/app/actions"
import CalendarOptionsClient from "@/components/options/CalendarOptionsClient"

const CalendarOptions = async () => {
  const locations = await getLocations();

  return <CalendarOptionsClient locations={locations} />
}

export default CalendarOptions