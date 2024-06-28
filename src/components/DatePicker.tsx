"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@awesome.me/kit-10a739193a/icons/classic/solid";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function DatePicker({ year, month, day, handleSubmit }: { year: number, month: number, day: number, handleSubmit: (date: Date) => void }) {

  return (
    <div className="grid gap-2 w-64 min-h-10 p-2 bg-smoky text-textHeading border border-border shadow-md rounded-md">
      <div className="flex justify-between text-2xl px-2 py-1">
        <button><FontAwesomeIcon icon={faArrowLeft} /></button>
        <h1>{year}</h1>
        <button><FontAwesomeIcon icon={faArrowRight} /></button>
      </div>
      <div className="grid grid-cols-4 gap-1 group">
        {months.map((m, i) => <button key={i} onClick={() => handleSubmit(new Date(Date.UTC(year, i, 1)))} data-selected={month === i} className="bg-primary rounded-[2px] py-2 hover:!bg-accent group-hover:bg-primary data-[selected=true]:bg-accent">{m}</button>)}
      </div>
    </div>
  );
}