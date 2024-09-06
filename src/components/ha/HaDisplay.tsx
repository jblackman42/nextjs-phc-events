"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getHaInformation } from "@/app/actions";
import { Congregation, HaSection, HaQuestionData } from "@/lib/types";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import MonthSelector from "@/components/ui/month-selector";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@awesome.me/kit-10a739193a/icons/classic/solid';
import { Separator } from "@/components/ui/separator";

function roundUp(num: number): number {
  if (num === 0) return 1;
  // Find the magnitude of the number
  const magnitude = Math.pow(10, Math.floor(Math.log10(num)));

  // Check if the number is already a perfect multiple of the magnitude
  if (num % magnitude === 0) {
    return num;
  }

  // Round up to the next multiple of the magnitude
  return Math.ceil(num / magnitude) * magnitude;
}

const QuestionCard = ({ questionData }: { questionData: HaQuestionData }) => {
  const { Ministry_Question_ID, Question_Header, Question_Description, Answer_Label, Answer_Format, Current_Total, Previous_Total, Current_Year, Previous_Year } = questionData;
  const maxValue = roundUp(Math.max(Current_Total, Previous_Total));

  const valuePrefix = Answer_Format === "C" ? "$" : "";

  return <div className="p-4 rounded-md border flex flex-col items-start bg-background relative">
    {Question_Description && <div className="absolute top-0 right-0 py-1 p-2">
      <HoverCard>
        <HoverCardTrigger><FontAwesomeIcon icon={faInfoCircle} /></HoverCardTrigger>
        <HoverCardContent align="end">
          <div className="p-2 border rounded-sm">
            <h4 className="text-base font-semibold text-center">Question Description</h4>
            <Separator className="my-1" />
            <p className="text-sm">{Question_Description}</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>}

    <h4 className="text-xl text-center">{Question_Header}</h4>

    {Current_Total !== null && <>
      <h4 className="text-2xl mt-2">{valuePrefix}{Current_Total} <span className="text-sm font-normal opacity-60">{Answer_Label}</span></h4>
      <div style={{ width: `${(Current_Total / maxValue) * 100}%` }} className="h-8 min-w-max bg-accent rounded-md flex items-center px-2">
        <p>{Current_Year}</p>
      </div>
    </>}
    {Current_Total === null && <>
      <p>No data found for {Current_Year}</p>
    </>}

    {Previous_Total !== null && <>
      <h4 className="text-2xl mt-2">{valuePrefix}{Previous_Total} <span className="text-sm font-normal opacity-60">{Answer_Label}</span></h4>
      <div style={{ width: `${(Previous_Total / maxValue) * 100}%` }} className="h-8 min-w-max bg-muted rounded-md flex items-center px-2">
        <p>{Previous_Year}</p>
      </div>
    </>}
  </div>
}

const Ha = ({ congregations }: { congregations: Congregation[] }) => {
  const [selectedCongregationID, setSelectedCongregationID] = useState<number>(0);
  const [selectedSectionID, setSelectedSectionID] = useState<number>(0);
  const [haSections, setHaSections] = useState<HaSection[]>([]);

  const today = new Date();
  const initialDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1)); //defaults to the first date of the previous month
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);

  // const [sections, setSections] = useState<SectionsProps[]>();
  // const [questionData, setQuestionData] = useState<QuestionDataProps[]>([]);
  // const [congregations, setCongregations] = useState<CongregationsProps[]>();
  // const [categories, setCategories] = useState<CategoriesProps[]>([]);
  // const [months, setMonths] = useState<MonthsProps[]>();
  // const [selectedMonth, setSelectedMonth] = useState<MonthsProps>();
  // const [congregationID, setCongregationID] = useState(congregation);

  // Use firstDayOfMonth as needed
  useEffect(() => {
    (async () => {
      const year = selectedDate.getUTCFullYear();
      const month = selectedDate.getUTCMonth();
      const healthAssessment = await getHaInformation(year, month, selectedCongregationID);
      // setSelectedSectionID(healthAssessment[0].Question_Section_ID);
      setHaSections(healthAssessment);
    })()
  }, [selectedDate, selectedCongregationID]);

  return <>
    <article className="w-full flex flex-col p-4 gap-4 overflow-hidden">
      <div className="max-w-screen-xl w-full mx-auto grid gap-2 grid-cols-3">
        <MonthSelector value={selectedDate} onValueChange={(val) => setSelectedDate(val)} />
        <Select value={selectedCongregationID.toString()} onValueChange={(val) => setSelectedCongregationID(parseInt(val))}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Congregations</SelectItem>
            {congregations.map(congregation => <SelectItem key={congregation.Congregation_ID} value={congregation.Congregation_ID.toString()}>{congregation.Congregation_Name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={selectedSectionID.toString()} onValueChange={(val) => setSelectedSectionID(parseInt(val))}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">All Sections</SelectItem>
            {haSections.map(section => <SelectItem key={section.Question_Section_ID} value={section.Question_Section_ID.toString()}>{section.Question_Section}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-auto custom-scroller">
        <div className="max-w-screen-xl w-full mx-auto grid gap-4">
          {haSections.filter(section => section.Question_Section_ID === selectedSectionID || selectedSectionID === 0).map(section => {
            const { Question_Section_ID, Question_Section, Questions } = section;
            return <div key={Question_Section_ID} className="grid gap-2">
              {Questions.map(category => {
                const { Question_Category_ID, Question_Category, Question_Data } = category;
                const QL = Question_Data.length;
                const numOfColums = QL < 4 ? QL : 4;
                return <div key={`${Question_Section_ID}-${Question_Category_ID}`} style={{ gridTemplateColumns: `repeat(${numOfColums}, minmax(0, 1fr))` }} className="grid grid-cols-2 w-full h-max p-2 gap-2 border rounded-md bg-primary shadow-md">
                  <h4 className="col-span-full text-lg">{Question_Category}</h4>
                  {Question_Data.map(data => <QuestionCard key={`${Question_Section_ID}-${Question_Category_ID}-${data.Ministry_Question_ID}`} questionData={data} />)}
                </div>
              })}
            </div>
            // return <div key={Question_Section_ID} className="grid grid-cols-2 gap-2">
            //   <h1 className="text-center col-span-full">{Question_Section}</h1>
            //   {Questions.map(category => {
            //     const { Question_Category_ID, Question_Category, Question_Data } = category;
            //     return <div key={Question_Category_ID} className="w-full p-4 border rounded-md shadow-md bg-secondary">
            //       <h4 className="text-lg text-center">{Question_Category}</h4>
            //       <div>
            //         <div className="grid grid-cols-3 gap-2">
            //           <p className="font-bold">Question Header</p>
            //           <p className="font-bold">Months Value</p>
            //           <p className="font-bold">Previous Year&apos;s Value</p>
            //         </div>
            //         {Question_Data.map(data => {
            //           const { Ministry_Question_ID, Question_Header, Current_Total, Previous_Total } = data;
            //           return <div key={Ministry_Question_ID} className="grid grid-cols-3 gap-2">
            //             <p>{Question_Header}</p>
            //             <p>{Current_Total}</p>
            //             <p>{Previous_Total}</p>
            //           </div>
            //         })}
            //       </div>
            //     </div>
            //   })}
            // </div>
          })}
        </div>
      </div>
    </article>
  </>
};

export default Ha;