"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Calendar as CalendarIcon, X as ClearIcon } from "lucide-react";
import { DayPicker, DateRange } from "react-day-picker";
import moment from "moment";
import "react-day-picker/dist/style.css";

export function DateRangePicker(props: any) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: props.date.from,
    to: props.date.to,
  });

  const clearDates = () => {
    setDate(undefined);
  };

  const handelSelect = (e: any) => {
    if (e.from && e.to) {
      props.onChange(e);
    }

    setDate(e);
  };
  return (
    <div className="flex flex-col space-y-2">
      <Popover.Root>
        <Popover.Trigger asChild>
          <button className="flex items-center w-[280px] justify-between text-left font-normal border rounded-md px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800">
            <span className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {moment(date.from).format("MMM DD, YYYY")}-
                    {moment(date.to).format("MMM DD, YYYY")}
                  </>
                ) : (
                  moment(date.from).format("MMM DD, YYYY")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </span>
            {date && (
              <ClearIcon
                className="h-4 w-4 text-gray-400 hover:text-red-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // prevent popover opening
                  clearDates();
                }}
              />
            )}
          </button>
        </Popover.Trigger>

        <Popover.Content
          className="bg-white dark:bg-gray-900 p-3 rounded-md shadow-lg border z-50"
          align="start"
        >
          <DayPicker
            mode="range"
            selected={date}
            onSelect={handelSelect}
            numberOfMonths={2}
          />

          {/* Clear Button */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={clearDates}
              className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 dark:hover:bg-red-900"
            >
              Clear
            </button>
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
