"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getHaInformation } from "@/app/actions";
import { Congregation, HaSection, HaQuestionData } from "@/lib/types";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import MonthSelector from "@/components/ui/month-selector";
import { Loading } from "@/components";
import { MinistryQuestionPopup } from "@/components/popups";

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

function numberWithCommas(x: number): string {
  let result = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(result))
    result = result.replace(pattern, "$1,$2");
  return result;
}

const QuestionCard = ({ questionData }: { questionData: HaQuestionData }) => {
  const { Ministry_Question_ID, Question_Header, Question_Description, Answer_Label, Answer_Format, Current_Total, Previous_Total, Current_Year, Previous_Year } = questionData;
  const maxValue = roundUp(Math.max(Current_Total, Previous_Total));

  const isCurrency = Answer_Format === "C";
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

    <>
      {Current_Total === null
        ? <h4 className="text-2xl mt-2">{isCurrency && "$"}0 <span className="text-sm font-normal opacity-60">No Data Found For {Current_Year}</span></h4>
        : <h4 className="text-2xl mt-2">{isCurrency && "$"}{isCurrency ? numberWithCommas(Current_Total) : Current_Total} <span className="text-sm font-normal opacity-60">{Answer_Label}</span></h4>
      }
      <div className="h-8 w-full flex items-center overflow-hidden">
        <div className="bg-accent grid place-items-center h-full px-2 rounded-s-md"><p>{Current_Year}</p></div>

        <Separator orientation="vertical" className="!bg-background" />

        <div className="w-full">
          <div style={{ width: `${(Current_Total / maxValue) * 100}%` }} className="bg-accent h-8 min-w-max rounded-e-md flex items-center px-2"></div>
        </div>
      </div>
    </>

    <>
      {Previous_Total === null
        ? <h4 className="text-2xl mt-2">{isCurrency && "$"}0 <span className="text-sm font-normal opacity-60">No Data Found For {Previous_Year}</span></h4>
        : <h4 className="text-2xl mt-2">{isCurrency && "$"}{isCurrency ? numberWithCommas(Previous_Total) : Previous_Total} <span className="text-sm font-normal opacity-60">{Answer_Label}</span></h4>
      }
      <div className="h-8 w-full flex items-center overflow-hidden">
        <div className="bg-muted grid place-items-center h-full px-2 rounded-s-md"><p>{Previous_Year}</p></div>

        <Separator orientation="vertical" className="!bg-background" />

        <div className="w-full">
          <div style={{ width: `${(Previous_Total / maxValue) * 100}%` }} className="bg-muted h-8 min-w-max rounded-e-md flex items-center px-2"></div>
        </div>
      </div>
    </>
  </div>
}

const Ha = ({ congregations }: { congregations: Congregation[] }) => {
  const [selectedCongregationID, setSelectedCongregationID] = useState<number>(0);
  const [selectedSectionID, setSelectedSectionID] = useState<number>(0);
  const [haSections, setHaSections] = useState<HaSection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isQuestionPopupOpen, setIsQuestionPopupOpen] = useState<boolean>(false);

  const today = new Date();
  const initialDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1)); //defaults to the first date of the previous month
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate);
  const [selectedQuestionData, setSelectedQuestionData] = useState<HaQuestionData | undefined>(undefined);
  const [selectedQuestionID, setSelectedQuestionID] = useState<number | undefined>(undefined);

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
      setIsLoading(true);

      const year = selectedDate.getUTCFullYear();
      const month = selectedDate.getUTCMonth();
      const healthAssessment = await getHaInformation(year, month, selectedCongregationID);
      setHaSections(healthAssessment);

      setIsLoading(false);
    })()
  }, [selectedDate, selectedCongregationID]);

  const handleQuestionClicked = (QuestionData: HaQuestionData): void => {
    setIsQuestionPopupOpen(true);
    setSelectedQuestionData(QuestionData);
    setSelectedQuestionID(QuestionData.Ministry_Question_ID);
  }

  return <>
    {isLoading && <Loading />}
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
      <Dialog open={isQuestionPopupOpen} onOpenChange={setIsQuestionPopupOpen}>
        <MinistryQuestionPopup congregations={congregations} QuestionData={selectedQuestionData} QuestionID={selectedQuestionID} />
      </Dialog>
      <div className="overflow-auto custom-scroller">
        <div className="max-w-screen-xl w-full mx-auto grid gap-4">
          {haSections.filter(section => section.Question_Section_ID === selectedSectionID || selectedSectionID === 0).map(section => {
            const { Question_Section_ID, Question_Section, Questions } = section;
            return <div key={Question_Section_ID} className="grid p-2 gap-2 border rounded-lg bg-primary shadow-md">
              {Questions.map(category => {
                const { Question_Category_ID, Question_Category, Question_Data } = category;
                const QL = Question_Data.length;
                const numOfColums = QL < 4 ? QL : 4;
                const uniqueKey = `${Question_Section_ID}-${Question_Category_ID}`;
                return <div key={uniqueKey} style={{ gridTemplateColumns: `repeat(${numOfColums}, minmax(0, 1fr))` }} className="grid grid-cols-2 w-full h-max gap-2 text-left">
                  <h4 className="col-span-full text-lg px-1">{Question_Section} - {Question_Category}</h4>
                  {Question_Data.map(data => {
                    return <button onClick={() => handleQuestionClicked(data)} key={`${Question_Section_ID}-${Question_Category_ID}-${data.Ministry_Question_ID}`}>
                      <QuestionCard questionData={data} />
                    </button>
                  })}
                </div>;
              })}
            </div>
          })}
        </div>
      </div>
    </article>
  </>
};

export default Ha;