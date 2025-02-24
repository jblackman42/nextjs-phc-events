"use client";
import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { correctForTimezone } from '@/lib/util';
import { MPEvent, WeekEvent } from '@/lib/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faLocationDot, faFolderOpen } from '@awesome.me/kit-10a739193a/icons/classic/light';
import { faUpRightAndDownLeftFromCenter } from '@awesome.me/kit-10a739193a/icons/classic/solid';
import { Separator } from '@/components/ui/separator';

function EventHoverCard({ index, eventData, handleClick }: { index?: number, eventData: WeekEvent, handleClick: (event: MPEvent) => void }) {
  const { event, width, height, posX, posY } = eventData;
  const startDate = correctForTimezone(event.Event_Start_Date);
  const endDate = correctForTimezone(event.Event_End_Date);
  const weekdayShort = startDate.toLocaleDateString('en-us', { weekday: "short" });
  const formattedDate = `${startDate.getUTCMonth()}/${startDate.getUTCDate()}/${startDate.getUTCFullYear()}`;
  const startTime = startDate.toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' });
  const endTime = endDate.toLocaleTimeString('en-us', { hour: 'numeric', minute: '2-digit' });

  // Prevent event bubbling
  const onClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClick(event);
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          onClick={onClickHandler}
          style={{ top: posY, left: posX, height: height, width: width }}
          className="absolute cursor-pointer rounded-md bg-accent hover:bg-accent-2 shadow-md border-accent-0 border-l-4 border-l-accent-3 border overflow-hidden *:text-white"
        >
          <p className="font-bold text-textHeading text-xs mx-1 whitespace-nowrap overflow-hidden text-clip">{event.Event_Title}</p>
          <p className="text-xs mx-1 whitespace-nowrap overflow-hidden text-clip">{event.Location_Name}</p>
          <p className="text-xs mx-1 whitespace-nowrap overflow-hidden text-clip">{event.Primary_Contact}</p>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align={!index ? "center" : index < 2 ? "start" : index > 4 ? "end" : "center"}>
        <div className="overflow-hidden">
          <div className="w-full bg-background py-1 px-2 flex justify-between">
            <h1 className="font-light text-base overflow-hidden whitespace-nowrap text-ellipsis"><span className="font-semibold">{event.Congregation_Name}</span> - {event.Primary_Contact}</h1>
            <button onClick={onClickHandler}>
              <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
            </button>
          </div>
          <div className="p-2">
            <h1 className="text-2xl mx-[2px] font-semibold overflow-hidden whitespace-nowrap text-ellipsis" title={event.Event_Title}>{event.Event_Title}</h1>
            <Separator className="my-2 opacity-25 w-full" />



            <div className="flex gap-2 items-center">
              <div>
                <FontAwesomeIcon icon={faClock} className="text-xl aspect-square mb-2" />
              </div>
              <div className="w-full overflow-hidden">
                <p className="overflow-hidden whitespace-nowrap text-ellipsis">{weekdayShort} {formattedDate} {startTime} - {endTime}</p>
                <Separator className="my-2 opacity-25 w-full" />
              </div>
            </div>

            {event.Location_Name && <div className="flex gap-2 items-center">
              <div>
                <FontAwesomeIcon icon={faLocationDot} className="text-xl aspect-square mb-2" />
              </div>
              <div className="w-full overflow-hidden">
                <p className="overflow-hidden whitespace-nowrap text-ellipsis">{event.Location_Name}</p>
                <Separator className="my-2 opacity-25 w-full" />
              </div>
            </div>}

            <div className="flex gap-2 items-center">
              <div>
                <FontAwesomeIcon icon={faFolderOpen} className="text-xl aspect-square" />
              </div>
              <div className="w-full overflow-hidden">
                <p className="overflow-hidden whitespace-nowrap text-ellipsis">{event.Event_Type}</p>
                <Separator className="opacity-0 w-full" />
              </div>
            </div>



          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default React.memo(EventHoverCard);