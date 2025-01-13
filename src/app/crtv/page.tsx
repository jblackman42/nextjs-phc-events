"use client";
import Image from "next/image";
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Crtv() {
  return <div className="h-screen w-screen overflow-hidden bg-crtvBackground">
    {/* <Image src="/crtv-logo.png" alt="CRTV" width={100} height={100} /> */}
    <div className="border border-black m-4 min-h-96">
      <div className="grid grid-cols-7 border-b border-black">
        {weekdays.map((day, index) => (
          <div key={index} className="bg-crtvAccent text-center *:uppercase p-4">
            <h3>{day}</h3>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 h-full border-l border-black">
        {weekdays.map((_, index) => (
          <div key={index} className="w-full h-full">
            <p>12:00 AM</p>
          </div>
        ))}
      </div>
    </div>
  </div>;
}