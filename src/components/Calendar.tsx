import axios from "axios";
import { MPEvent } from "@/lib/types";
import { ToastClientComponent } from '@/components'; // Import the client component

const getEvents = async (startDate: string, endDate: string): Promise<MPEvent[]> => {
  return axios({
    method: "GET",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/events`,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY
    },
    params: { startDate, endDate }
  }).then(response => response.data);
}

const Calendar = async () => {
  let events: MPEvent[] = [];
  let errorMessage = '';

  try {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + (1000 * 60 * 60 * 24));
    events = await getEvents(today.toISOString(), tomorrow.toISOString());
  } catch (error) {
    // console.log('Failed to get events:', error);
    errorMessage = "Failed to retrieve events.";
  }
  return <>
    <div>
      <h1>Calendar</h1>
      {events.map(event => <>
        <p>{event.Event_Title}</p>
      </>)}
    </div>
    {errorMessage && <ToastClientComponent key={errorMessage} message={errorMessage} variant="destructive" />}
  </>;
};

export default Calendar;
