import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@awesome.me/kit-10a739193a/icons/classic/light';

function Popup({ open = null, setOpen, children }: { open: Boolean | null, setOpen: Function, customClose?: () => void, children: React.ReactNode }) {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [setOpen]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const popupContainersArr = Array.from(document.getElementsByClassName('popup-container'));

    if (popupContainersArr.find(elem => elem === e.target)) setOpen(false);
  }


  return <div className={`${open === true ? "open" : open === false ? "close" : ""} popup-container absolute inset-0 bg-smoky grid place-items-center z-[999]`} onClick={handleOutsideClick}>
    <div className="popup bg-primary text-primary-foreground max-w-[95vw] w-[500px] rounded-sm shadow-sm relative overflow-y-auto custom-scroller">
      <button className="fixed z-50 top-0 right-0 m-2 text-2xl leading-none" id="close-btn" onClick={() => setOpen(false)}><FontAwesomeIcon icon={faXmark} /></button>
      {children}
    </div>
  </div>
}

export default Popup;