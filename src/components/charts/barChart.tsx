"use client";


import React, { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Congregation, HaSection, HaQuestion } from "@/lib/types";

import { chartColors } from "@/lib/constants";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
  } from "@/components/ui/chart";
import { Button } from "../ui/button";
import { cn, correctForTimezone } from "@/lib/util";

type ChartAnswer = {key: string} & {[key: string]: string | number};
const parseAnswers = (data: HaQuestion, period: "3M" | "YTD" | "1Y" | "ALL", isMonthly: boolean): ChartAnswer[] => {
    const result: ChartAnswer[] = [];
    const answers = isMonthly ? data.Period_Answers : data.Week_Answers;

    answers.forEach((a) => {
      const {Start_Date, Period_Breakdown} = a;
      const newAnswer: ChartAnswer = { key: Start_Date }
      Period_Breakdown.forEach((b: {Congregation_Name: string, Numerical_Value: number}) => {
        if (b.Numerical_Value <= 0) return;
        if (b.Numerical_Value >= 1000) {
          newAnswer[b.Congregation_Name] = Math.round(b.Numerical_Value);
        } else {
          newAnswer[b.Congregation_Name] = b.Numerical_Value;
        }
      })
      result.push(newAnswer);
    })

    console.log(result);

    if (period === "3M") {
        const currDate = new Date();
        const threeMonthsAgo = new Date(currDate.getFullYear(), currDate.getMonth() - 3, 1);
        return result.filter(r => correctForTimezone(new Date(r.key)) >= threeMonthsAgo);
    } else if (period === "YTD") {
        return result.filter(r => correctForTimezone(new Date(r.key)).getFullYear() === new Date().getFullYear())
    } else if (period === "1Y") {
        const currDate = new Date();
        const oneYearAgo = new Date(currDate.getFullYear() - 1, currDate.getMonth(), 1);
        return result.filter(r => correctForTimezone(new Date(r.key)) >= oneYearAgo);
    }
    return result;
}

function BarChartComponent({ congregations, data }: { congregations: Congregation[], data: HaQuestion}) {
    const [isMonthly, setIsMonthly] = useState<boolean>(true);
    const [chartData, setChartData] = useState<ChartAnswer[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<("3M" | "YTD" | "1Y" | "ALL")>("3M");

    useEffect(() => {
        const parsedData = parseAnswers(data, selectedPeriod, isMonthly);
        console.log(parsedData);
        setChartData(parsedData);
    }, [data, isMonthly, selectedPeriod]);

    const chartConfig = congregations.reduce((acc, c, i) => {
        acc[c.Congregation_Name] = {
          label: c.Congregation_Name,
          color: chartColors[i],
        }
        return acc;
      }, {} as ChartConfig);

    return <div className="flex flex-col gap-8 bg-primary rounded-lg border">
        <div className="flex justify-between items-center gap-4 border-b p-4">
            <p className="text-lg font-bold h-max">{data.Question_Title}</p>

            <div className="flex gap-8">
                <div className="flex gap-2 *:text-sm *:bg-background">
                    <Button variant="icon" className={cn(selectedPeriod === "3M" && "!bg-accent")} onClick={() => setSelectedPeriod("3M")}>3M</Button>
                    <Button variant="icon" className={cn(selectedPeriod === "YTD" && "!bg-accent")} onClick={() => setSelectedPeriod("YTD")}>YTD</Button>
                    <Button variant="icon" className={cn(selectedPeriod === "1Y" && "!bg-accent")} onClick={() => setSelectedPeriod("1Y")}>1Y</Button>
                    <Button variant="icon" className={cn(selectedPeriod === "ALL" && "!bg-accent")} onClick={() => setSelectedPeriod("ALL")}>ALL</Button>
                </div>
                <div className="flex">
                    <Button variant={!isMonthly ? "secondary" : "outline"} className="rounded-r-none" onClick={() => setIsMonthly(false)}>Weekly</Button>
                    <Button variant={isMonthly ? "secondary" : "outline"} className="rounded-l-none" onClick={() => setIsMonthly(true)}>Monthly</Button>
                </div>
            </div>
        </div>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full p-2">
            <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="key"
                tickLine={true}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                    return correctForTimezone(new Date(value))
                        .toLocaleDateString('en-US', { year: 'numeric', day: !isMonthly ? 'numeric' : undefined, month: 'short' });
                }}
            />
            <ChartTooltip 
                content={<ChartTooltipContent />} 
                labelFormatter={(value) => {
                    return correctForTimezone(new Date(value))
                        .toLocaleDateString('en-US', { year: 'numeric', day: !isMonthly ? 'numeric' : undefined, month: 'short' });
                }}
            />
            {congregations.map((c, i) => (
                <Bar key={i} dataKey={c.Congregation_Name} fill={chartColors[i]} stackId="a" />
            ))}
            </BarChart>
        </ChartContainer>
    </div>
};

export default BarChartComponent;
