import { Dispatch, SetStateAction } from "react";

interface SelectorProps {
  state: string;
  changeState: Dispatch<SetStateAction<string>>;
  options: string[];
  defaultOption?: { label: string; value: string };
  description?: string;
}

export default function Selector({
  state,
  changeState,
  options,
  defaultOption = null,
  description = "Filtered to",
}: SelectorProps) {
  return (
    <div className="col-span-6 sm:col-span-3">
      <label
        htmlFor="groupSelector"
        className="block text-sm font-medium text-gray-800"
      >
        {description}
      </label>
      <div className="mt-2 relative">
        <select
          value={state}
          onChange={(e) => changeState(e.target.value)}
          name="groupSelect"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {defaultOption && (
            <option value={defaultOption.value}>{defaultOption.label}</option>
          )}
          {options &&
            options.map((option) => (
              <option key={option} value={option} className="capitalize">
                {option
                  .toLowerCase()
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
