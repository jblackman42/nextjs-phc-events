import React, { useContext, useEffect, useState } from 'react';
import Popup from './Popup';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button"
import { CalendarSettings, createSetting } from '@/lib/utils';
import { Switch } from "@/components/ui/switch"

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
    <div className="bg-secondary">
      <div className="p-2 border-b-4 border-accent">
        <h2 className="text-center">settings</h2>
      </div>
      <div className="grid grid-cols-1 gap-2 m-2">
        {Object.entries(tempSettings).map(([key, setting]: [string, Setting], i: number) => {

          const updateValue = (newVal: boolean) => {
            const newSetting = createSetting(newVal, setting.name, setting.id);
            setTempSettings(old => {
              return { ...old, [key]: newSetting }
            });
          }

          return (
            <label key={i} htmlFor={`setting-${setting.id}`}>
              <div className="bg-primary rounded-sm p-2 flex items-center justify-between shadow-md">
                <p className="text-textHeading">{setting.name}:</p>
                {/* <Checkbox id={`setting-${setting.id}`} checked={setting.value} onCheckedChange={() => updateValue(!setting.value)} /> */}
                <Switch id={`setting-${setting.id}`} checked={setting.value} onCheckedChange={() => updateValue(!setting.value)} />
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