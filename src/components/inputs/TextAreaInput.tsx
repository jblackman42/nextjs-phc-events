"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

const TextAreaInput = ({ text, setText, label = "" }: { text: string, setText: (text: string) => void, label?: string }) => {
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  return <div className="col-span-2">
    <label>{label}</label>
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      onMouseDown={() => setMouseDown(true)}
      onFocus={() => {
        if (!mouseDown) {
          setKeyboardFocus(true);
        }
      }}
      onBlur={() => {
        setKeyboardFocus(false);
        setMouseDown(false);
      }}
      className={cn(
        "w-full h-20 px-2 py-1 bg-primary rounded-md border border-input resize-none outline-none",
        keyboardFocus ? "outline-ring" : "outline-none"
      )}
    />
  </div>
}

export default TextAreaInput;