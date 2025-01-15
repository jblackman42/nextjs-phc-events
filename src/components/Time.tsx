"use client";
import React, { useState, useEffect } from 'react';

interface TimeProps {
  time: string | undefined;
  setTime: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const Time: React.FC<TimeProps> = ({ time, setTime }) => {


  const hourOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const minuteOptions = ["00", "15", "30", "45"];
  const amOptions = ["AM", "PM"];

  const [selectedHour, setSelectedHour] = useState<string>(time ? time.split(":")[0] : hourOptions[0]);
  const [selectedMinute, setSelectedMinute] = useState<string>(time ? time.split(":")[1].split(" ")[0] : minuteOptions[0]);
  const [selectedAm, setSelectedAm] = useState<string>(time ? time.split(" ")[1] : amOptions[0]);

  const hourRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hourRef.current) {
      const selectedButton = hourRef.current.querySelector(`[data-selected="true"]`);
      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: "instant", block: "start" });
      }
    }
  }, []);

  const optionsList = [
    {
      value: selectedHour,
      setValue: setSelectedHour,
      options: hourOptions,
      ref: hourRef
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

  useEffect(() => {
    if (selectedHour && selectedMinute && selectedAm) {
      setTime(`${selectedHour}:${selectedMinute} ${selectedAm}`);
    }
  }, [selectedHour, selectedMinute, selectedAm, setTime]);

  return (
    <div className="p-3">
      {/* <p>{selectedHour}:{selectedMinute} {selectedAm}</p> */}
      <div className="flex gap-1">
        {optionsList.map((optionData, index) => {
          const { value, setValue, options, ref } = optionData;
          return <div
            key={index}
            ref={ref}
            className="flex flex-col gap-1 max-h-[156px] overflow-y-auto no-scrollbar"
          >
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