"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getHaInformation, getQuestionAnswers } from "@/app/actions";
import { Congregation, HaSection, HaQuestion } from "@/lib/types";

import { BarChartComponent, PieChartComponent } from "@/components/charts";


const Ha = ({ congregations }: { congregations: Congregation[] }) => {
  const [giving, setGiving] = useState<HaQuestion | null>(null);
  const [attendance, setAttendance] = useState<HaQuestion | null>(null);

  const [givingPerPerson, setGivingPerPerson] = useState<HaQuestion | null>(null);

  useEffect(() => {
    const getMinistryAnswers = async () => {

      // await getQuestionAnswers(2).then(data => data && setGiving(data));
      // await getQuestionAnswers(56).then(data => data && setAttendance(data));
      await getQuestionAnswers(57).then(data => data && setGivingPerPerson(data));
    };
    getMinistryAnswers();
  }, []);

  return <article className="flex flex-col gap-4 w-full">
    <p>ha</p>

    {/* {totalGiving.length > 0 && <div>
      <p>Total Giving</p>
      <p>{congregations.reduce((acc, c) => acc + (totalGiving[totalGiving.length - 1][c.Congregation_Name] as number || 0), 0)}</p>  
    </div>} */}

    <div className="grid grid-cols-2 gap-4">
      {/* {giving && <BarChartComponent congregations={congregations} data={giving} />} */}
      {/* {attendance && <BarChartComponent congregations={congregations} data={attendance} />} */}
      {givingPerPerson && <BarChartComponent congregations={congregations} data={givingPerPerson} />}
      {/* {giving && <PieChartComponent data={giving} />} */}
    </div>
  </article>
};

export default Ha;