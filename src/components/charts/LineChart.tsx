"use client";
import React, { useEffect } from "react";
import { Chart, ChartData, registerables } from 'chart.js';
import { v4 as uuidv4 } from 'uuid';

function LineChart({ data }: { data: ChartData | undefined }) {
  const uniqueID = uuidv4();

  useEffect(() => {
    if (!data) return;
    // Register the components required for a line chart with hover effects
    Chart.register(...registerables);

    const chartDOM = document.getElementById(uniqueID) as HTMLCanvasElement;
    if (!chartDOM) return;

    const ctx = chartDOM.getContext('2d');
    if (!ctx) return;

    const chartInstance = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        plugins: {
          tooltip: {
            enabled: true, // Enable tooltip for hover
          },
          legend: {
            display: true, // Display legend for datasets
          },
        },
        interaction: {
          mode: 'nearest', // Interaction mode for hover
          axis: 'x', // Focus on x-axis hover
          intersect: false, // Trigger hover even if cursor isn't directly over a point
        },
        // responsive: true,
        // maintainAspectRatio: false, // Ensures the chart resizes well
      }
    });

    // Cleanup chart on component unmount
    return () => {
      chartInstance.destroy();
    };
  }, [uniqueID, data]);

  return <canvas id={uniqueID}></canvas>;
};

export default LineChart;
