import { getLocations } from "@/app/actions"
import CalendarOptionsClient from "./CalendarOptionsClient"

const CalendarOptions = async () => {
  const locations = await getLocations();

  return <CalendarOptionsClient locations={locations} />
}

export default CalendarOptions