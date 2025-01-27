"use client";
import React, { useState, useId } from "react";
import { cn } from "@/lib/utils";

const NumberInput = ({ value, setValue, min = 0, max = 100, label = "" }: { value: string, setValue: (value: string) => void, min?: number, max?: number, label?: string }) => {
  const id = useId();
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
    setValue(validNumber.toString());
    setKeyboardFocus(false);
    setMouseDown(false);
  };

  return <div>
    <label htmlFor={id}>{label}</label>
    <div className="bg-primary rounded-md h-10 w-full relative border border-input">
      <input
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onMouseDown={() => setMouseDown(true)}
        onFocus={() => {
          if (!mouseDown) {
            setKeyboardFocus(true);
          }
        }}
        onBlur={handleBlur}
        type="number"
        className={cn(
          "w-full h-full outline-none bg-transparent pl-4 pr-8 text-textHeading rounded-md outline-offset-2",
          keyboardFocus ? "outline-ring" : "outline-none"
        )}
        min={0}
        max={100}
      />
    </div>
  </div>
}

export default NumberInput;