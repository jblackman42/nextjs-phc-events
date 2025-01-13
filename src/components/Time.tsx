"use client";
import React, { useState, useEffect } from 'react';

function Time() {

  const [selectedHour, setSelectedHour] = useState<string>("1");
  const [selectedMinute, setSelectedMinute] = useState<string>("00");
  const [selectedAm, setSelectedAm] = useState<string>("AM");

  const hourOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const minuteOptions = ["00", "15", "30", "45"];
  const amOptions = ["AM", "PM"];
  const optionsList = [
    {
      value: selectedHour,
      setValue: setSelectedHour,
      options: hourOptions
    },
    {
      value: selectedMinute,
      setValue: setSelectedMinute,
      options: minuteOptions
    },
    {
      value: selectedAm,
      setValue: setSelectedAm,
      options: amOptions
    }
  ];
  return (
    <div className="p-3">
      {/* <p>{selectedHour}:{selectedMinute} {selectedAm}</p> */}
      <div className="flex gap-1">
        {optionsList.map((optionData, index) => {
          const { value, setValue, options } = optionData;
          return <div key={index} className="flex flex-col gap-1 max-h-[156px] overflow-y-auto no-scrollbar">
            {options.map((item) => (
              <button key={item} data-selected={(value === item).toString()} onClick={() => setValue(item)} className="text-lg text-center p-1 px-3 bg-border rounded-sm data-[selected=true]:bg-accent">{item}</button>
            ))}
          </div>
        })}
      </div>
    </div>
  )
}

export default Time;