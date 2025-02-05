import React from "react";

const CheckboxInput = ({
  label,
  id
}: {
  label: string,
  id: number
}) => {

  return (
    <div className="p-2 flex gap-2">
      <input
        type="checkbox"
        value={id}
        id={`${label}-${id}`}
      />
      <label htmlFor={`${label}-${id}`}>{label}</label>
    </div>
  )
};

export default CheckboxInput;
