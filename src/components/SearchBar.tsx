import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@awesome.me/kit-10a739193a/icons/classic/light';
import { MPEvent, correctForTimezone, getOrdinalSuffix } from '@/lib/utils';

const minInputLength = 3;

function SearchBar({ targetDate, handleClick }: { targetDate?: string, handleClick: (e: MPEvent) => void }) {
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<MPEvent>>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const cancelTokenSourceRef = useRef<CancelTokenSource | null>(null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const searchEvents = useCallback(async (keyword: string, targetDate: string) => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel('Operation canceled due to new request.');
    }
    const source = axios.CancelToken.source();
    cancelTokenSourceRef.current = source;

    setLoading(true);
    try {
      const response = await axios({
        method: "GET",
        url: "/api/events/search",
        params: {
          keyword: keyword,
          targetDate: targetDate
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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setSearchResults([]);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (searchInput.length >= minInputLength) {
      setLoading(true);
      debounceTimeout.current = setTimeout(async () => {
        const results = await searchEvents(searchInput, targetDate ?? new Date().toISOString());
        if (results) {
          setSearchResults(results);
        }
      }, 500); // Adjust debounce delay as needed
    } else {
      setLoading(false);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchInput, targetDate, searchEvents]);

  const handleClickEvent = (e: MPEvent): void => {
    setSearchInput('');
    setSearchResults([]);
    handleClick(e);
  }

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget)) {
      return;
    }
    setIsFocused(false);
  };

  return (
    <div
      className="bg-background rounded-full h-10 w-full relative border border-input"
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

      {isFocused && <div className="absolute rounded-md overflow-hiden w-full max-h-[475%] md:max-h-none top-full translate-y-[2px] left-0 bg-background z-50 text-textHeading shadow-md overflow-y-auto custom-scroller">
        {searchInput.length >= minInputLength && !loading && !searchResults.length && <div className="m-1 shadow-md">
          <div className="rounded-sm px-2 py-1 w-full bg-primary">
            <p className="whitespace-nowrap text-ellipsis overflow-hidden">No Results Found.</p>
          </div>
        </div>}
        {loading && <>
          {[...Array(5)].map((_, i) => {
            return <div key={i} className="m-1 shadow-md">
              <div style={{ animationDelay: `${100 * (i)}ms` }} className="rounded-sm px-2 py-1 w-full h-8 bg-primary animate-skeleton-breathe">
              </div>
            </div>
          })}
          {[...Array(5)].map((_, i) => {
            return <div key={i} className="m-1 shadow-md">
              <div style={{ animationDelay: `${100 * (i + 5)}ms` }} className="hidden md:block rounded-sm px-2 py-1 w-full h-8 bg-primary animate-skeleton-breathe">
              </div>
            </div>
          })}
        </>}
        {searchResults.map(event => {
          const startDate = correctForTimezone(event.Event_Start_Date);
          return <div key={event.Event_ID} className="m-1 shadow-md">
            <button onClick={() => handleClickEvent(event)} className="flex justify-between gap-2 rounded-sm px-2 py-1 w-full bg-primary border-l-4 border-accent hover:border-l-[6px] hover:bg-secondary duration-75 transition-[border-width] text-left">
              <p className="whitespace-nowrap text-ellipsis overflow-hidden">{event.Event_Title}</p>
              <p className="whitespace-nowrap">{startDate.toLocaleDateString('en-us', { month: "short", day: "numeric", year: "numeric" })}</p>
            </button>
          </div>
        })}
      </div>}
    </div>
  );
}

export default SearchBar;