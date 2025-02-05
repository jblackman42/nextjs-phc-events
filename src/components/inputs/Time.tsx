"use client";
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

interface TimeProps {
  time: string | undefined;
  // setTime: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTime: (value: string) => void;
}


const Time: React.FC<TimeProps> = ({ time, setTime }) => {


  const hourOptions = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const minuteOptions = ["00", "15", "30", "45"];
  const amOptions = ["AM", "PM"];

  const [selectedHour, setSelectedHour] = useState<string>(() => {
    if (!time) return hourOptions[0];
    try {
      return time.split(":")[0] || hourOptions[0];
    } catch {
      return hourOptions[0];
    }
  });

  const [selectedMinute, setSelectedMinute] = useState<string>(() => {
    if (!time) return minuteOptions[0];
    try {
      return time.split(":")[1].split(" ")[0] || minuteOptions[0];
    } catch {
      return minuteOptions[0];
    }
  });

  const [selectedAm, setSelectedAm] = useState<string>(() => {
    if (!time) return amOptions[0];
    try {
      return time.split(" ")[1] || amOptions[0];
    } catch {
      return amOptions[0];
    }
  });

  const hourRef = useRef<HTMLDivElement>(null);

  // Create refs individually
  const column1Ref = useRef<HTMLDivElement>(null);
  const column2Ref = useRef<HTMLDivElement>(null);
  const column3Ref = useRef<HTMLDivElement>(null);

  // Store refs in array using useMemo
  const columnRefs = useMemo(() => [
    column1Ref,
    column2Ref,
    column3Ref,
  ], []);

  // Add state for tracking focused column
  const [focusedColumnIndex, setFocusedColumnIndex] = useState<number>(0);

  useEffect(() => {
    if (hourRef.current) {
      const selectedButton = hourRef.current.querySelector(`[data-selected="true"]`);
      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: "instant", block: "start" });
      }
    }
  }, []);

  // Update keyboard navigation handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      const newIndex = focusedColumnIndex === 0 ? 2 : focusedColumnIndex - 1;
      setFocusedColumnIndex(newIndex);
      const button = columnRefs[newIndex].current?.querySelector('button');
      button?.focus();
      button?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else if (e.key === 'ArrowRight') {
      const newIndex = focusedColumnIndex === 2 ? 0 : focusedColumnIndex + 1;
      setFocusedColumnIndex(newIndex);
      const button = columnRefs[newIndex].current?.querySelector('button');
      button?.focus();
      button?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      const currentColumn = columnRefs[focusedColumnIndex].current;
      const buttons = currentColumn?.querySelectorAll('button');
      if (!buttons) return;

      const currentFocusedButton = document.activeElement;
      const currentIndex = Array.from(buttons).findIndex(button => button === currentFocusedButton);

      let newButtonIndex;
      if (e.key === 'ArrowUp') {
        newButtonIndex = Math.max(0, currentIndex - 1);
      } else {
        newButtonIndex = Math.min(buttons.length - 1, currentIndex + 1);
      }

      const newButton = buttons[newButtonIndex] as HTMLButtonElement;
      newButton.focus();
      newButton.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [focusedColumnIndex, columnRefs]);

  // Add effect for keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const optionsList = [
    {
      value: selectedHour,
      setValue: setSelectedHour,
      options: hourOptions,
      ref: columnRefs[0]
    },
    {
      value: selectedMinute,
      setValue: setSelectedMinute,
      options: minuteOptions,
      ref: columnRefs[1]
    },
    {
      value: selectedAm,
      setValue: setSelectedAm,
      options: amOptions,
      ref: columnRefs[2]
    }
  ];

  useEffect(() => {
    if (selectedHour && selectedMinute && selectedAm) {
      const newTime = `${selectedHour}:${selectedMinute} ${selectedAm}`;
      if (newTime !== time) {
        setTime(newTime);
      }
    }
  }, [selectedHour, selectedMinute, selectedAm, setTime, time]);

  return (
    <div>
      {/* <p>{selectedHour}:{selectedMinute} {selectedAm}</p> */}
      <div className="flex p-3">
        {optionsList.map((optionData, index) => {
          const { value, setValue, options, ref } = optionData;
          return <div
            key={index}
            ref={ref}
            // className="flex flex-col max-h-[160px] overflow-y-auto no-scrollbar"
            className="flex flex-col max-h-40 overflow-y-auto no-scrollbar"
          >
            {options.map((item) => (
              <button
                key={item}
                data-selected={(value === item).toString()}
                onClick={() => setValue(item)}
                onFocus={() => setFocusedColumnIndex(index)}
                className="text-lg text-center p-1 px-3 bg-border rounded-md data-[selected=true]:bg-accent outline-none border-smoky border-2 focus:border-ring"
              >
                {item}
              </button>
            ))}
          </div>
        })}
      </div>
    </div>
  )
}

export default Time;