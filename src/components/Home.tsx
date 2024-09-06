import { Suspense } from "react";
// import MonthCalendar from "./month/MonthCalendar";
import MonthCalendarSkeleton from "./month/MonthCalendarSkeleton";
import Calendar from "./Calendar";
import CalendarOptions from "./options/CalendarOptions";

const Home = async () => {

  return <>
    <article className="w-full flex flex-col p-4 gap-4 overflow-hidden">
      <div className="w-full h-max md:rounded-sm">
        <CalendarOptions />


      </div>

      <div className="grow md:rounded-sm overflow-auto custom-scroller">
        <Suspense fallback={<MonthCalendarSkeleton />}>
          <Calendar />
        </Suspense>
      </div>
    </article>
  </>
}

export default Home;