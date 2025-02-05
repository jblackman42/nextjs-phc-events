"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

const TextAreaInput = ({ text = "", setText, label = "", isActive = true }: { text?: string, setText: (text: string) => void, label?: string, isActive?: boolean }) => {
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  return <div className="col-span-2">
    <label className="px-1">{label}</label>
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      tabIndex={isActive ? 0 : -1}
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
        "w-full h-20 px-2 py-1 bg-primary rounded-md border border-input resize-none outline-none text-primary-foreground",
        keyboardFocus ? "outline-ring" : "outline-none"
      )}
    />
  </div>
}

export default TextAreaInput;