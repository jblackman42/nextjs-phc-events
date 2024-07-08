import React, { useContext, useEffect, useState } from 'react';
import Popup from './Popup';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button"
import { CalendarSettings, SettingsContext, createSetting } from '@/lib/utils';

interface Setting {
  (): () => boolean;
  value: boolean;
  name: string;
  id: string;
}

function SettingsPopup({ open = null, setOpen, settings, updateSettings }: { open: Boolean | null, setOpen: Function, settings: CalendarSettings, updateSettings: (val: CalendarSettings) => void }) {

  const [tempSettings, setTempSettings] = useState<CalendarSettings>(settings);

  const handleSubmit = () => {
    setOpen(false);
    updateSettings(tempSettings);
  }

  useEffect(() => {
    if (settings && open) setTempSettings(settings);
  }, [open, settings])

  return tempSettings && <Popup open={open} setOpen={setOpen}>
    <div className="p-2">
      <h2 className="text-center">settings</h2>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {Object.entries(tempSettings).map(([key, setting]: [string, Setting], i: number) => {

          const updateValue = (newVal: boolean) => {
            const newSetting = createSetting(newVal, setting.name, setting.id);
            setTempSettings(old => {
              return { ...old, [key]: newSetting }
            });
          }

          return (
            <label key={i} htmlFor={`setting-${setting.id}`}>
              <div className="border rounded-sm p-2 flex items-center justify-between">
                <p className="text-textHeading">{setting.name}:</p>
                <Checkbox id={`setting-${setting.id}`} checked={setting.value} onCheckedChange={() => updateValue(!setting.value)} />
              </div>
            </label>
          )
        })}
      </div>


      <div className="flex gap-2 justify-end mt-2">
        <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
        <Button variant="default" size="sm" onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  </Popup>
}

export default SettingsPopup