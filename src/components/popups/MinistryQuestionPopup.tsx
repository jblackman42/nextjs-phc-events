"use client";
import React, { useState, useEffect } from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { LineChart } from '@/components'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@awesome.me/kit-10a739193a/icons/classic/solid';
import { cn } from '@/lib/utils';
import { getQuestionInformation } from '@/app/actions';
import { Congregation, HaQuestion, HaQuestionData } from '@/lib/types';
import { ChartData, ChartDataset } from 'chart.js';

const colors = ['#e74c3c', '#2ecc71', '#9b59b6', '#e67e22', '#1abc9c', '#3498db', '#f1c40f', '#4834d4', '#7ed6df'];

function MinistryQuestionPopup({ congregations, QuestionData, QuestionID }: { congregations: Congregation[], QuestionData: HaQuestionData | undefined, QuestionID: number | undefined }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [question, setQuestion] = useState<HaQuestion | undefined>();
  const [data, setData] = useState<ChartData | undefined>();

  useEffect(() => {
    (async () => {
      if (QuestionID === undefined) return;
      setQuestion(undefined);
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const newQuestion = await getQuestionInformation(QuestionID);
      setQuestion(newQuestion);
      setLoading(false);
    })()
  }, [QuestionID]);

  useEffect(() => {
    if (!question) return;
    const { Question_Answers } = question;

    const chartData: ChartData = {
      labels: [],
      datasets: congregations.map((c, i): ChartDataset => {
        return {
          data: [],
          label: c.Congregation_Name,
          borderColor: colors[i]
        }
      })
    }

    Question_Answers.forEach(answer => {
      const { Fiscal_Period_Start, Period_Breakdown } = answer;
      const periodLabel = new Date(Fiscal_Period_Start).toLocaleDateString('en-us', { month: "short", year: "numeric" });
      if (chartData.labels) chartData.labels.push(periodLabel)
      else chartData.labels = [periodLabel];
      congregations.forEach((c, i) => {
        const breakdownValue = Period_Breakdown.find(breakdown => breakdown.Congregation_Name === c.Congregation_Name);
        const value = breakdownValue ? breakdownValue.Numerical_Value : 0;
        chartData.datasets[i].data.push(value);
      })
    })

    setData(chartData);
  }, [question, congregations])



  return <DialogContent>
    <DialogHeader>
      <DialogTitle>{QuestionData?.Question_Header}</DialogTitle>
      <DialogDescription>
        {QuestionData?.Question_Description}
      </DialogDescription>
    </DialogHeader>
    <div className="max-h-[550px] w-full max-w-xl grid custom-scroller overflow-auto">
      <LineChart data={data} />
    </div>
  </DialogContent>
}

export default MinistryQuestionPopup;