"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@awesome.me/kit-10a739193a/icons/classic/light';
import { MPEvent } from '@/lib/types';
import { cn } from '@/lib/util';

import { useSettings } from '@/context/SettingsContext';
import { useUser } from '@/context/UserContext';
// import { useLoading } from '@/context/LoadingContext';
import { encrypt } from '@/lib/encryption';
import { useToast } from '@/components/ui/use-toast';
const minInputLength = 3;

function SearchBar() {
  const { toast } = useToast();
  const { settings } = useSettings();
  const { user } = useUser();
  // const { setLoading } = useLoading();
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<MPEvent>>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const searchEvents = useCallback(async (keyword: string, targetDate: string, showCancelled: boolean, userGUID: string) => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel('Operation canceled due to new request.');
    }
    const source = axios.CancelToken.source();
    cancelTokenSourceRef.current = source;

    setSearchLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: "/api/client/events/search",
        data: {
          keyword: keyword,
          targetDate: targetDate,
          showCancelled: showCancelled ? 1 : 0,
          userGUID: userGUID
        },
        cancelToken: source.token
      });
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        // handle other errors
        console.error(error);
      }
    } finally {
      setSearchLoading(false);
    }
  }, []);

  useEffect(() => {    
    setSearchResults([]);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (searchInput.length >= minInputLength) {
      setSearchLoading(true);
      debounceTimeout.current = setTimeout(async () => {
        const userGUID = user ? user.sub : '';
        const results = await searchEvents(searchInput, new Date().toISOString(), settings.showCancelledEvents.value, userGUID);
        if (results) {
          setSearchResults(results);
        }
      }, 500); // Adjust debounce delay as needed
    } else {
      setSearchLoading(false);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchInput, searchEvents, settings.showCancelledEvents.value, user]);

  const handleClickEvent = async (e: MPEvent): Promise<void> => {
    try {
      const encryptedEventID = await encrypt(e.Event_ID.toString());
      const safeEncryptedEventID = encodeURIComponent(encryptedEventID);
      window.location.href = `/?eventId=${safeEncryptedEventID}`;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open event",
        variant: "destructive"
      });
    }
  }

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setSearchInput('');
    setSearchResults([]);
    setIsFocused(false);
  };

  return (
    <div
      className="bg-primary rounded-md h-10 w-full relative border border-input"
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={-1}
    >
      <input
        value={searchInput}
        onInput={(e) => setSearchInput(e.currentTarget.value)}
        type="text"
        placeholder="Search events"
        className="w-full h-full outline-none bg-transparent pl-4 pr-8 text-textHeading"
      />
      <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute top-0 right-0 text-textHeading grid place-items-center h-4 p-3 aspect-square" />

      {isFocused && (searchInput.length >= minInputLength || searchLoading) && <div className="absolute rounded-md overflow-hiden w-full max-h-[475%] md:max-h-none top-full translate-y-[6px] left-0 bg-primary border shadow-lg z-50 text-textHeading overflow-y-auto custom-scroller">
        {searchInput.length >= minInputLength && !searchLoading && !searchResults.length && <div className="m-1 shadow-md">
          <div className="rounded-sm p-2 w-full bg-background">
            <p className="whitespace-nowrap text-ellipsis overflow-hidden">No Results Found.</p>
          </div>
        </div>}
        {searchLoading && <>
          {[...Array(10)].map((_, i) => {
            return <div key={i} className="m-1 shadow-md">
              <div style={{ animationDelay: `${50 * (i)}ms` }} className="rounded-sm px-2 py-1 w-full h-12 bg-background animate-skeleton-breathe">
              </div>
            </div>
          })}
        </>}
        {searchResults.map(event => {
          // const startDate = (event.Event_Start_Date);
          return <div key={event.Event_ID} className="m-1 shadow-md">
            <button onClick={() => handleClickEvent(event)} className={cn("flex flex-col justify-between rounded-sm px-2 py-1 w-full bg-background border-l-4 hover:border-l-[6px] hover:bg-secondary duration-75 transition-[border-width] text-left", event.Cancelled ? "border-l-destructive" : event.Featured_On_Calendar ? "border-l-success" : "border-l-accent")}>
              <p className="whitespace-nowrap text-ellipsis overflow-hidden">{event.Event_Title}</p>
              <p className="whitespace-nowrap text-ellipsis overflow-hidden text-xs">{new Date(event.Event_Start_Date).toLocaleDateString('en-us', { month: "short", day: "numeric", year: "numeric" })}</p>
              {/* <p className="whitespace-nowrap">{startDate.toLocaleDateString('en-us', { month: "short", day: "numeric", year: "numeric" })}</p> */}
            </button>
          </div>
        })}
      </div>}
    </div>
  );
}

export default SearchBar;