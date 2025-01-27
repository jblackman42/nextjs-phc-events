import { CalendarWrapper } from "@/components/pages";
import { CalendarOptions } from "@/components/options";
import { PageDefaults } from "@/components";

const Home = async () => {

  return <main className="bg-background text-textHeading h-[100dvh] max-w-[100vw] flex">
    <PageDefaults />

    <article className="w-full flex flex-col p-4 gap-4 overflow-hidden">
      <div className="w-full h-max md:rounded-sm">
        <CalendarOptions />
      </div>

      <div className="grow md:rounded-sm overflow-auto custom-scroller">
        <CalendarWrapper />
      </div>
    </article>
  </main>
}

export default Home;