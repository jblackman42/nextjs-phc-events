"use client";
import React, { useState, useId } from "react";
import { cn } from "@/lib/utils";

const TextInput = ({ text, setText, placeholder = "", label = "" }: { text: string, setText: (text: string) => void, placeholder?: string, label?: string }) => {
  const id = useId();
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);

  return <div>
    <label htmlFor={id}>{label}</label>
    <div className="bg-primary rounded-md h-10 w-full relative border border-input">
      <input
        id={id}
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
        type="text"
        placeholder={placeholder}
        className={cn(
          "w-full h-full bg-transparent outline-none border-none pl-4 pr-8 text-textHeading rounded-md outline-offset-2",
          keyboardFocus ? "outline-ring" : "outline-none"
        )}
      />
    </div>
  </div>
}

export default TextInput;