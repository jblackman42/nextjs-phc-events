"use client";
import React, { useEffect, useState } from 'react';
import Popup from './Popup';
import { Button } from "@/components/ui/button";
import { useSettings, CalendarSettings, Setting } from '@/context/SettingsContext';
import { Switch } from "@/components/ui/switch";

function SettingsPopup({ open = undefined, setOpen }: { open: Boolean | undefined, setOpen: Function }) {
  const { settings, updateSettings } = useSettings();

  const [tempSettings, setTempSettings] = useState<CalendarSettings>(settings);

  const handleSubmit = () => {
    setOpen(false);
    updateSettings(tempSettings);
  }

  useEffect(() => {
    if (settings && open) setTempSettings(settings);
  }, [open, settings])

  return tempSettings && <Popup open={open} setOpen={setOpen}>
    <div className="bg-secondary">
      <div className="p-2 border-b-4 border-accent">
        <h2 className="text-center">settings</h2>
      </div>
      <div className="grid grid-cols-1 gap-2 m-2">
        {Object.entries(tempSettings).map(([key, setting]: [string, Setting], i: number) => {

          const updateValue = (newVal: boolean) => {
            const newSetting = { ...setting, value: newVal };
            setTempSettings(old => {
              return { ...old, [key]: newSetting }
            });
          }

          return (
            <label key={i} htmlFor={`setting-${i}`}>
              <div className="bg-primary rounded-sm p-2 flex items-center justify-between shadow-md">
                <p className="text-textHeading">{setting.label}:</p>
                <Switch id={`setting-${i}`} checked={setting.value} onCheckedChange={() => updateValue(!setting.value)} />
              </div>
            </label>
          )
        })}
      </div>


      <div className="flex gap-2 justify-between p-2 pt-0">
        <Button variant="simple" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="default" size="sm" onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  </Popup>
}

export default SettingsPopup