"use client";

import { useView } from "@/context/ViewContext";
import { useEffect } from "react";

function CalendarOptions() {
  const { view } = useView();

  useEffect(() => {
    console.log(view);
  }, [view]);

  return <>
    <h1>Gotta turn the options into a comp now</h1>
  </>
}

export default CalendarOptions