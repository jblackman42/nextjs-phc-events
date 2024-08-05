import { Suspense } from "react";
// import MonthCalendar from "./month/MonthCalendar";
import MonthCalendarSkeleton from "./month/MonthCalendarSkeleton";
import Calendar from "./Calendar";
import CalendarOptions from "./options/CalendarOptions";

const Home = async () => {

  return <>
    <article className="flex flex-col gap-2 md:gap-4 w-full overflow-hidden">
      <div className="w-full h-max bg-primary p-2 md:p-4 md:rounded-sm shadow-sm">
        {/* <div className="mx-auto max-w-screen-xl grid grid-cols-4 md:grid-cols-2">

          <div className="col-span-3 md:col-span-1">
            <h1>Gotta turn these options to a component now :/</h1>
          </div>
        </div> */}
        <CalendarOptions />


      </div>

      <div className="bg-primary grow md:rounded-sm shadow-sm p-2 md:p-4 overflow-auto">
        <Suspense fallback={<MonthCalendarSkeleton />}>
          <Calendar />
        </Suspense>
      </div>
    </article>
  </>
}

export default Home;