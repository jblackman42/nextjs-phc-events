"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { HaQuestion } from "@/lib/types"
import { chartColors } from "@/lib/constants"
// const chartData = [
//   { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
//   { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
//   { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
//   { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
//   { browser: "other", visitors: 190, fill: "var(--color-other)" },
// ]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

type ChartAnswer = {key: string, value: number, fill: string};
const parseAnswers = (data: HaQuestion, index: number): ChartAnswer[] => {
    const result: ChartAnswer[] = [];
    const answers = data.Period_Answers[index].Period_Breakdown;

    const order = ["Glendale Campus", "PHC: Peoria", "PHC: Español", "Online Campus"];
    answers.sort((a, b) => {
        const aIndex = order.indexOf(a.Congregation_Name);
        const bIndex = order.indexOf(b.Congregation_Name);
        if (aIndex === -1 && bIndex === -1) return a.Congregation_Name.localeCompare(b.Congregation_Name);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
    });
    answers.forEach((b, i) => {
        result.push({
            key: b.Congregation_Name,
            value: b.Numerical_Value,
            fill: chartColors[i],
        })
    })
    return result;
}


const PieChartComponent = ({ data, index }: { data: HaQuestion, index?: number }) => {
    const { Answer_Format, Answer_Label, Period_Answers } = data;
    const valueIndex = index || Period_Answers.length - 2;
    const chartData = parseAnswers(data, valueIndex);
    const total = Period_Answers[valueIndex].Period_Total;

    let congregations: string[] = [];
    Period_Answers.forEach((d) => {
        d.Period_Breakdown.forEach((b) => {
            if (!congregations.includes(b.Congregation_Name)) congregations.push(b.Congregation_Name);
        })
    });
    const order = ["Glendale Campus", "PHC: Peoria", "PHC: Español", "Online Campus"];
    congregations.sort((a, b) => {
      const aIndex = order.indexOf(a);
      const bIndex = order.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    const chartConfig = congregations.reduce((acc, c, i) => {
        acc[c] = {
          label: c,
          color: chartColors[i],
        }
        return acc;
      }, {} as ChartConfig);

  return (
    <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square min-h-[250px]"
    >
        <PieChart>
        <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
        />
        <Pie
            data={chartData}
            dataKey="value"
            nameKey="key"
            innerRadius={60}
            strokeWidth={5}
        >
            <Label
            content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                    <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    >
                    <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-textPrimary text-3xl font-bold"
                    >
                        {Answer_Format === "C" ? "$" : ""}
                        {total > 1000 ? Math.round(total) : total}
                    </tspan>
                    {Answer_Label && <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-textPrimary"
                    >
                        {Answer_Label}
                    </tspan>}
                    </text>
                )
                }
            }}
            />
        </Pie>
        </PieChart>
    </ChartContainer>
  )
}

export default PieChartComponent;