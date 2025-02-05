"use client";
import React, { useState, useEffect, useId } from "react";
import { cn } from "@/lib/utils";

const NumberInput = ({ value = 0, setValue, min = 0, max = 100, label = "", isActive = true }: { value?: number, setValue: (value: number) => void, min?: number, max?: number, label?: string, isActive?: boolean }) => {
  const id = useId();
  const [valueString, setValueString] = useState(value.toString());
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  const handleBlur = () => {
    let validNumber = Number(value);
    if (validNumber < min) {
      validNumber = min;
    }
    if (validNumber > max) {
      validNumber = max;
    }
    setValue(validNumber);
    setKeyboardFocus(false);
    setMouseDown(false);
  };

  useEffect(() => {
    setValue(Number(valueString));
  }, [valueString]);

  return <div>
    <label htmlFor={id} className="px-1">{label}</label>
    <div className="bg-primary rounded-md h-10 w-full relative border border-input">
      <input
        id={id}
        value={valueString}
        onChange={(e) => setValueString(e.target.value)}
        tabIndex={isActive ? 0 : -1}
        onMouseDown={(e) => {
          setMouseDown(true);
          (e.target as HTMLInputElement).select();
        }}
        onFocus={(e) => {
          if (!mouseDown) {
            setKeyboardFocus(true);
            e.target.select();
          }
        }}
        onBlur={handleBlur}
        type="number"
        className={cn(
          "w-full h-full outline-none bg-transparent pl-4 pr-8 rounded-md outline-offset-2 text-primary-foreground",
          keyboardFocus ? "outline-ring" : "outline-none"
        )}
        min={min}
        max={max}
      />
    </div>
  </div>
}

export default NumberInput;