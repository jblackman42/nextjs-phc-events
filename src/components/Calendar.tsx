import axios from "axios";
import { MPEvent } from "@/lib/types";

const getEvents = async (startDate: string, endDate: string): Promise<MPEvent[]> => {
  try {
    return axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY
      },
      params: { startDate, endDate }
    }).then(response => response.data);
  } catch (error) {
    return [];
  }
}

const Calendar = async () => {
  const today = new Date();
  const tomorrow = new Date(today.getTime() + (1000 * 60 * 60 * 24));
  const events = await getEvents(today.toISOString(), tomorrow.toISOString());
  return (
    <div>
      <h1>Calendar</h1>
      {events.map(event => <>
        <p>{event.Event_Title}</p>
      </>)}
    </div>
  );
};

export default Calendar;
