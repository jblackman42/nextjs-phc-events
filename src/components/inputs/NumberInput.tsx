"use client";
import React, { useState, useEffect, useId } from "react";
import { cn } from "@/lib/util";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faCaretDown } from "@awesome.me/kit-10a739193a/icons/classic/solid";

const NumberInput = ({ value = 0, setValue, min = 0, max = 100, label = "", disabled = false, showButtons = false, isActive = true }: { value?: number, setValue: (value: number) => void, min?: number, max?: number, label?: string, disabled?: boolean, showButtons?: boolean, isActive?: boolean }) => {
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
    let newValue = Number(valueString);
    if (newValue < min) {
      newValue = min;
      setValueString(min.toString());
    }
    if (newValue > max) {
      newValue = max;
      setValueString(max.toString());
    }
    setValue(newValue);
  }, [valueString, min, max]);

  return <div>
    {label && <label htmlFor={id} className="px-1">{label}</label>}
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
          "w-full h-full outline-none bg-transparent px-4 rounded-md outline-offset-2 text-primary-foreground",
          keyboardFocus ? "outline-ring" : "outline-none"
        )}
        min={min}
        max={max}
        disabled={disabled}
      />

      {showButtons && !disabled && <div className="absolute flex flex-col right-2.5 top-1/2 -translate-y-1/2">
        <button onClick={() => setValueString((Number(valueString) + 1).toString())} className="h-3 p-0.5 py-1 flex justify-center items-center text-primary-foreground opacity-50 hover:text-accent hover:opacity-100" tabIndex={-1}><FontAwesomeIcon icon={faCaretUp} /></button>
        <button onClick={() => setValueString((Number(valueString) - 1).toString())} className="h-3 p-0.5 py-1 flex justify-center items-center text-primary-foreground opacity-50 hover:text-accent hover:opacity-100" tabIndex={-1}><FontAwesomeIcon icon={faCaretDown} /></button>

      </div>}
    </div>
  </div>


}

export default NumberInput;